from django.core.management.base import BaseCommand

from coincoin.tasks import update_boards


class Command(BaseCommand):
    help = "updates boards"

    def handle(self, *args, **options):
        update_boards()
