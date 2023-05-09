from django.urls import include, path
from rest_framework import serializers, viewsets
from rest_framework_nested import routers

from coincoin import models


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Board
        fields = ["uuid", "name", "slug"]


class BoardViewSet(viewsets.ModelViewSet):
    queryset = models.Board.objects.order_by("name")
    serializer_class = BoardSerializer


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Post
        fields = ["uuid", "id", "timestamp", "login", "message", "info"]


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer

    def get_queryset(self):
        return models.Post.objects.filter(
            board=self.kwargs["board_pk"]
        ).order_by("-id")[:100]


router = routers.DefaultRouter(trailing_slash=False)
router.register(r"boards", BoardViewSet, basename="board")

boards_router = routers.NestedDefaultRouter(router, r"boards", lookup="board")
boards_router.register(r"posts", PostViewSet, basename="board-posts")

urlpatterns = [
    path(r"", include(router.urls)),
    path(r"", include(boards_router.urls)),
]
