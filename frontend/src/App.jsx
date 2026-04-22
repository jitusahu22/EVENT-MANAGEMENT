import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';

// Protected Pages
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
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
            <Route path="/login" element={<Login />} />

            {/* Protected Routes inside DashboardLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                
                {/* Admin Only Routes */}
                <Route element={<ProtectedRoute allowedRole={true} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/memberships/add" element={<AddMembership />} />
                  <Route path="/memberships/update" element={<UpdateMembership />} />
                </Route>

                {/* Normal User Routes */}
                <Route path="/dashboard" element={<UserDashboard />} />
                
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
