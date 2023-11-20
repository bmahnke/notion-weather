# Generated by Django 4.2.6 on 2023-11-17 20:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('weather', '0008_remove_googlemapapirequest_gmar_placeid_createdat_idx_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tomorrowiorequest',
            name='location',
        ),
        migrations.RemoveField(
            model_name='tomorrowiorequest',
            name='location_name',
        ),
        migrations.RemoveField(
            model_name='tomorrowiorequest',
            name='location_type',
        ),
        migrations.AddField(
            model_name='tomorrowiorequest',
            name='google_map_request',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='weather.googlemapapirequest'),
            preserve_default=False,
        ),
    ]
