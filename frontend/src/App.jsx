import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Maintenance from './pages/Maintenance';
import AddMembership from './pages/AddMembership';
import UpdateMembership from './pages/UpdateMembership';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes inside MainLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRole={true} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/transactions" element={<Transactions />} />
                  <Route path="/admin/reports" element={<Reports />} />
                  <Route path="/admin/maintenance" element={<Maintenance />} />
                  <Route path="/admin/memberships/add" element={<AddMembership />} />
                  <Route path="/admin/memberships/update" element={<UpdateMembership />} />
                </Route>

                {/* Normal User Routes */}
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/user/transactions" element={<Transactions />} />
                <Route path="/user/reports" element={<Reports />} />

              </Route>
            </Route>

            {/* Catch All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
