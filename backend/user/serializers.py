from . import models
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CustomUser
        fields = ['id', 'username', 'avatar', 'first_name',
                  'last_name', ]


class LoginSerializer(serializers.ModelSerializer):
    access = serializers.CharField(max_length=200)
    refresh = serializers.CharField(max_length=200)

    class Meta:
        model = models.CustomUser
        fields = ['access', 'refresh']


class FriendSerializer(serializers.ModelSerializer):
    userFirst = ProfileSerializer(read_only=True)
    userSecond = ProfileSerializer(read_only=True)

    class Meta:
        model = models.UserRelationship
        fields = '__all__'
