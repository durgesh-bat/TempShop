# Generated migration

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shopkeeper', '0001_initial'),
        ('account', '0006_revokedtoken'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderitem',
            name='shopkeeper',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='order_items', to='shopkeeper.shopkeeper'),
        ),
    ]
