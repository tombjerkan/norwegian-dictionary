from rest_framework import viewsets

from .googletranslate import google_translate
from .models import StarredTerm
from .ordbok import ordbok
from .serializers import StarredTermSerializer
from .wiktionary import wiktionary


class StarredTermViewSet(viewsets.ModelViewSet):
    queryset = StarredTerm.objects.all()
    serializer_class = StarredTermSerializer
