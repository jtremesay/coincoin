import datetime
from typing import Generator
from uuid import UUID
from xml.dom import minidom
from zoneinfo import ZoneInfo

import requests
from celery import shared_task
from django.utils import timezone

from coincoin.models import Board, Post


@shared_task
def update_boards() -> None:
    for board_uuid in Board.objects.order_by("name").values_list(
        "uuid", flat=True
    ):
        update_board.delay(board_uuid)


@shared_task
def update_board(board_uuid: UUID) -> None:
    board = Board.objects.get(uuid=board_uuid)
    print(f"pulling new posts from {board.slug}")
    last_post = board.posts_set.order_by("-id").first()
    last_id = last_post.id if last_post is not None else -1

    response = requests.get(board.backend_url)
    posts = parse_posts(response.text, board, last_id=last_id)
    Post.objects.bulk_create(posts)


def parse_posts(
    xml_text, board: Board, last_id: int = -1
) -> Generator[Post, None, None]:
    dom = minidom.parseString(xml_text)
    board_node = dom.documentElement
    for post_node in board_node.getElementsByTagName("post"):
        id_ = int(post_node.getAttribute("id"))
        if id_ <= last_id:
            continue

        timestamp = timezone.make_aware(
            datetime.datetime.strptime(
                post_node.getAttribute("time"), r"%Y%m%d%H%M%S"
            ),
            ZoneInfo("Europe/Paris"),
        )
        info = post_node.getElementsByTagName("info")[0].childNodes[0].data
        message = (
            post_node.getElementsByTagName("message")[0].childNodes[0].data
        )
        login = post_node.getElementsByTagName("login")[0].childNodes[0].data
        yield Post(
            board=board,
            id=id_,
            timestamp=timestamp,
            info=info,
            message=message,
            login=login,
        )
