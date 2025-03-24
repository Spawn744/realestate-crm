"""
URL configuration for realestate_crm project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework import routers
from crm_api import views
from crm_api.views import DashboardStats, AppointmentViewSet, UserRegistrationView, CustomTokenObtainPairView


router = routers.DefaultRouter()
router.register(r'properties', views.PropertyViewSet, basename='property')
router.register(r'leads', views.LeadViewSet, basename = 'lead')
router.register(r'appointments', AppointmentViewSet, basename='appointment')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('crm_api/', include(router.urls)),
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/dashboard/stats/', DashboardStats.as_view(), name='dashboard_stats'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    

