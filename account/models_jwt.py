from django.db import models
from django.conf import settings


class RevokedToken(models.Model):
    """Track revoked JWT tokens by JTI"""
    jti = models.CharField(max_length=255, unique=True, db_index=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='revoked_tokens')
    revoked_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    token_type = models.CharField(max_length=10, choices=[('access', 'Access'), ('refresh', 'Refresh')])

    class Meta:
        db_table = 'revoked_tokens'
        indexes = [
            models.Index(fields=['jti']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return f"{self.token_type} - {self.jti[:8]}..."
