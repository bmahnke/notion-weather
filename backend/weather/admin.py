from django.contrib import admin

# Register your models here.
from .models import TomorrowIoRequest

class TomorrowIoRequestAdmin(admin.ModelAdmin):
    list_display = ("timesteps", "location_query", "units", "requested_at")

admin.site.register(TomorrowIoRequest, TomorrowIoRequestAdmin)