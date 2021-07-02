from datetime import datetime
import requests
import json

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from weather.models import Weather

class Command(BaseCommand):
    help: 'Load available Weather Stats'

    def add_arguments(self, parser):
        parser.add_argument('timestamp', nargs='+', type=int)

    def handle(self, *args, **options):

        apiKey = settings.WEATHER_API_KEY

        lat = '52.5474884050009'
        lon = '39.64518543222794'

        dt = datetime.fromtimestamp(options['timestamp'][0])

        response = requests.get(
            'https://api.openweathermap.org/data/2.5/onecall/timemachine?units=metric'+
                '&lat='+ lat +'&lon='+ lon +
                '&dt='+ str(options['timestamp'][0]) +
                '&appid='+ apiKey
        )

        data = json.loads(response.content)

        for item in data['hourly']:
            Weather.objects.update_or_create(
                dt=datetime.fromtimestamp(item['dt']),
                defaults={
                    'temp':item['temp'],
                    'pressure':item['pressure'],
                    'humidity':item['humidity']
                }
            )

        self.stdout.write(self.style.SUCCESS('Weather Stats Loaded at %s' % dt))