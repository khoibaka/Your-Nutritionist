# Generated by Django 3.0.5 on 2020-05-29 02:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('recipe', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='step',
            old_name='time',
            new_name='timestamp',
        ),
    ]
