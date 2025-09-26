# Multi-Product Business Web App

A comprehensive, mobile-first business management web application built with Next.js, Supabase, and Tailwind CSS. Perfect for managing multi-product businesses with advanced inventory management, order processing, and marketing tools.

## 🚀 Features

### Core Business Management
- **Dashboard Analytics** - Real-time sales metrics, order tracking, and business insights
- **Product Management** - CRUD operations with stock control and category management  
- **Order Processing** - Multi-item orders with status tracking and customer management
- **Payment Tracking** - Multiple payment methods with paid/unpaid/partial status management
- **Inventory Control** - Automatic stock updates with low-stock alerts and adjustment logs
- **Staff Management** - Role-based access control (Owner/Staff permissions)

### Advanced Features
- **Real-time Updates** - Live data synchronization using Supabase Realtime
- **Marketing Tools** - Social media post scheduling and WhatsApp integration
- **Mobile-First Design** - Fully responsive with offline-capable PWA features
- **Analytics & Reporting** - Sales charts, product performance, and business metrics
- **Multi-Category Support** - Main products (Shilajit, Dry Fruits, Honey) + Reseller items

## 💻 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- Headless UI
- React Hook Form
- Recharts

**Backend & Database:**
- Supabase (PostgreSQL + Real-time + Auth)
- Row Level Security (RLS)
- Database Functions & Triggers

**Deployment & Services:**
- Vercel (Hosting)
- SendGrid (Email notifications)
- Facebook Graph API
- LinkedIn API
- WhatsApp Business API

## 🏗️ Architecture

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/                # API Routes
│   │   ├── products/       # Product CRUD endpoints
│   │   ├── orders/         # Order management endpoints  
│   │   └── payments/       # Payment processing endpoints
│   ├── products/           # Products pages
│   ├── orders/             # Orders pages
│   ├── payments/           # Payments pages
│   └── layout.tsx          # Root layout
│
├── components/
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard widgets
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
│
├── contexts/               # React Context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and configurations
└── supabase/               # Database migrations
```

## 📏 Database Schema

### Core Tables
- `users` - User profiles with role-based permissions
- `products` - Product catalog with categories and stock
- `orders` - Customer orders with automated numbering
- `order_items` - Order line items with product relations
- `payments` - Payment tracking with multiple methods
- `inventory_logs` - Stock movement history
- `marketing_posts` - Social media campaign management

### Key Features
- **Automated Triggers** - Stock updates, order numbering, audit logs
- **Database Functions** - Analytics calculations, reporting views
- **Row Level Security** - Fine-grained access control
- **Real-time Subscriptions** - Live data updates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd multi-product-business-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email

# Social Media API Keys
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

4. **Database Setup**

Run the SQL migrations in your Supabase dashboard:
```bash
# Execute in order:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_rls_policies.sql  
# 3. supabase/migrations/003_sample_data.sql
```

5. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 💱 Mobile-First Design

The application is built with a mobile-first approach:

- **Responsive Grid Systems** - Adapts from mobile to desktop seamlessly
- **Touch-Friendly Interface** - Optimized for mobile interactions
- **Progressive Web App** - Installable with offline capabilities
- **Mobile Navigation** - Slide-out menu with touch gestures
- **Optimized Performance** - Fast loading on mobile networks

## 🔐 Authentication & Security

- **Supabase Auth** - Email/password authentication
- **Role-Based Access** - Owner and Staff permissions
- **Row Level Security** - Database-level access control
- **JWT Tokens** - Secure session management
- **Protected Routes** - Client and server-side protection

## 📊 Analytics & Reporting

- **Real-time Dashboard** - Live business metrics
- **Sales Charts** - Historical performance tracking
- **Product Analytics** - Best-selling items and trends
- **Inventory Reports** - Stock levels and movement
- **Payment Tracking** - Outstanding and completed payments

## 📱 Marketing Integration

- **WhatsApp Sharing** - Pre-filled product messages
- **Social Media Scheduling** - Facebook and LinkedIn posts
- **Custom Campaigns** - Targeted marketing content
- **Share Functionality** - Easy product catalog sharing

## 🌐 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Import project to Vercel
   - Configure environment variables
   - Enable automatic deployments

2. **Environment Variables**
   Add all variables from `.env.local` to Vercel dashboard

3. **Custom Domain** (Optional)
   Configure custom domain in Vercel settings

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] SendGrid sender verified
- [ ] Social media APIs configured
- [ ] Custom domain setup (if applicable)

## 🛠️ Customization

### Adding New Product Categories
```sql
ALTER TYPE product_category ADD VALUE 'new_category';
```

### Custom Payment Methods
```sql
ALTER TYPE payment_method ADD VALUE 'crypto';
```

### Additional User Roles
```sql
ALTER TYPE user_role ADD VALUE 'manager';
```

## 📝 API Documentation

### Products API
```
GET    /api/products              # List products
POST   /api/products              # Create product
GET    /api/products/[id]         # Get product
PUT    /api/products/[id]         # Update product
DELETE /api/products/[id]         # Delete product
```

### Orders API
```
GET    /api/orders                # List orders
POST   /api/orders                # Create order
GET    /api/orders/[id]           # Get order
PUT    /api/orders/[id]           # Update order
```

### Payments API
```
GET    /api/payments              # List payments
POST   /api/payments              # Create payment
GET    /api/payments/[id]         # Get payment
PUT    /api/payments/[id]         # Update payment
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure migrations are applied

2. **Authentication Issues**
   - Check Supabase auth settings
   - Verify redirect URLs
   - Clear browser cache

3. **Real-time Not Working**
   - Enable real-time on Supabase tables
   - Check subscription configurations
   - Verify network connectivity

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Built by MiniMax Agent

This comprehensive business management application was designed and developed by MiniMax Agent, showcasing advanced full-stack development capabilities with modern technologies and best practices.

---

**Ready to transform your multi-product business? Deploy this application today and experience the power of modern business management! 🚀**