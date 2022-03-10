from django.urls import path
from . import views

urlpatterns = [
    path('add-test/', views.addTest),
    path('get-test/', views.getTest)
]
