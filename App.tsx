import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import DoctorProfile from './pages/DoctorProfile';
import BookingSuccess from './pages/BookingSuccess';
import ProfileSettings from './pages/ProfileSettings';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useStore();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route element={<Layout />}>
        <Route 
          path="/patient" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient/book" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookAppointment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient/book/:id" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DoctorProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/patient/booking-success" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookingSuccess />
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/patient/profile" 
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <ProfileSettings />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/doctor" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/schedule" 
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
               <div className="p-8 text-center text-slate-500">Full Calendar View Placeholder</div>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/doctors" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
               <div className="p-8 text-center text-slate-500">Doctor List Management Placeholder</div>
            </ProtectedRoute>
          } 
        />
         <Route 
          path="/admin/bookings" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
               <div className="p-8 text-center text-slate-500">All System Bookings Placeholder</div>
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <AppRoutes />
      </Router>
    </StoreProvider>
  );
};

export default App;