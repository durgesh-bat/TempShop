from django.core.management.base import BaseCommand
from django.utils import timezone
from account.models import RevokedToken


class Command(BaseCommand):
    help = 'Clean up expired revoked tokens'

    def handle(self, *args, **options):
        deleted_count = RevokedToken.objects.filter(expires_at__lt=timezone.now()).delete()[0]
        self.stdout.write(self.style.SUCCESS(f'Deleted {deleted_count} expired revoked tokens'))
