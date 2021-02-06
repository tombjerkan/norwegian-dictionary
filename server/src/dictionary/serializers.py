from rest_framework import serializers

from .models import StarredTerm


class StarredTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = StarredTerm
        fields = ['term', 'notes']
