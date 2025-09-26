# Multi-Product Business Application

A comprehensive, mobile-first business management solution built with Next.js, Supabase, and modern web technologies.

## 🚀 Features Overview

### Core Business Management
- **Real-time Dashboard** with sales analytics and business metrics
- **Product Management** with inventory control and multi-category support
- **Order Processing** with multi-item orders and status tracking
- **Payment Tracking** with multiple payment methods and status management
- **Inventory Management** with automatic stock updates and low-stock alerts
- **Staff Management** with role-based access control

### Advanced Features
- **Mobile-First Design** - Fully responsive and touch-optimized
- **Real-time Updates** - Live data synchronization
- **Marketing Tools** - Social media integration and WhatsApp sharing
- **Analytics & Reporting** - Comprehensive business insights
- **PWA Support** - Installable web app with offline capabilities

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **State Management**: React Query, React Context
- **UI Components**: Headless UI, Heroicons
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Deployment**: Vercel

## 🏃‍♂️ Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd multi-product-business-app
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase and other API credentials
   ```

3. **Set up the database:**
   - Create a Supabase project
   - Run the SQL migrations in order from `supabase/migrations/`
   - Enable real-time on relevant tables

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📱 Mobile-First Experience

The application is designed with mobile users as the primary focus:

- **Responsive Grid Systems** - Seamless adaptation from mobile to desktop
- **Touch-Friendly Interface** - Optimized for mobile interactions
- **Mobile Navigation** - Slide-out menu with gesture support
- **Offline Capabilities** - PWA features for offline functionality
- **Fast Loading** - Optimized for mobile networks

## 🔐 Security & Authentication

- **Supabase Authentication** - Secure email/password authentication
- **Role-Based Access Control** - Owner and Staff permission levels
- **Row Level Security** - Database-level access restrictions
- **Protected Routes** - Client and server-side route protection
- **JWT Session Management** - Secure token handling

## 🎯 Business Features

### Product Categories
- **Main Products**: Shilajit, Dry Fruits, Honey, Shilajit Drops
- **Reseller Items**: Additional products for resale
- **Stock Management**: Automated inventory tracking
- **Multi-variant Support**: Different sizes, types, and pricing

### Order Management
- **Multi-item Orders**: Complex order composition
- **Status Tracking**: Pending → Processing → Delivered → Returned
- **Customer Management**: Contact information and order history
- **Automated Order Numbers**: Sequential order numbering system

### Payment Processing
- **Multiple Methods**: Cash, Bank Transfer, EasyPaisa, JazzCash
- **Status Tracking**: Paid, Unpaid, Partial payments
- **Transaction Records**: Reference numbers and payment dates
- **Outstanding Payments**: Automated tracking and alerts

## 📊 Analytics & Reporting

- **Real-time Dashboard**: Live business metrics and KPIs
- **Sales Charts**: Historical performance with trend analysis
- **Product Performance**: Best-selling items and revenue tracking
- **Inventory Reports**: Stock levels and movement history
- **Payment Analytics**: Outstanding amounts and collection rates

## 📱 Marketing Integration

### Social Media Tools
- **WhatsApp Integration**: Pre-filled product messages
- **Facebook Graph API**: Scheduled post publishing
- **LinkedIn API**: Professional network campaigns
- **Custom Content**: Branded promotional materials

### Sharing Features
- **Product Catalog Sharing**: Easy link sharing
- **WhatsApp Business**: Direct customer messaging
- **Social Media Scheduling**: Plan and automate posts
- **Campaign Tracking**: Monitor engagement and performance

## 🚀 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy with automatic builds and updates

### Environment Variables Required
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SendGrid (Email)
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_verified_email

# Social Media APIs (Optional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
```

## 🎨 Customization

The application is built with customization in mind:

### Adding New Product Categories
```sql
ALTER TYPE product_category ADD VALUE 'new_category';
```

### Custom Payment Methods
```sql
ALTER TYPE payment_method ADD VALUE 'crypto';
```

### Branding Customization
- Update logo and colors in `tailwind.config.js`
- Modify company information in environment variables
- Customize email templates and notifications

## 🔧 Development

### Code Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configurations
└── supabase/          # Database migrations
```

### Key Files
- `src/lib/supabase.ts` - Database connection and utilities
- `src/lib/types.ts` - TypeScript definitions
- `src/lib/utils.ts` - Helper functions
- `src/contexts/AuthContext.tsx` - Authentication state management
- `src/hooks/useQueries.ts` - Data fetching hooks

## 📚 API Documentation

### REST Endpoints
- `GET/POST /api/products` - Product CRUD operations
- `GET/POST /api/orders` - Order management
- `GET/POST /api/payments` - Payment processing
- `GET /api/analytics` - Business metrics (future)
- `POST /api/marketing` - Campaign management (future)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, documentation, or questions:
- Check the `DEPLOYMENT.md` for detailed setup instructions
- Review the code documentation and comments
- Create an issue for bug reports or feature requests

## 🎉 Built by MiniMax Agent

This comprehensive business management application showcases modern full-stack development with:
- Advanced database design with triggers and RLS
- Real-time data synchronization
- Mobile-first responsive design
- Complete authentication and authorization
- Production-ready deployment configuration
- Comprehensive business logic implementation

---

**Ready to transform your multi-product business? This application provides everything you need to manage products, process orders, track payments, and grow your business online! 🚀**