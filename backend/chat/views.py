from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework.response import Response
from . import models
from . import serializers


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def addTest(request):
    text = request.GET['text']
    try:
        models.TestDB.objects.create(test=text)
        return Response(data='oke', status=status.HTTP_200_OK)
    except:
        return Response(data='no oke', status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def getTest(request):
    obj = models.TestDB.objects.all()
    rs = serializers.TestSerializer(obj, many=True)
    return Response(data=rs.data, status=status.HTTP_200_OK)
