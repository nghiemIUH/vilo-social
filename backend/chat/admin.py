from django.contrib import admin
from . import models
# Register your models here.


class ChatContentAdmin(admin.ModelAdmin):
    list_display = ("user", "date", 'chatID', )


admin.site.register(models.ChatContent, ChatContentAdmin)
