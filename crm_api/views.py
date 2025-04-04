from django.utils import timezone
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, permissions, generics
from .models import Property, Lead, Appointment, PropertyImage
from .serializers import PropertySerializer, LeadSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, AppointmentSerializer, UserRegistrationSerializer
from rest_framework.parsers import MultiPartParser

class UserProfileView(APIView):
    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
            'phone': user.phone,
            'agency': user.agency
        }, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True) #correction was done
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [ IsAuthenticated ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate token for new user
        refresh = CustomTokenObtainPairSerializer.get_token(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        return serializer.save()
    
class PropertyDetailView(APIView):
    def get(self, request, pk):
        property = get_object_or_404(Property, pk=pk) 
        serializer = PropertySerializer(property)
        return Response(serializer.data)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(agent=self.request.user)

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Property.objects.filter(agent=self.request.user)
    @action(detail=True, methods=['POST'], parser_classes=[MultiPartParser]) 
    def upload_images(self, request, pk=None):
        property = self.get_object()
        images = request.FILES.getlist('images')
        
        try:
            for image in images:
                self.PropertyImage(property, image)
            return Response({'status': 'images uploaded'}, status=201)
        except Exception as e:
            return Response({'message': str(e)}, status=400)

    def PropertyImage(self, property, image):
        PropertyImage.objects.create(property=property, image=image)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        property = serializer.save(agent=self.request.user)
        
        # Debugging: Print what is being returned
        print("Serialized response data:", PropertySerializer(property).data)
        
        return Response(PropertySerializer(property).data, status=status.HTTP_201_CREATED)
    
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Lead.objects.filter(property__agent=self.request.user)


class DashboardStats(APIView):
    def get(self, request):
        agent = request.user
        total_leads = Lead.objects.filter(property__agent=agent)
        
        # Calculate conversion rate safely
        conversion_rate = 0
        if total_leads.exists():
            converted_leads = total_leads.filter(status='converted').count()
            conversion_rate = round(
                (converted_leads / total_leads.count()) * 100, 
                2
            )

        return Response({
            'activeLeads': total_leads.filter(status='active').count(),
            'todayAppointments': Appointment.objects.filter(
                agent=agent, 
                datetime__date=timezone.now().date()
            ).count(),
            'conversionRate': conversion_rate,
            'salesData': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                'values': [65000, 59000, 80000, 81000, 56000]
            },
            'leadSources': [
                {'label': 'Website', 'value': 45},
                {'label': 'Referrals', 'value': 25},
                {'label': 'Social Media', 'value': 30}
            ]
        })
            
    
# Create your views here.;