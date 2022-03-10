from rest_framework import serializers
from . import models


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ChatContent
        fields = ['user', 'content']


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestDB
        fields = '__all__'
