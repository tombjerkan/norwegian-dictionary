from rest_framework import generics

from .googletranslate import google_translate
from .models import Starred
from .ordbok import ordbok
from .serializers import StarredSerializer
from .wiktionary import wiktionary


class StarredList(generics.ListCreateAPIView):
    queryset = Starred.objects.all()
    serializer_class = StarredSerializer
