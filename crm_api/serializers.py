from rest_framework import serializers
from .models import CustomUser, Property, Lead, Appointment, PropertyImage
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model


User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'phone', 'agency']
        extra_kwargs = {
            'password': {'write_only': True},
            'role': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'client'),
            phone=validated_data.get('phone', ''),
            agency=validated_data.get('agency', '')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'agency']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role
        token['agency'] = user.agency
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'agency': self.user.agency
        }
        return data

class AppointmentSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.username', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        extra_kwargs = {
            'client_name': {'default': 'Client'},
            'datetime': {'required': True}
        }


class PropertySerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    image_urls = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Property
        fields = '__all__'
        extra_kwargs = {
            'agent': {'read_only': True}
        }

    def get_image_urls(self, obj):
        return [image.image.url for image in obj.images.all()]

    def create(self, validated_data):
        images = validated_data.pop('images', [])
        property = Property.objects.create(**validated_data)
        
        for image in images:
            PropertyImage.objects.create(property=property, image=image)
            
        return property
    
class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'