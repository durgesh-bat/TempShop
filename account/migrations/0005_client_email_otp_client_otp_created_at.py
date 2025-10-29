from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_recentlyviewed'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='email_otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name='client',
            name='otp_created_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
