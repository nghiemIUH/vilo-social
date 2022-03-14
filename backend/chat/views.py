from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.core.paginator import Paginator
from django.core.files.storage import FileSystemStorage
from django.contrib.auth import get_user_model
import random
import string
from . import models
from . import serializers


User = get_user_model()

image_extention = ['jpeg', 'jpg', 'png', 'gif', 'ico', 'svg']


def random_name(n):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(n))+'_'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_message(request):
    chat = models.ChatContent.objects.filter(
        chatID=request.data['chatID']).order_by('date')
    rs = serializers.ChatSerializer(chat, many=True)
    return Response(data=rs.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_message_page(request):
    chatID = request.data['chatID']
    chat = models.ChatContent.objects.filter(
        chatID=chatID).order_by('-date')
    page = int(request.data['page'])
    p = Paginator(chat, 15)
    if page > p.num_pages:
        return Response(data=p.num_pages, status=status.HTTP_400_BAD_REQUEST)
    page = p.page(page)
    chat = sorted(page.object_list, key=lambda k: k.date)
    rs = serializers.ChatSerializer(chat, many=True)
    return Response(data=rs.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_file(request):
    file = request.FILES['file']
    fs = FileSystemStorage()
    user = User.objects.get(id=request.data['user_id'])
    chatID = models.UserRelationship.objects.get(chatID=request.data['chatID'])
    f_ext = None
    if file.name.split('.')[-1].lower() not in image_extention:
        f_ext = 'FILE'
        f = fs.save('chat file/'+file.name, file)
        message = fs.url(f)
        models.ChatContent.objects.create(
            user=user,
            message=message,
            chatID=chatID,
            status='FILE'
        )
    else:
        f_ext = 'IMAGE'
        f = fs.save('chat image/'+file.name, file)
        message = fs.url(f)
        models.ChatContent.objects.create(
            user=user,
            message=message,
            chatID=chatID,
            status='IMAGE'
        )
    return Response(data={'message': message, 'status': f_ext}, status=status.HTTP_200_OK)
