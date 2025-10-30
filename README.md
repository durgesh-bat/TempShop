# 🛍️ TempShop - E-Commerce Platform

A modern full-stack e-commerce platform built with Django REST Framework and React.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Security](#security)

---

## ✨ Features

### User Features
- 🔐 JWT + CSRF Token Authentication (HttpOnly cookies)
- ✉️ Email verification with OTP
- 📧 OTP-based email verification
- 👤 User profiles with avatar upload
- 🛒 Shopping cart management
- ❤️ Wishlist functionality
- 📦 Order tracking
- ⭐ Product reviews and ratings
- 💳 Multiple payment methods
- 📍 Address management
- 💰 Wallet system
- 🔍 Product search and filtering
- 🏷️ Category-based browsing
- 👁️ Recently viewed products

### Admin Features
- 📊 Admin dashboard
- 🏪 Multi-vendor marketplace
- 📦 Product management
- 🏷️ Category management
- 📈 Order management

### Shopkeeper Features
- 🏪 Shopkeeper portal & dashboard
- 📦 Product inventory management
- 📊 Stock tracking & alerts
- 💰 Revenue & commission tracking
- 📋 Customer order management
- 📈 Sales analytics

### Technical Features
- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🔒 Secure authentication
- 🛡️ Rate limiting & throttling
- 📧 Professional HTML email templates
- ☁️ Cloudinary image storage
- 🗄️ MySQL/PostgreSQL support
- 🔄 Redux state management
- 💾 Client-side caching
- 🎯 Category showcase cards
- 🔗 Dynamic routing with filters
- 🔔 Comprehensive notification system

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Django 5.2
- **API:** Django REST Framework
- **Authentication:** JWT (Simple JWT)
- **Database:** MySQL / PostgreSQL
- **Storage:** Cloudinary
- **Email:** Brevo SMTP

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios
- **Routing:** React Router

---

## 📁 Project Structure

```
TempShop/
├── account/              # User authentication & profiles
├── cart/                 # Shopping cart functionality
├── product/              # Product & category management
├── shopkeeper/           # Shopkeeper portal
├── server/               # Django settings & config
├── templates/            # Email templates
│   └── emails/          # HTML email templates
├── frontend/             # React application
│   ├── src/
│   │   ├── api/         # API integration
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── slices/      # Redux slices
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
├── Docs/                 # Documentation
│   ├── SECURITY.md      # Security guidelines
│   ├── OTP_*.md         # OTP feature docs
│   └── *.md             # Other documentation
├── Scripts/              # Utility scripts
│   ├── check_otp_setup.py
│   ├── apply_otp_migration.bat
│   └── *.sql            # Database scripts
├── .env.example          # Environment template
├── .gitignore           # Git ignore rules
├── manage.py            # Django management
└── requirements.txt     # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- MySQL 8.0+ or PostgreSQL 13+
- Git

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd TempShop
```

#### 2. Backend Setup

**Create virtual environment:**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

**Configure environment:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

**Run migrations:**
```bash
python manage.py migrate
```

**Create superuser:**
```bash
python manage.py createsuperuser
```

**Start server:**
```bash
python manage.py runserver
```

#### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin

---

## 📚 Documentation

### Main Documentation
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - 📚 Complete documentation index
- **[SHOPKEEPER_GUIDE.md](SHOPKEEPER_GUIDE.md)** - 🏪 Multi-vendor & shopkeeper system guide
- **[JWT_CSRF_AUTH.md](Docs/JWT_CSRF_AUTH.md)** - JWT + CSRF authentication guide
- **[SECURITY.md](Docs/SECURITY.md)** - Security guidelines & best practices
- **[RATE_LIMITING.md](Docs/RATE_LIMITING.md)** - Rate limiting & throttling guide
- **[OTP_VERIFICATION.md](Docs/OTP_VERIFICATION.md)** - OTP feature documentation
- **[EMAIL_TEMPLATES_GUIDE.md](Docs/EMAIL_TEMPLATES_GUIDE.md)** - Email template customization
- **[NOTIFICATION_SYSTEM.md](Docs/NOTIFICATION_SYSTEM.md)** - Notification system guide
- **[NOTIFICATION_QUICK_REFERENCE.md](Docs/NOTIFICATION_QUICK_REFERENCE.md)** - Quick notification reference

### Quick Guides
- **[QUICK_START_OTP.md](Docs/QUICK_START_OTP.md)** - OTP setup guide
- **[Scripts/README.md](Scripts/README.md)** - Utility scripts documentation

### Troubleshooting
- **[OTP_TROUBLESHOOTING.md](Docs/OTP_TROUBLESHOOTING.md)** - OTP issues & fixes
- **[FIX_500_ERROR.md](Docs/FIX_500_ERROR.md)** - Common error solutions

---

## 🔒 Security

### Important Security Notes

⚠️ **NEVER commit `.env` file to Git!**

The `.env` file contains sensitive credentials. Always use `.env.example` as a template.

### Setup Credentials

1. Copy example file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your credentials:
   - Django SECRET_KEY
   - Database credentials
   - Cloudinary API keys
   - Brevo SMTP credentials

3. Verify `.env` is in `.gitignore`

For detailed security guidelines, see **[SECURITY.md](Docs/SECURITY.md)**

---

## 🧪 Testing

### Backend Tests
```bash
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 📦 Database Seeding

### Seed Products
Seed categories and products from external API:
```bash
python manage.py seed
```

This will:
1. Fetch all categories from API and save with images
2. Fetch all products and link to categories
3. Skip products without images
4. Upload images to Cloudinary

### Seed Shopkeepers
Create 10 shopkeepers with products:
```bash
python manage.py seed_shopkeepers
```

Or use the setup script:
```bash
Scripts\setup_shopkeepers.bat
```

This creates shopkeepers with:
- Random product assignments (5-15 products each)
- Stock quantities (10-100 units)
- Default password: `shopkeeper123`

---

## 🔧 Utility Scripts

Located in `/Scripts/` directory:

- **check_otp_setup.py** - Verify OTP configuration
- **apply_otp_migration.bat** - Apply OTP migration
- **fix_otp_now.bat** - Automated OTP setup

See [Scripts/README.md](Scripts/README.md) for details.

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/send-otp/` - Send OTP
- `POST /api/auth/verify-otp/` - Verify OTP
- `POST /api/shopkeeper/register/` - Shopkeeper registration
- `POST /api/shopkeeper/login/` - Shopkeeper login

### Products
- `GET /api/products/` - List all products
- `GET /api/product/{id}/` - Product details
- `GET /api/categories/` - List all categories
- `GET /api/category/{slug}/products/` - Products by category
- `GET /api/products-by-category/` - Products grouped by category
- `GET /api/recently-viewed/` - Recently viewed products
- `GET /api/similar-products/{id}/` - Similar products
- `GET /api/search/?q={query}` - Search products

### Cart
- `GET /api/cart/` - Get cart
- `POST /api/cart/add/` - Add to cart
- `DELETE /api/cart/remove/{id}/` - Remove from cart

### User
- `GET /api/auth/profile/` - User profile
- `PATCH /api/auth/profile/` - Update profile
- `GET /api/auth/orders/` - Order history

### Shopkeeper
- `GET /api/shopkeeper/dashboard/` - Dashboard stats
- `GET /api/shopkeeper/products/` - Shopkeeper products
- `POST /api/shopkeeper/products/` - Add product
- `GET /api/shopkeeper/customer-orders/` - Customer orders
- `GET /api/shopkeeper/inventory/` - Inventory overview
- `PATCH /api/shopkeeper/inventory/{id}/stock/` - Update stock

---

## 🎨 Features Showcase

### Email Templates
Professional HTML email templates with:
- Gradient design
- Mobile responsive
- Security warnings
- Brand consistency

### OTP Verification
Modern OTP input with:
- Individual digit boxes
- Auto-focus navigation
- Paste support
- Countdown timer

### UI/UX
- Dark mode support
- Smooth animations
- Toast notifications
- Loading states
- Error handling
- Category showcase cards
- Horizontal scrolling product carousels
- Responsive grid layouts
- Hover effects and transitions

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- Escuela JS API for product data
- Cloudinary for image hosting
- Brevo for email service
- Tailwind CSS for styling
- React Hot Toast for notifications

---

## 📞 Support

For issues and questions:
- Check [Documentation](Docs/)
- Review [Troubleshooting](Docs/OTP_TROUBLESHOOTING.md)
- Open an issue on GitHub

---

**Made with ❤️ using Django & React**
