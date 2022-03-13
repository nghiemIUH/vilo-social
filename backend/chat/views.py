from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from django.core.paginator import Paginator
from . import models
from . import serializers


@api_view(['POST'])
@permission_classes([AllowAny])
def get_message(request):
    chat = models.ChatContent.objects.filter(
        chatID=request.data['chatID']).order_by('date')
    rs = serializers.ChatSerializer(chat, many=True)
    return Response(data=rs.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def get_message_page(request):
    page = int(request.data['page'])
    print(page)
    chatID = request.data['chatID']
    chat = models.ChatContent.objects.filter(chatID=chatID).order_by('date')
    p = Paginator(chat, 15)
    if page > p.num_pages:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    rs = serializers.ChatSerializer(p.page(page), many=True)
    return Response(data=rs.data, status=status.HTTP_200_OK)
