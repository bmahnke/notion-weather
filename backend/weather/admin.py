from django.contrib import admin

# Register your models here.
from .models import TomorrowIoRequest

class TomorrowIoRequestAdmin(admin.ModelAdmin):
    list_display = ("locationName", "locationType", "requestedAt", "location")



admin.site.register(TomorrowIoRequest, TomorrowIoRequestAdmin)