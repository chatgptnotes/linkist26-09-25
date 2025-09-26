# 🎴 Linkist NFC - Smart Digital Business Cards

**Modern NFC-enabled digital business cards for seamless networking**

![TypeScript](https://img.shields.io/badge/TypeScript-99.4%25-blue?style=flat-square)
![CSS](https://img.shields.io/badge/CSS-0.6%25-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=flat-square)

## ✨ Features

### 🚀 Core Features
- **Smart NFC Cards** - Tap to share contact information instantly
- **Live Card Preview** - Real-time preview of your digital business card
- **Professional Design** - Apple-style UI with smooth animations
- **Mobile Responsive** - Works perfectly on all devices
- **QR Code Generation** - Automatic QR codes for easy sharing

### 💼 Business Features
- **Order Management** - Complete ordering system with admin panel
- **Payment Integration** - Secure payments with Stripe
- **Email Notifications** - Automated order confirmations and updates
- **User Authentication** - Secure login and account management
- **GDPR Compliant** - Full privacy controls and data protection

### 🎨 User Experience
- **Hero Section** - Eye-catching landing page with video background
- **Order Now Button** - Direct path to card configuration
- **Mobile Verification** - OTP verification with bypass option
- **Image Upload** - Profile and background image support
- **Social Media Links** - Instagram, LinkedIn, Twitter integration

## 🛠 Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Storage**: Supabase Storage
- **Email**: Custom email service
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chatgptnotes/linkist26-09-25.git
   cd linkist26-09-25
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret

   # Email Configuration
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_email
   SMTP_PASSWORD=your_password
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   ```
   http://localhost:3000
   ```

## 📱 Usage

### For Customers
1. **Visit Homepage** - Browse features and pricing
2. **Click Order Now** - Start card configuration
3. **Fill Details** - Enter personal and business information
4. **Upload Images** - Add profile photo and background
5. **Preview Card** - See live preview of your card
6. **Complete Order** - Secure payment and confirmation

### For Admins
1. **Admin Login** - Access admin panel
2. **Manage Orders** - View and update order status
3. **Customer Management** - View customer information
4. **Analytics** - Track sales and performance

## 🔧 Configuration

### Database Schema
The project uses Supabase with these main tables:
- `card_configs` - NFC card configurations
- `orders` - Order management
- `users` - User authentication
- `otp_codes` - Mobile verification

### API Routes
- `/api/save-card-config` - Save card configuration
- `/api/process-order` - Handle order processing
- `/api/send-mobile-otp` - Mobile verification
- `/api/create-payment-intent` - Stripe payments
- `/api/admin/*` - Admin panel APIs

## 🎨 Customization

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Components** - Reusable UI components
- **Responsive Design** - Mobile-first approach
- **Dark/Light Themes** - Easy theme switching

### Features
- **Mobile Verification** - Optional OTP verification
- **Image Upload** - Profile and background images
- **Social Links** - Customizable social media links
- **Card Types** - Different card designs

## 📧 Email Templates

Professional email templates included:
- Order confirmation
- Payment receipts
- Shipping notifications
- Account verification

## 🔒 Security

- **Input Validation** - Zod schema validation
- **SQL Injection Prevention** - Supabase RLS policies
- **Authentication** - Secure JWT tokens
- **HTTPS Only** - SSL/TLS encryption
- **GDPR Compliance** - Privacy controls

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized for speed
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Performance-first approach

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Claude Code** - AI Development Assistant
- **chatgptnotes** - Project Maintainer

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Supabase for backend infrastructure
- Stripe for payment processing
- Tailwind CSS for styling system

---

**Network Differently with Linkist NFC Cards** 🚀

For support, email: support@linkist.app
Visit: [Linkist Website](https://linkist-app.vercel.app)
