# Generated by Django 4.2.6 on 2023-11-03 18:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('weather', '0003_remove_tomorrowiorequest_requestquery_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tomorrowiorequest',
            name='timesteps',
            field=models.CharField(max_length=100, null=True),
        ),
    ]