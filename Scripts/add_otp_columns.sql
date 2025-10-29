-- Add OTP columns to account_client table
-- Run this if migration fails

USE your_database_name;  -- Replace with your actual database name

-- Add email_otp column
ALTER TABLE account_client 
ADD COLUMN email_otp VARCHAR(6) NULL;

-- Add otp_created_at column
ALTER TABLE account_client 
ADD COLUMN otp_created_at DATETIME NULL;

-- Verify columns were added
DESCRIBE account_client;
