from django.contrib import admin
from .models import Substation, Feeder
from .models import GencoReadings

admin.site.register(Substation)
admin.site.register(Feeder)
admin.site.register(GencoReadings)

