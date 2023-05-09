from django.urls import path

from coincoin import views

app_name = "coincoin"

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
]
