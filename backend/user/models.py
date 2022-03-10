
from email.policy import default
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import gettext_lazy as _
from django.dispatch import receiver
# Create your models here.

import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class CustomUser(AbstractUser):

    username_validator = UnicodeUsernameValidator()
    username = models.CharField(
        _('username'),
        max_length=150,
        unique=True,
        help_text=_(
            'Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )

    email = models.EmailField(_('email address'), unique=True)
    avatar = models.ImageField(
        upload_to='avatars', default='1f600.png')

    def __str__(self):
        return self.username


class UserRelationship(models.Model):
    class Meta:
        unique_together = ['userFirst', 'userSecond']

    userFirst = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='friend_1')
    userSecond = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='friend_2')
    type = [('FRIEND', 'friend'), ('BLOCK', 'block')]
    status = models.CharField(max_length=10, choices=type, default='FRIEND')
    chatID = models.CharField(max_length=10,  unique=True)


@receiver(models.signals.post_delete, sender=CustomUser)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.avatar:
        if os.path.isfile(instance.avatar.path):
            os.remove(instance.avatar.path)


@receiver(models.signals.pre_save, sender=CustomUser)
def auto_delete_file_on_change(sender, instance, **kwargs):
    if not instance.pk:
        return False
    try:
        old_file = CustomUser.objects.get(pk=instance.pk).avatar
    except CustomUser.DoesNotExist:
        return False
    new_file = instance.avatar
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)
