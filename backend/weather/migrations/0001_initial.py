# Generated by Django 4.2.6 on 2023-10-25 13:02

import django.contrib.gis.db.models.fields
import django.contrib.gis.geos.point
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TomorrowIoRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('requestQuery', models.CharField(max_length=250)),
                ('location', django.contrib.gis.db.models.fields.PointField(default=django.contrib.gis.geos.point.Point(0.0, 0.0), geography=True, srid=4326)),
                ('locationType', models.CharField(max_length=100)),
                ('locationName', models.CharField(max_length=250)),
                ('returnData', models.JSONField()),
            ],
        ),
    ]