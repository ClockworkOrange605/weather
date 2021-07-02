import datetime
import json

from django.http import JsonResponse
from django.core.serializers import serialize

from weather.models import Weather

def index(request):
    PERIODS = {
        '1': datetime.datetime.now() - datetime.timedelta(days=1),
        '2': datetime.datetime.now() - datetime.timedelta(days=7),
        '3': datetime.datetime.now() - datetime.timedelta(days=30),
    }

    timeLimit = PERIODS[request.GET['period']]

    data = Weather.objects.filter(dt__gte=timeLimit)

    return JsonResponse({"data": json.loads(serialize('json', data))})
