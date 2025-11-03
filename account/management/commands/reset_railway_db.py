from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Drop all tables from the database'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            for table in tables:
                table_name = table[0]
                self.stdout.write(f"Dropping table: {table_name}")
                cursor.execute(f"DROP TABLE IF EXISTS `{table_name}`")
            
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1")
            
        self.stdout.write(self.style.SUCCESS('\n✅ All tables dropped!'))
        self.stdout.write('Now run: python manage.py migrate')
