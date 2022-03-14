from django.urls import path
from . import views

urlpatterns = [
    path('get-chat/', views.get_message),
    path('get-chat-page/', views.get_message_page),
    path('save-file/', views.save_file)
]
