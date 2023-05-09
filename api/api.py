from rest_framework import routers, serializers, viewsets

from coincoin import models


class BoardSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Board
        fields = "__all__"


class BoardViewSet(viewsets.ModelViewSet):
    queryset = models.Board.objects.all()
    serializer_class = BoardSerializer


router = routers.DefaultRouter(trailing_slash=False)
router.register(r"boards", BoardViewSet, basename="board")
