from django.contrib import admin

from coincoin import models


@admin.register(models.Board)
class BoardAdmin(admin.ModelAdmin):
    list_display = ["slug", "name", "backend_url"]


@admin.register(models.Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["board", "timestamp", "login", "message", "info"]
