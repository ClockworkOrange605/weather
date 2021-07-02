from django.http import JsonResponse
import datetime

def index(request):
    now = datetime.datetime.now()
    return JsonResponse({'status': 'ok', 'timestamp': now})