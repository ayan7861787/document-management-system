
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {

    const navigate = useNavigate();

    const { user } = useAuth();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* Sidebar */}

            <aside className="w-64 bg-white shadow-md p-5">

                {/* Logo */}

                <h2 className="text-2xl font-bold mb-8">
                    DMS
                </h2>

                {/* Navigation */}

                <nav className="space-y-2">

                    {/* User Dashboard */}

                    <Link
                        to="/dashboard"
                        className="block px-4 py-3 rounded hover:bg-gray-100"
                    >
                        Dashboard
                    </Link>

                    {/* Documents */}

                    <Link
                        to="/documents"
                        className="block px-4 py-3 rounded hover:bg-gray-100"
                    >
                        My Documents
                    </Link>

                    {/* Upload */}

                    <Link
                        to="/upload"
                        className="block px-4 py-3 rounded hover:bg-gray-100"
                    >
                        Upload Document
                    </Link>

                    {/* Trash */}

                    <Link
                        to="/trash"
                        className="block px-4 py-3 rounded hover:bg-gray-100"
                    >
                        Trash
                    </Link>


                    {/* Admin Section */}

                    {user?.role === "admin" && (
                        <>
                            <hr className="my-4" />

                            <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                                Admin
                            </p>

                            <Link
                                to="/admin/dashboard"
                                className="block px-4 py-3 rounded hover:bg-gray-100"
                            >
                                Admin Dashboard
                            </Link>

                            <Link
                                to="/admin/users"
                                className="block px-4 py-3 rounded hover:bg-gray-100"
                            >
                                Manage Users
                            </Link>

                            <Link
                                to="/admin/documents"
                                className="block px-4 py-3 rounded hover:bg-gray-100"
                            >
                                Manage Documents
                            </Link>
                        </>
                    )}


                    {/* Logout */}

                    <button
                        onClick={logout}
                        className="w-full text-left px-4 py-3 rounded text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>

                </nav>

            </aside>


            {/* Main Content */}

            <main className="flex-1 p-8">

                <Outlet />

            </main>

        </div>
    );
};

export default DashboardLayout;

