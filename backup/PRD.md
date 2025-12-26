# Product Requirements Document (PRD)
## Flight Experience Booking System

**Version:** 1.0  
**Date:** 2024  
**Status:** Planning

---

## 1. Project Overview

### 1.1 Purpose
Build a modern, user-friendly booking system for flight experiences (One Day Pilot, Flight Simulator, Skydive, Helicopter rides, etc.) with user authentication, booking management, and admin dashboard.

### 1.2 Goals
- Enable customers to browse and book flight experiences online
- Provide admin tools to manage bookings, services, and pricing
- Create a professional, modern website that improves upon the existing onedaypilot.com
- Ensure easy deployment and maintenance

### 1.3 Target Users
- **Primary:** Customers wanting to book flight experiences
- **Secondary:** Administrators managing bookings and services

---

## 2. Technology Stack

### 2.1 Frontend
- **HTML5** - Structure
- **CSS3** - Styling (Tailwind CSS)
- **JavaScript (Vanilla)** - Interactivity
- **Supabase JS SDK** - Backend integration

### 2.2 Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Real-time subscriptions
  - Storage (for images)

### 2.3 Deployment
- **Frontend:** Netlify or Vercel
- **Backend:** Supabase Cloud

---

## 3. User Stories

### 3.1 Customer (User) Stories
1. **As a customer**, I want to browse available flight experiences so I can see what's offered
2. **As a customer**, I want to create an account so I can make bookings
3. **As a customer**, I want to log in to my account so I can access my bookings
4. **As a customer**, I want to book a flight experience with date, time, and number of participants
5. **As a customer**, I want to view my booking history so I can track my past and upcoming bookings
6. **As a customer**, I want to see the status of my bookings (pending/approved/rejected)
7. **As a customer**, I want to update my profile information
8. **As a customer**, I want to contact via WhatsApp for support

### 3.2 Admin Stories
1. **As an admin**, I want to log in to an admin dashboard
2. **As an admin**, I want to view all bookings with filters (status, date, service)
3. **As an admin**, I want to approve or reject bookings
4. **As an admin**, I want to view booking details (customer info, service, date, time)
5. **As an admin**, I want to add new services/experiences
6. **As an admin**, I want to edit existing services (name, description, price, duration)
7. **As an admin**, I want to delete services
8. **As an admin**, I want to see dashboard statistics (total bookings, pending, revenue)

---

## 4. Features & Requirements

### 4.1 Public Pages

#### 4.1.1 Homepage (`index.html`)
**Requirements:**
- Hero section with compelling headline and CTA
- Featured services section (show 3-6 popular services)
- About section (brief company info)
- WhatsApp contact button (prominent, sticky)
- Navigation menu (Home, Services, About, Login)
- Responsive design (mobile-first)
- Fast loading (< 3 seconds)

**Acceptance Criteria:**
- ✅ All sections visible and properly styled
- ✅ WhatsApp button opens WhatsApp with pre-filled message
- ✅ Navigation works on all devices
- ✅ Images optimized and lazy-loaded

#### 4.1.2 Services Page (`services.html`)
**Requirements:**
- Grid/list of all available services
- Each service card shows:
  - Service name
  - Description (truncated)
  - Price
  - Duration
  - Image
  - "Book Now" button (redirects to login if not authenticated)
- Filter/search functionality (optional for v1)
- Responsive grid (1 column mobile, 2-3 columns desktop)

**Acceptance Criteria:**
- ✅ All active services displayed
- ✅ Clicking "Book Now" redirects appropriately
- ✅ Prices and details accurate
- ✅ Images load properly

#### 4.1.3 About/Contact Page (`about.html`)
**Requirements:**
- Company information
- Contact details:
  - WhatsApp number (clickable)
  - Email
  - Address
  - Business hours
- Map integration (Google Maps or similar)
- Social media links (if applicable)

**Acceptance Criteria:**
- ✅ All contact information accurate
- ✅ WhatsApp link works
- ✅ Map displays correctly

### 4.2 Authentication Pages

#### 4.2.1 Sign Up Page (`signup.html`)
**Requirements:**
- Form fields:
  - Full Name (required)
  - Email (required, validated)
  - Password (required, min 8 characters)
  - Confirm Password (required, must match)
  - Phone Number (optional)
- Form validation (client-side)
- Error handling (email already exists, weak password)
- Success message and redirect to login
- Link to login page

**Acceptance Criteria:**
- ✅ Form validates all fields
- ✅ Password requirements enforced
- ✅ Email uniqueness checked
- ✅ Successful signup creates user account
- ✅ Redirects to login after success

#### 4.2.2 Login Page (`login.html`)
**Requirements:**
- Form fields:
  - Email (required)
  - Password (required)
- "Remember me" checkbox (optional)
- "Forgot Password" link (optional for v1)
- Error handling (invalid credentials)
- Link to signup page
- Redirect to dashboard after successful login

**Acceptance Criteria:**
- ✅ Validates email format
- ✅ Shows error for invalid credentials
- ✅ Successful login redirects to dashboard
- ✅ Session persists (localStorage/sessionStorage)

### 4.3 User Dashboard Pages

#### 4.3.1 User Dashboard (`dashboard.html`)
**Requirements:**
- Welcome message with user name
- Profile section:
  - Display user info (name, email, phone)
  - Edit profile button
- Bookings section:
  - Upcoming bookings (status: pending/approved)
  - Past bookings
  - Booking cards show:
    - Service name
    - Date & time
    - Status badge (Pending/Approved/Rejected)
    - Number of participants
    - Total price
- "Book New Experience" button
- Logout button

**Acceptance Criteria:**
- ✅ Shows user's bookings correctly
- ✅ Status badges styled appropriately
- ✅ Clicking booking shows details (modal or page)
- ✅ Logout clears session

#### 4.3.2 Booking Page (`booking.html`)
**Requirements:**
- Service selection (if coming from services page, pre-select)
- Date picker (calendar, no past dates)
- Time selection (dropdown or time slots)
- Number of participants (input, min 1, max based on service)
- Price calculation (auto-update based on participants)
- Notes/Requirements field (optional)
- Submit booking button
- Form validation
- Success message and redirect to dashboard

**Acceptance Criteria:**
- ✅ Date picker prevents past dates
- ✅ Price calculates correctly
- ✅ All required fields validated
- ✅ Booking creates record with status "pending"
- ✅ Success message shown

#### 4.3.3 Profile Page (`profile.html`) - Optional
**Requirements:**
- Edit form:
  - Name
  - Email (read-only or editable)
  - Phone
  - Change password (optional)
- Save button
- Cancel button

**Acceptance Criteria:**
- ✅ Updates user profile
- ✅ Shows success/error messages

### 4.4 Admin Dashboard Pages

#### 4.4.1 Admin Dashboard (`admin/index.html`)
**Requirements:**
- Overview statistics:
  - Total bookings (all time)
  - Pending bookings count
  - Approved bookings count
  - Total revenue (optional)
- Recent bookings list (last 10)
- Quick actions:
  - View all bookings
  - Manage services
- Logout button

**Acceptance Criteria:**
- ✅ Statistics accurate and real-time
- ✅ Recent bookings displayed
- ✅ Navigation to other admin pages works

#### 4.4.2 Bookings Management (`admin/bookings.html`)
**Requirements:**
- Table/list of all bookings with columns:
  - Booking ID
  - Customer Name
  - Service
  - Date & Time
  - Participants
  - Total Price
  - Status
  - Actions (Approve/Reject/View)
- Filter by status (All/Pending/Approved/Rejected)
- Search functionality (by customer name, service)
- Pagination (if many bookings)
- Status badges (color-coded)
- Approve/Reject buttons (only for pending)
- View details modal/page

**Acceptance Criteria:**
- ✅ All bookings displayed
- ✅ Filters work correctly
- ✅ Approve/Reject updates status
- ✅ Status changes reflected immediately

#### 4.4.3 Services Management (`admin/services.html`)
**Requirements:**
- List of all services
- Add new service button
- For each service:
  - Name
  - Description
  - Price
  - Duration
  - Image
  - Active/Inactive toggle
  - Edit button
  - Delete button (with confirmation)
- Add/Edit service form (modal or separate page):
  - Service name (required)
  - Description (textarea, required)
  - Price (number, required, min 0)
  - Duration (text, e.g., "2 hours", required)
  - Image upload (optional)
  - Active checkbox

**Acceptance Criteria:**
- ✅ CRUD operations work (Create, Read, Update, Delete)
- ✅ Form validation
- ✅ Image upload works (if implemented)
- ✅ Active/inactive toggle works
- ✅ Deleted services don't show in public services page

---

## 5. Database Schema

### 5.1 Tables

#### 5.1.1 `users` (handled by Supabase Auth)
- `id` (UUID, primary key)
- `email` (string, unique)
- `password_hash` (handled by Supabase)
- `created_at` (timestamp)

#### 5.1.2 `profiles` (extends Supabase Auth)
- `id` (UUID, foreign key to users.id)
- `full_name` (text)
- `phone` (text, nullable)
- `role` (text, default: 'user', values: 'user' | 'admin')
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### 5.1.3 `services`
- `id` (UUID, primary key)
- `name` (text, required)
- `description` (text, required)
- `price` (decimal, required)
- `duration` (text, required)
- `image_url` (text, nullable)
- `active` (boolean, default: true)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### 5.1.4 `bookings`
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to users.id)
- `service_id` (UUID, foreign key to services.id)
- `booking_date` (date, required)
- `booking_time` (time, required)
- `participants` (integer, required, min: 1)
- `total_price` (decimal, required)
- `status` (text, default: 'pending', values: 'pending' | 'approved' | 'rejected')
- `notes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### 5.2 Relationships
- `profiles.id` → `users.id` (one-to-one)
- `bookings.user_id` → `users.id` (many-to-one)
- `bookings.service_id` → `services.id` (many-to-one)

### 5.3 Row Level Security (RLS) Policies
- **Profiles:** Users can read/update their own profile
- **Services:** Public read (active only), Admin full access
- **Bookings:** Users can read their own bookings, Admins can read all

---

## 6. Security Requirements

### 6.1 Authentication
- Passwords hashed (handled by Supabase)
- JWT tokens for session management
- Secure password requirements (min 8 characters)

### 6.2 Authorization
- Role-based access control (user vs admin)
- Admin routes protected (redirect if not admin)
- User routes protected (redirect to login if not authenticated)

### 6.3 Data Protection
- SQL injection prevention (Supabase handles this)
- XSS prevention (sanitize user inputs)
- CSRF protection (Supabase handles this)

---

## 7. Design Requirements

### 7.1 Visual Design
- Modern, clean, professional look
- Consistent color scheme
- High-quality images for services
- Responsive design (mobile, tablet, desktop)
- Dark mode support (optional for v1)

### 7.2 UI/UX
- Intuitive navigation
- Clear call-to-action buttons
- Loading states for async operations
- Error messages (user-friendly)
- Success confirmations
- Form validation feedback

### 7.3 Accessibility
- Semantic HTML
- Alt text for images
- Keyboard navigation support
- ARIA labels where needed

---

## 8. Performance Requirements

### 8.1 Load Times
- Homepage: < 3 seconds
- Other pages: < 2 seconds
- API calls: < 1 second

### 8.2 Optimization
- Image optimization (compression, lazy loading)
- Minified CSS/JS for production
- CDN for static assets

---

## 9. Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 10. Deployment Requirements

### 10.1 Environment Setup
- Supabase project created
- Environment variables configured
- Database tables created
- RLS policies set up
- Initial admin user created

### 10.2 Hosting
- Frontend deployed to Netlify/Vercel
- Custom domain configured (optional)
- SSL certificate (automatic with Netlify/Vercel)

---

## 11. Success Metrics

### 11.1 User Metrics
- Number of user registrations
- Number of bookings made
- Booking completion rate

### 11.2 Admin Metrics
- Time to approve/reject bookings
- Number of services managed
- System uptime

---

## 12. Future Enhancements (Out of Scope for v1)

- Email notifications (booking confirmation, status updates)
- Payment integration (Stripe/PayPal)
- Calendar view for bookings
- Export bookings to CSV/PDF
- Multi-language support
- Reviews/ratings system
- Gift vouchers
- WhatsApp integration for booking notifications

---

## 13. Assumptions & Constraints

### 13.1 Assumptions
- Users have email addresses
- Users have internet access
- Admin will manually approve/reject bookings
- No payment processing in v1 (handled offline)

### 13.2 Constraints
- Supabase free tier limits (may need upgrade for high traffic)
- No real-time notifications (email/SMS) in v1
- Single admin account initially

---

## 14. Dependencies

- Supabase account (free tier sufficient for MVP)
- Netlify/Vercel account (free tier)
- Domain name (optional)
- High-quality service images

---

## 15. Risks & Mitigation

### 15.1 Risks
- Supabase downtime → Mitigation: Monitor status, have backup plan
- High traffic → Mitigation: Upgrade Supabase plan if needed
- Security vulnerabilities → Mitigation: Follow Supabase best practices, regular updates

---

## 16. Approval

**Status:** Ready for Development  
**Next Step:** Coding Plan & Implementation

