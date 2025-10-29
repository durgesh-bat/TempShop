-- Drop all tables in correct order (respecting foreign key constraints)

-- Drop cart tables
DROP TABLE IF EXISTS cart_cartitem CASCADE;
DROP TABLE IF EXISTS cart_cart CASCADE;

-- Drop shopkeeper tables
DROP TABLE IF EXISTS shopkeeper_shopkeeperreview CASCADE;
DROP TABLE IF EXISTS shopkeeper_shopkeeperdocument CASCADE;
DROP TABLE IF EXISTS shopkeeper_shopkeeperorder CASCADE;
DROP TABLE IF EXISTS shopkeeper_shopkeeperproduct CASCADE;
DROP TABLE IF EXISTS shopkeeper_shopkeeper_user_permissions CASCADE;
DROP TABLE IF EXISTS shopkeeper_shopkeeper_groups CASCADE;
DROP TABLE IF EXISTS shopkeeper_shopkeeper CASCADE;

-- Drop product tables
DROP TABLE IF EXISTS product_productimage CASCADE;
DROP TABLE IF EXISTS product_product CASCADE;
DROP TABLE IF EXISTS product_category CASCADE;

-- Drop account tables
DROP TABLE IF EXISTS account_client_user_permissions CASCADE;
DROP TABLE IF EXISTS account_client_groups CASCADE;
DROP TABLE IF EXISTS account_client CASCADE;
DROP TABLE IF EXISTS account_useraccount CASCADE;

-- Drop auth tables
DROP TABLE IF EXISTS auth_user_user_permissions CASCADE;
DROP TABLE IF EXISTS auth_user_groups CASCADE;
DROP TABLE IF EXISTS auth_user CASCADE;

-- Drop Django tables
DROP TABLE IF EXISTS django_admin_log CASCADE;
DROP TABLE IF EXISTS django_content_type CASCADE;
DROP TABLE IF EXISTS django_migrations CASCADE;
DROP TABLE IF EXISTS django_session CASCADE;
DROP TABLE IF EXISTS auth_permission CASCADE;
DROP TABLE IF EXISTS auth_group_permissions CASCADE;
DROP TABLE IF EXISTS auth_group CASCADE;
