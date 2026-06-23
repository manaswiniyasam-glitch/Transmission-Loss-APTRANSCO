from django.db import models
from django.contrib import admin

class GencoReadings(models.Model):
    # DBeaver lo unna column names thone fields create cheyalai
    feeder_name = models.CharField(max_length=255, null=True, blank=True)
    meter_type = models.CharField(max_length=100, null=True, blank=True)
    mf = models.FloatField(default=1.0)
    opening_reading = models.FloatField(default=0.0)
    status = models.CharField(max_length=100, default="OK")

    def __str__(self):
        return self.feeder_name



class EnergyReading(models.Model):
    feeder = models.CharField(max_length=255, null=True, blank=True)
    feeder_type = models.CharField(max_length=100, null=True, blank=True)
    
    # Set 1
    mf_1 = models.FloatField(default=0.0)
    initial_1 = models.FloatField(default=0.0)
    final_1 = models.FloatField(default=0.0)
    
    # Set 2
    mf_2 = models.FloatField(default=0.0)
    initial_2 = models.FloatField(default=0.0)
    final_2 = models.FloatField(default=0.0)
    
    # Calculations & Others
    comp_cons = models.FloatField(default=0.0)
    energy_mu = models.FloatField(default=0.0)
    status = models.CharField(max_length=100, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    
    reading_date = models.DateField(auto_now_add=True)
    def __str__(self):
        return f"{self.feeder} - {self.reading_date}"

class Substation(models.Model):
            name = models.CharField(max_length=100, unique=True)
            def __str__(self):
                return self.name

class Feeder(models.Model):
    substation = models.ForeignKey(Substation, on_delete=models.CASCADE, related_name='feeders')
    name = models.CharField(max_length=100)
    mf = models.FloatField(default=1.0)
    type = models.CharField(max_length=20, default='Import')

    def __str__(self):
        return f"{self.name} ({self.substation.name})"

class Discom(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

# 2. Second: District (Normal Districts)
class District(models.Model):
    discom = models.ForeignKey(Discom, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

# 3. Third: PrivateDeveloper (Kothaga add chesindi)
class PrivateDeveloper(models.Model):
    discom = models.ForeignKey(Discom, on_delete=models.CASCADE, related_name='private_developers')
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

# 4. Fourth: Substation (Link to both District and PrivateDeveloper)
class Substation(models.Model):
    # District nunchi vachina SS ayithe idi
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    # Private Developer nunchi vachina SS ayithe idi
    private_developer = models.ForeignKey(PrivateDeveloper, on_delete=models.SET_NULL, null=True, blank=True, related_name='substations')
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name

# 5. Fifth: Feeder (Substation ki link ayi untundi)
class Feeder(models.Model):
    substation = models.ForeignKey(Substation, on_delete=models.CASCADE, related_name='feeders')
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name
    
# dashboard/models.py lo idhi undali
class GencoReadings(models.Model):
    feeder_name = models.CharField(max_length=100)
    meter_type = models.CharField(max_length=50)
    mf = models.FloatField()
    opening_reading = models.FloatField()
    status = models.CharField(max_length=20)
