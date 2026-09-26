
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {

    const { user } = useAuth();

    return (
        <div>

            <h1 className="text-3xl font-bold mb-2">
                Dashboard
            </h1>

            <p className="text-gray-600">
                Welcome, {user?.name || "User"}!
            </p>

            <div className="mt-6 bg-white p-6 rounded-xl shadow">

                <h2 className="text-xl font-semibold mb-4">
                    Account Information
                </h2>

                <p className="mb-2">
                    <strong>Name:</strong>{" "}
                    {user?.name || "N/A"}
                </p>

                <p className="mb-2">
                    <strong>Email:</strong>{" "}
                    {user?.email || "N/A"}
                </p>

                <p>
                    <strong>Role:</strong>{" "}
                    {user?.role || "N/A"}
                </p>

            </div>

        </div>
    );
};

export default Dashboard;

