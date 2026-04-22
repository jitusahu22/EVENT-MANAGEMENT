# Technical Event Management System

A full-stack SaaS application built to seamlessly manage event memberships, automate financial transaction tracking, and deliver real-time operational reports.

## 🚀 Tech Stack

**Frontend:**
- **React 18** (Vite)
- **Tailwind CSS** (Styling)
- **React Router v6** (Routing)
- **Axios** (API Requests)
- **Lucide React** (Icons)

**Backend:**
- **Django 5.0+**
- **Django REST Framework (DRF)**
- **SQLite3** (Database)

## 🌟 Key Features

1. **Role-Based Access Control (RBAC):**
   - **Admin:** Full access to manage memberships, view all transactions, access detailed revenue reports, and maintenance module.
   - **User:** Limited access to view transactions and reports.
2. **Membership Management:**
   - Add, extend, or cancel memberships cleanly through the dashboard with radio button duration selection.
3. **Automated Transactions:**
   - Any modifications to a membership (Add/Extend/Cancel) automatically generate an immutable transaction log.
4. **Real-time Reporting:**
   - Dashboards fetch live, calculated data for active/cancelled members and revenue directly from the database without any mock numbers.
5. **Maintenance Module:**
   - Admin-only module to track system maintenance tasks and operational status.
   - Automatically creates maintenance records when memberships are modified.
6. **Secure Authentication:**
   - DRF Token-based authentication securely handles sessions stored in `localStorage` via Axios interceptors.

---

## 🛠️ Setup & Installation

### Prerequisites
- **Python 3.8+** installed on your system
- **Node.js 16+** and **npm** installed on your system

### 1. Clone the repository

```bash
git clone <repository-url>
cd EVENT-MANAGEMENT
```

### 2. Backend Setup (Django)

Open a terminal and navigate to the `backend` directory:

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py makemigrations
python manage.py migrate

# Create the initial Admin user
python manage.py createsuperuser
# Follow prompts to set username, email, and password
# NOTE: This admin user will have full access (Admin role)

# Start the Django server
python manage.py runserver
```
*The backend will run on `http://127.0.0.1:8000`*

### 3. Frontend Setup (React/Vite)

Open a **new** terminal (keep the backend running) and navigate to the `frontend` directory:

```bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## � User Roles & Access

### Admin Access
- **Default Admin:** The user created via `createsuperuser` is automatically an Admin
- **Features:**
  - Dashboard with comprehensive metrics
  - Add new memberships
  - Update/Extend/Cancel existing memberships
  - View all transactions
  - Access detailed reports
  - **Maintenance Module** (Admin-only)

### Regular User Access
- **Registration:** New users can register via the registration page
- **Features:**
  - Dashboard with limited metrics
  - View transactions
  - Access reports
  - **No access to:** Membership management, Maintenance module

---

## �🔐 Authentication Flow

1. **Login:** Users login with username and password
2. **Token Generation:** Backend generates DRF Token upon successful login
3. **Role Assignment:** Backend assigns `admin` role if user is staff, `user` role otherwise
4. **Session Storage:** Token, role, and user info stored in `localStorage`
5. **Route Protection:** `ProtectedRoute` component enforces authentication and role-based access
6. **Auto-Logout:** Token is cleared on logout and redirects to login page

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user (returns token + role)
- `POST /api/auth/logout/` - Logout user

### Membership (Admin Only)
- `GET /api/membership/` - List all memberships
- `POST /api/membership/add/` - Add new membership (auto-creates transaction)
- `GET /api/membership/update/{membershipNumber}/` - Get membership details
- `PUT /api/membership/update/{membershipNumber}/` - Extend or cancel membership
- `DELETE /api/membership/delete/{membershipNumber}/` - Delete membership

### Transactions
- `GET /api/transactions/` - List all transactions (admin) or own (user)
- `GET /api/transactions/{id}/` - Get single transaction by ID
- `GET /api/transactions/member/{membershipNumber}/` - Get transactions by membership

### Reports
- `GET /api/reports/summary/` - Get summary statistics
- `GET /api/reports/detailed/` - Get detailed breakdown by membership type
- `GET /api/reports/revenue/?period=30days|year|all` - Get revenue filtered by period

### Maintenance (Admin Only)
- `GET /api/maintenance/` - List maintenance records
- `POST /api/maintenance/create/` - Create maintenance record
- `PUT /api/maintenance/update/{id}/` - Update maintenance record
- `DELETE /api/maintenance/delete/{id}/` - Delete maintenance record

---

## 🔐 System Architecture Notes

- **Empty Database Policy:** This project strictly avoids hardcoded mock data or "seed" scripts. The application starts fully blank. You must create the first user via `createsuperuser`.
- **Stateless Models:** Apps like `accounts` and `reports` intentionally do not define custom models in their `models.py`. Authentication utilizes Django's default `User`, and reports are calculated dynamically on the fly to ensure 100% data integrity.
- **Frontend Architecture:** Includes a global `AuthContext.jsx` for state management and `ProtectedRoute.jsx` component that rigorously blocks unauthorized role access and enforces the login-first flow.
- **Maintenance Integration:** Maintenance records are automatically created when memberships are added, extended, or cancelled, providing a complete audit trail.

## 🤝 Project Structure

```
├── backend/                  # Django Backend
│   ├── backend/              # Core settings, urls
│   ├── accounts/             # Auth API, DRF tokens, Permissions
│   ├── membership/           # Memberships API & Models
│   ├── transactions/         # Auto-logging Transactions API & Models
│   ├── reports/              # Dynamic Reporting API
│   ├── maintenance/          # Maintenance Module API & Models
│   ├── db.sqlite3            # SQLite Database (auto-generated)
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/       # Layouts, ProtectedRoutes, Navbar, Sidebar
│   │   ├── contexts/         # AuthContext
│   │   ├── pages/            # Dashboards, Login, Forms, Maintenance
│   │   ├── services/         # Axios instance (API.jsx), Service calls
│   │   └── utils/            # Validation utilities
│   ├── package.json          # Node dependencies
│   └── .env                  # Environment Variables
│
└── README.md                 # This file
```

---

## 🐛 Troubleshooting

**Backend won't start:**
- Ensure virtual environment is activated
- Check if port 8000 is already in use
- Verify all dependencies are installed: `pip install -r requirements.txt`

**Frontend won't start:**
- Ensure Node.js is installed: `node --version`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 5173 is already in use

**Login not working:**
- Verify backend is running on `http://127.0.0.1:8000`
- Check browser console for API errors
- Ensure admin user was created with `createsuperuser`

**401 Unauthorized errors:**
- Token may have expired - logout and login again
- Check `localStorage` for token presence
- Verify backend authentication is working

---

## 📝 Important Notes for Instructors

1. **First User Setup:** After running migrations, you MUST create a superuser to access the application. This user will have Admin privileges.
2. **Database Reset:** To reset the database, delete `backend/db.sqlite3` and run `python manage.py migrate` again.
3. **Environment Variables:** The frontend uses `VITE_API_BASE_URL` in `.env` file (defaults to `http://127.0.0.1:8000/api`).
4. **Maintenance Module:** This is an admin-only feature accessible via the sidebar. It tracks system operations and membership changes with full CRUD operations (Create, Read, Update, Delete).
5. **Radio Button Selection:** Membership duration in the Add Membership form uses radio buttons as per requirements, with "6 months" as default.
6. **Revenue Period Filter:** Reports page includes a period filter (30 days, this year, all time) for revenue analysis.
7. **Role-Based Access:** All admin-only endpoints are protected with `IsAdminUserCustom` permission class.
8. **Automatic Transaction Logging:** Creating, extending, or canceling memberships automatically creates transaction records.
9. **Maintenance Integration:** Membership modifications automatically generate maintenance records for audit trail.
