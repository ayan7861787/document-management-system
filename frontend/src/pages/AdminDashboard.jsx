
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                "/admin/dashboard",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("DASHBOARD:", response.data);

            setStats(response.data.stats);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return <p>Loading dashboard...</p>;
    }

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Admin Dashboard
            </h1>

            {/* Navigation */}
            <div className="flex gap-3 flex-wrap mb-8">

                <Link
                    to="/admin/dashboard"
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Dashboard
                </Link>

                <Link
                    to="/admin/users"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Manage Users
                </Link>

                <Link
                    to="/admin/documents"
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                    Manage Documents
                </Link>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500">
                        Total Users
                    </p>

                    <h2 className="text-3xl font-bold">
                        {stats?.totalUsers || 0}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500">
                        Total Admins
                    </p>

                    <h2 className="text-3xl font-bold">
                        {stats?.totalAdmins || 0}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500">
                        Total Documents
                    </p>

                    <h2 className="text-3xl font-bold">
                        {stats?.totalDocuments || 0}
                    </h2>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;