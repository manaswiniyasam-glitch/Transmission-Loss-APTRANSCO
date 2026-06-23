"""
URL configuration for aptransco_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
from django.urls import path # Ee line thappakunda undali
from dashboard import views



urlpatterns = [
    path('admin/', admin.site.urls),

    # 1. Login Page (Root path)
    path('', views.login_view, name='login'),

    # 2. Home & Dashboard
    path('home/', views.home_view, name='home'),
    path('dashboard/', views.home_view, name='dashboard'),

    # 3. Power & Transmission
    path('transmission-network/', views.transmission_view, name='transmission'),
    path('energy-certification/', views.energy_certification_view, name='energy_certification'),
    
    # 4. Settlements & DSM
    path('fbss/', views.fbss_view, name='fbss'),
    path('dsm/', views.dsm_view, name='dsm'),

    # 5. OA & Migration
    path('intrastate-oa/', views.intrastate_oa_view, name='intrastate_oa'),
    path('migration/', views.migration_view, name='migration'),

    # 6. Employee Mapping
    path('emp-distmap/', views.emp_distmap_view, name='emp_distmap'),

   path('save-energy-data/', views.save_energy_data, name='save_energy_data'),

   path('add-substation/', views.save_substation_data, name='add_substation'),

   path('get-private-developers/', views.get_private_developers, name='get_private_developers'),

   path('api/get-genco-readings/', views.get_genco_readings, name='get_genco_readings'),

]

