
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Documents from "./pages/Documents";
import UploadDocument from "./pages/UploadDocument";
import Trash from "./pages/Trash";
import DocumentDetails from "./pages/DocumentDetails";
import EditDocument from "./pages/EditDocument";
import ShareDocument from "./pages/ShareDocument";
import DocumentVersions from "./pages/DocumentVersions";
import UploadVersion from "./pages/UploadVersion";
import DocumentActivity from "./pages/DocumentActivity";

import AdminUsers from "./pages/AdminUsers";
import AdminDocuments from "./pages/AdminDocuments";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <Routes>

            {/* Public Routes */}

            <Route
                path="/"
                element={<Navigate to="/login" />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* Protected Routes */}

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >

                {/* User Dashboard */}

                <Route
                    path="dashboard"
                    element={<Dashboard />}
                />

                {/* Documents */}

                <Route
                    path="documents"
                    element={<Documents />}
                />

                <Route
                    path="upload"
                    element={<UploadDocument />}
                />

                <Route
                    path="trash"
                    element={<Trash />}
                />

                <Route
                    path="documents/:id"
                    element={<DocumentDetails />}
                />

                <Route
                    path="documents/:id/edit"
                    element={<EditDocument />}
                />

                <Route
                    path="documents/:id/share"
                    element={<ShareDocument />}
                />

                {/* Versions */}

                <Route
                    path="documents/:id/versions"
                    element={<DocumentVersions />}
                />

                <Route
                    path="documents/:id/version"
                    element={<UploadVersion />}
                />

                {/* Activity */}

                <Route
                    path="documents/:id/activity"
                    element={<DocumentActivity />}
                />

                {/* Admin */}

                <Route
                    path="admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="admin/users"
                    element={<AdminUsers />}
                />

                <Route
                    path="admin/documents"
                    element={<AdminDocuments />}
                />

            </Route>

        </Routes>
    );
}

export default App;

