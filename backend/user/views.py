from . import models
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Q
import json

#
from .serializers import ProfileSerializer, FriendSerializer
User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    user = request.data
    auth = authenticate(username=user['username'],
                        password=user['password'])

    if auth is None:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    token = TokenObtainPairSerializer().get_token(user=auth)
    data = ProfileSerializer(instance=auth)
    data = {'user': data.data}
    data['refresh'] = str(token)
    data['access'] = str(token.access_token)
    return Response(data=data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    data = request.data
    if User.objects.filter(username=data['username']).exists():
        return Response(data='Username exist', status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=data['email']).exists():
        return Response(data='Email exist', status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=data['username'],
        password=data['password'],
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        avatar=data['avatar'],

    )
    user.save()
    return Response(status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    rs = ProfileSerializer(user)
    return Response(data=rs.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update(request):
    rs = ProfileSerializer(instance=request.user,
                           data=request.data, partial=True)

    if rs.is_valid():
        rs.save()
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getFriend(request):
    user = request.user
    friends = models.UserRelationship.objects.filter(
        Q(userFirst=user) | Q(userSecond=user))
    rs = FriendSerializer(friends, many=True)
    return Response(data=rs.data, status=status.HTTP_200_OK)
