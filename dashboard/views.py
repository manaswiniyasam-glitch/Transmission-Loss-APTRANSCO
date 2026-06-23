import json
from datetime import date
from django.shortcuts import render, redirect  
from django.db import connection
from django.http import JsonResponse
from .models import EnergyReading
from .models import EnergyReading as EnergyReadingModel
from .models import Substation, Feeder
from .models import PrivateDeveloper
from .models import GencoReadings
from .models import Substation

# 1. Login Page
def login_view(request): 
    if request.method == 'POST':
        return redirect('home')
    return render(request, 'dashboard/login.html')

# 2. Home View 
def home_view(request):
    with connection.cursor() as cursor:
        
        cursor.execute('SELECT * FROM "public"."dashboard_energyreading" LIMIT 10')
        rows = cursor.fetchall()
    return render(request, 'dashboard/dashboard.html', {'dash_data': rows})

# 4. Database Migration Page
def migration_view(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM "public"."django_migrations" LIMIT 10')
        rows = cursor.fetchall()
    return render(request, 'dashboard/databasemigration.html', {'migration_data': rows})

# 5. DSM Application
def dsm_view(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM "public"."discom_abstracts" LIMIT 10')
        rows = cursor.fetchall()
    return render(request, 'dashboard/dsmapplication.html', {'dsm_data': rows})

# 6. Intrastate OA Page
def intrastate_oa_view(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM "public"."metermaster" LIMIT 10')
        rows = cursor.fetchall()
    return render(request, 'dashboard/intrastateOA.html', {'intra_data': rows})

# 7. Energy Certification Page
def energy_certification_view(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM "public"."energy_readings" LIMIT 10')
        rows = cursor.fetchall()
    return render(request, 'dashboard/energycertification.html', {'cert_data': rows})

def transmission_view(request):
    calculated_data = []
    with connection.cursor() as cursor:
        cursor.execute('''
            SELECT 
                physical_id, 
                prev_in_reading, curr_in_reading, 
                prev_out_reading, curr_out_reading, 
                mf 
            FROM "public"."ss_master"
        ''')
        rows = cursor.fetchall()

        for row in rows:
            mf = float(row[5]) if row[5] else 1.0
            in_energy = (float(row[2]) - float(row[1])) * mf
            out_energy = (float(row[4]) - float(row[3])) * mf
            loss = in_energy - out_energy
            percent = (loss / in_energy * 100) if in_energy > 0 else 0

            calculated_data.append({
                'id': row[0],
                'loss': round(loss, 2),
                'percent': round(percent, 2)
            })

    return render(request, 'dashboard/transmissionnetwork.html', {'data': calculated_data})

def fbss_view(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM "public"."discom_abstracts" LIMIT 10')
        rows = cursor.fetchall()
    return render(request, 'dashboard/fbss.html', {'fbss_data': rows})


def emp_distmap_view(request):
    with connection.cursor() as cursor:
        cursor.execute('SELECT * FROM "public"."emp_distmap" LIMIT 10')
        rows = cursor.fetchall()
    return render(request, 'dashboard/emp_distmap.html', {'distmap_data': rows})

def add_substation(request):
    if request.method == "POST":
        ss_name = request.POST.get('name')

        with connection.cursor() as cursor:
            cursor.execute("SELECT nextval('substation_id_seq')")
            next_num = cursor.fetchone()[0]

            formatted_id = f"ss{next_num:05d}"

            cursor.execute(
                'INSERT INTO "public"."master_substations" (substationid, name) VALUES (%s, %s)',
                [formatted_id, ss_name]
            )
        
        return redirect('transmission')

        # Line 106: Function definition

def save_energy_data(request): 
    if request.method == 'POST':
        try:
            
            data = json.loads(request.body)
            
           
            if isinstance(data, list):
                for item in data:
                    EnergyReading.objects.create(
                        feeder=item.get('feeder'),
                        energy_mu=item.get('energy_mu'),
                        
                    )
            else:
                
                EnergyReading.objects.create(
                    feeder=data.get('substation'), 
                    energy_mu=data.get('total_mu')
                )
            
            return JsonResponse({'status': 'success', 'message': 'Data Saved Successfully!'})
        
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid Request'}, status=400)
def EnergyReadingView(request): 
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            
            return JsonResponse({'status': 'success', 'message': 'Data saved successfully!'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
            
    return render(request, 'transmission.html')

def add_new_substation(request):
    if request.method == "POST":
        data = json.loads(request.body)
        sub_name = data.get('name')
        feeders_list = data.get('feeders') # Idi oka list laa ravali

        # Substation create chestundi
        sub, created = Substation.objects.get_or_create(name=sub_name)
        
        # Feeders add chestundi
        for f_name in feeders_list:
            Feeder.objects.create(substation=sub, name=f_name.strip())
            
        return JsonResponse({'status': 'success', 'message': 'Substation Added!'})
# views.py lo logic
def save_substation_data(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            sub_name = data.get('name')
            feeders = data.get('feeders')

            # Database lo save chese logic
            sub, created = Substation.objects.get_or_create(name=sub_name)
            for f_name in feeders:
                if f_name.strip():
                    Feeder.objects.create(substation=sub, name=f_name.strip())
            
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})


def get_private_developers(request):
    discom_id = request.GET.get('discom_id')
    
    # Ee okka condition pettandi, error raadhu
    if not discom_id or discom_id == "":
        return JsonResponse([], safe=False)
        
    developers = PrivateDeveloper.objects.filter(discom_id=discom_id).values('id', 'name')
    return JsonResponse(list(developers), safe=False)

# views.py lo idi confirm cheskondi
def your_view(request):
    data = Districts.objects.all() 
    # 'districts' ane key correct ga undali, HTML loop lo idhe vaadaali
    return render(request, 'your_page.html', {'districts': data})

def get_genco_readings(request):
    # Database nunchi data motham tiskuntunnam
    readings = GencoReadings.objects.all().values(
        'feeder_name', 'meter_type', 'mf', 'opening_reading', 'status'
    )
    return JsonResponse(list(readings), safe=False)
