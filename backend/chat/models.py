from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime
from user.models import UserRelationship
# Create your models here.


class ChatContent(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    message = models.TextField()
    date = models.DateTimeField(default=datetime.now, blank=True)
    chatID = models.ForeignKey(
        UserRelationship, to_field='chatID', on_delete=models.CASCADE)
    type = [('TEXT', 'text'), ('IMAGE', 'image'), ('FILE', 'file')]
    status = models.CharField(max_length=10, choices=type, default='TEXT')
    isDelete = models.BooleanField(default=False)
