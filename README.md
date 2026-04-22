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
   - **Admin:** Full access to manage memberships, view all transactions, and access detailed revenue reports.
   - **User:** Limited access to view transactions and reports.
2. **Membership Management:**
   - Add, extend, or cancel memberships cleanly through the dashboard.
3. **Automated Transactions:**
   - Any modifications to a membership (Add/Extend/Cancel) automatically generate an immutable transaction log.
4. **Real-time Reporting:**
   - Dashboards fetch live, calculated data for active/cancelled members and revenue directly from the database without any mock numbers.
5. **Secure Authentication:**
   - DRF Token-based authentication securely handles sessions stored in `localStorage` via Axios interceptors.

---

## 🛠️ Setup & Installation

### 1. Clone the repository

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
# (Follow prompts to set username and password)

# Start the server
python manage.py runserver
```
*The backend will run on `http://127.0.0.1:8000`*

### 3. Frontend Setup (React/Vite)

Open a **new** terminal and navigate to the `frontend` directory:

```bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 🔐 System Architecture Notes

- **Empty Database Policy**: This project strictly avoids hardcoded mock data or "seed" scripts. The application starts fully blank. You must create the first user via `createsuperuser`.
- **Stateless Models**: Apps like `accounts` and `reports` intentionally do not define custom models in their `models.py`. Authentication utilizes Django's default `User`, and reports are calculated dynamically on the fly to ensure 100% data integrity.
- **Frontend Architecture**: Includes a global `AuthContext.jsx` for state management and `ProtectedRoute.jsx` component that rigorously blocks unauthorized role access and enforces the login-first flow.

## 🤝 Project Structure

```
├── backend/                  # Django Backend
│   ├── backend/              # Core settings, urls
│   ├── accounts/             # Auth API, DRF tokens, Permissions
│   ├── membership/           # Memberships API & Models
│   ├── transactions/         # Auto-logging Transactions API & Models
│   └── reports/              # Dynamic Reporting API
│
└── frontend/                 # React Frontend
    ├── src/
    │   ├── components/       # Layouts, ProtectedRoutes, Navbar
    │   ├── contexts/         # AuthContext
    │   ├── pages/            # Dashboards, Login, Forms
    │   └── services/         # Axios instance (API.jsx), Service calls
    └── .env                  # Environment Variables
```
