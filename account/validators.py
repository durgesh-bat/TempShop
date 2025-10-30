import re
from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email

def validate_email(email):
    """Validate email format and check for suspicious patterns including header injection"""
    if not email or len(email) > 254:
        raise ValidationError("Invalid email length")
    
    # Check if email is a list/array (multiple emails)
    if isinstance(email, (list, tuple)):
        raise ValidationError("Multiple emails not allowed")
    
    # Check for email header injection attempts
    header_injection_patterns = [
        r'\r', r'\n', r'%0d', r'%0a',  # Newline characters
        r'\bcc:', r'\bbcc:', r'\bto:', r'\bfrom:',  # Email headers
        r'content-type:', r'mime-version:', r'subject:',  # MIME headers
    ]
    for pattern in header_injection_patterns:
        if re.search(pattern, email, re.IGNORECASE):
            raise ValidationError("Invalid email format - header injection detected")
    
    # Check for comma or semicolon (multiple email separator)
    if ',' in email or ';' in email:
        raise ValidationError("Multiple emails not allowed")
    
    try:
        django_validate_email(email)
    except ValidationError:
        raise ValidationError("Invalid email format")
    
    # Check for suspicious patterns
    suspicious_patterns = [
        r'\.\.', r'@.*@', r'^\.',  # Multiple dots, multiple @, starts with dot
        r'<script', r'javascript:', r'onerror=',  # XSS attempts
    ]
    for pattern in suspicious_patterns:
        if re.search(pattern, email, re.IGNORECASE):
            raise ValidationError("Invalid email format")
    
    return email.lower().strip()

def validate_username(username):
    """Validate username - alphanumeric, underscore, hyphen only"""
    if not username or len(username) < 3 or len(username) > 30:
        raise ValidationError("Username must be 3-30 characters")
    
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        raise ValidationError("Username can only contain letters, numbers, underscore, and hyphen")
    
    # Check for suspicious patterns
    if re.search(r'(admin|root|system|test|null|undefined)', username, re.IGNORECASE):
        raise ValidationError("Username not allowed")
    
    return username.strip()

def validate_phone(phone):
    """Validate phone number"""
    if not phone:
        return phone
    
    # Remove spaces and common separators
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    
    if not re.match(r'^\+?[0-9]{10,15}$', cleaned):
        raise ValidationError("Invalid phone number format")
    
    return cleaned

def validate_text_input(text, field_name, max_length=255):
    """Validate general text input for XSS and injection"""
    if not text:
        return text
    
    if len(text) > max_length:
        raise ValidationError(f"{field_name} exceeds maximum length")
    
    # Check for XSS patterns
    xss_patterns = [
        r'<script', r'javascript:', r'onerror=', r'onclick=',
        r'<iframe', r'<object', r'<embed', r'eval\(',
    ]
    for pattern in xss_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            raise ValidationError(f"Invalid {field_name} - contains forbidden content")
    
    return text.strip()

def validate_otp(otp):
    """Validate OTP format"""
    if not otp or not isinstance(otp, str):
        raise ValidationError("Invalid OTP")
    
    if not re.match(r'^\d{6}$', otp):
        raise ValidationError("OTP must be 6 digits")
    
    return otp

def validate_address_data(data):
    """Validate address data"""
    required_fields = ['street', 'city', 'state', 'postal_code', 'country']
    
    for field in required_fields:
        if field not in data or not data[field]:
            raise ValidationError(f"{field} is required")
        data[field] = validate_text_input(data[field], field, 255)
    
    # Validate postal code format
    if not re.match(r'^[A-Z0-9\s-]{3,10}$', data['postal_code'], re.IGNORECASE):
        raise ValidationError("Invalid postal code format")
    
    return data

def validate_product_data(data):
    """Validate product data for shopkeeper"""
    if 'name' in data:
        data['name'] = validate_text_input(data['name'], 'Product name', 200)
    
    if 'description' in data:
        data['description'] = validate_text_input(data['description'], 'Description', 2000)
    
    if 'price' in data:
        try:
            price = float(data['price'])
            if price < 0 or price > 1000000:
                raise ValidationError("Invalid price range")
        except (ValueError, TypeError):
            raise ValidationError("Invalid price format")
    
    if 'stock' in data:
        try:
            stock = int(data['stock'])
            if stock < 0 or stock > 100000:
                raise ValidationError("Invalid stock range")
        except (ValueError, TypeError):
            raise ValidationError("Invalid stock format")
    
    return data

def sanitize_html(text):
    """Remove HTML tags from text"""
    if not text:
        return text
    return re.sub(r'<[^>]+>', '', text)
