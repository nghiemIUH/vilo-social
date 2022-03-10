
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login),
    path('signin/', views.signin),
    path('profile/', views.profile),
    path('update/', views.update),
    path('get-friend/', views.getFriend),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
