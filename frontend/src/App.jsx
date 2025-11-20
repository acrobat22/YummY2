// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthProvider";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/site/includes/Navbar";
import AdminNavbar from "./components/admin/AdminNavbar";

// Lazy loading des pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminItems = lazy(() => import("./pages/admin/AdminItems"));
const Home = lazy(() => import("./pages/site/Home"));
const Items = lazy(() => import("./pages/site/Items"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Layout>
            <Routes>
              {/* --- Partie publique --- */}
              <Route path="/" element={<Home />} />
              <Route path="/items" element={<Items />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* --- Partie administration protégée --- */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/items"
                element={
                  <ProtectedRoute>
                    <AdminItems />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute>
                    <AdminCategories />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
