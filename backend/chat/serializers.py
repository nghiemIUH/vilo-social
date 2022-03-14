from rest_framework import serializers
from django.contrib.auth import get_user_model
from . import models


class ChatSerializer(serializers.ModelSerializer):
    user_id = get_user_model()

    class Meta:
        model = models.ChatContent
        fields = ['user_id', 'message', 'status']
