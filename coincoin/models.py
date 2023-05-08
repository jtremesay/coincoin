from uuid import uuid4 as UUID4

from autoslug import AutoSlugField
from django.db import models


class Board(models.Model):
    uuid = models.UUIDField(primary_key=True, default=UUID4)
    name = models.CharField(max_length=32)
    slug = AutoSlugField(populate_from="name")
    backend_url = models.URLField(max_length=256)

    def __str__(self):
        return self.name if self.name else "UNNAMED"


class Post(models.Model):
    class Meta:
        unique_together = [["board", "id"]]

    uuid = models.UUIDField(primary_key=True, default=UUID4)
    board = models.ForeignKey(
        Board, on_delete=models.CASCADE, related_name="posts_set"
    )
    id = models.PositiveIntegerField()
    timestamp = models.DateTimeField()
    info = models.CharField(max_length=256)
    message = models.TextField()
    login = models.CharField(max_length=32)
