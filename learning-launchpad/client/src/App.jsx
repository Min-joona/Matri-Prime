import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Flashcards from './pages/Flashcards';
import Scholarships from './pages/Scholarships';
import Opportunities from './pages/Opportunities';
import Notes from './pages/Notes';
import Videos from './pages/Videos';
import Quizzes from './pages/Quizzes';
import Exams from './pages/Exams';
import HelpCenter from './pages/HelpCenter';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"/></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <BrowserRouter>
    <Navbar />
    <main style={{ minHeight: 'calc(100vh - 70px)' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/notes" element={<Notes />} />
        <Route path="/courses/videos" element={<Videos />} />
        <Route path="/courses/quizzes" element={<Quizzes />} />
        <Route path="/courses/flashcards" element={<Flashcards />} />
        <Route path="/courses/exams" element={<Exams />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
  </BrowserRouter>
);

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
