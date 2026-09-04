import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { EventPassPage } from './pages/EventPassPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { LabPage } from './pages/LabPage';
import { InventoryPage } from './pages/InventoryPage';
import { TeamPage } from './pages/TeamPage';
import { GalleryPage } from './pages/GalleryPage';
import { JoinPage } from './pages/JoinPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentEventsPage } from './pages/student/StudentEventsPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminEventsPage } from './pages/admin/AdminEventsPage';
import { AdminCreateEventPage } from './pages/admin/AdminCreateEventPage';
import { AdminEditEventPage } from './pages/admin/AdminEditEventPage';
import { AdminEventRegistrationsPage } from './pages/admin/AdminEventRegistrationsPage';
import { AdminEventCheckInPage } from './pages/admin/AdminEventCheckInPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminCreateProjectPage } from './pages/admin/AdminCreateProjectPage';
import { AdminEditProjectPage } from './pages/admin/AdminEditProjectPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminLabPage } from './pages/admin/AdminLabPage';
import { LabAccessPage } from './pages/LabAccessPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { StudentProtectedRoute } from './components/auth/StudentProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { PartyModeEasterEgg } from './components/common/PartyModeEasterEgg';

// Scroll to top component on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Main Public Layout with Navbar and Footer
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <PartyModeEasterEgg />
        <Routes>
          {/* ============================================================= */}
          {/* PUBLIC ROUTES (No authentication required)                     */}
          {/* ============================================================= */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><EventsPage /></PublicLayout>} />
          <Route path="/events/:slug" element={<PublicLayout><EventDetailsPage /></PublicLayout>} />
          <Route path="/pass/:passId" element={<PublicLayout><EventPassPage /></PublicLayout>} />
          <Route path="/projects" element={<PublicLayout><ProjectsPage /></PublicLayout>} />
          <Route path="/projects/:slug" element={<PublicLayout><ProjectDetailsPage /></PublicLayout>} />
          <Route path="/lab" element={<PublicLayout><LabPage /></PublicLayout>} />
          <Route path="/lab-access" element={<PublicLayout><LabAccessPage /></PublicLayout>} />
          <Route path="/inventory" element={<PublicLayout><InventoryPage /></PublicLayout>} />
          <Route path="/team" element={<PublicLayout><TeamPage /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
          <Route path="/join" element={<PublicLayout><JoinPage /></PublicLayout>} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* ============================================================= */}
          {/* PROTECTED STUDENT ROUTES (Authenticated Students Only)         */}
          {/* ============================================================= */}
          <Route path="/student" element={<StudentProtectedRoute />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<PublicLayout><StudentDashboardPage /></PublicLayout>} />
            <Route path="events" element={<PublicLayout><StudentEventsPage /></PublicLayout>} />
            <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
          </Route>

          {/* ============================================================= */}
          {/* ADMIN AUTHENTICATION ROUTES                                    */}
          {/* ============================================================= */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ============================================================= */}
          {/* PROTECTED ADMIN ROUTES (Appwrite Admin Session Required)       */}
          {/* ============================================================= */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="events/create" element={<AdminCreateEventPage />} />
            <Route path="events/edit/:eventId" element={<AdminEditEventPage />} />
            <Route path="events/:eventId/edit" element={<AdminEditEventPage />} />
            <Route path="events/:eventId/registrations" element={<AdminEventRegistrationsPage />} />
            <Route path="events/:eventId/check-in" element={<AdminEventCheckInPage />} />
            <Route path="team" element={<AdminTeamPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="projects/new" element={<AdminCreateProjectPage />} />
            <Route path="projects/create" element={<AdminCreateProjectPage />} />
            <Route path="projects/:id/edit" element={<AdminEditProjectPage />} />
            <Route path="projects/edit/:id" element={<AdminEditProjectPage />} />
            <Route path="gallery" element={<AdminGalleryPage />} />
            <Route path="lab" element={<AdminLabPage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
