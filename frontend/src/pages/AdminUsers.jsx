import { useEffect, useState } from "react";
import api from "../services/api";

const AdminUsers = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

             console.log("ADMIN USERS DATA:", response.data);

            setUsers(response.data.users || []);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to fetch users"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await api.delete(`/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

           

            alert("User deleted successfully");

            fetchUsers();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete user"
            );
        }
    };

    if (loading) {
        return <p>Loading users...</p>;
    }

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Manage Users
            </h1>

            {users.length === 0 ? (
                <p className="text-gray-500">
                    No users found.
                </p>
            ) : (

                <div className="bg-white rounded-xl shadow overflow-x-auto">

                    <table className="w-full">

                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-4">
                                    Name
                                </th>

                                <th className="text-left p-4">
                                    Email
                                </th>

                                <th className="text-left p-4">
                                    Role
                                </th>

                                <th className="text-left p-4">
                                    Created
                                </th>

                                <th className="text-left p-4">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {users.map((user) => (

                                <tr
                                    key={user._id}
                                    className="border-b"
                                >

                                    <td className="p-4">
                                        {user.name}
                                    </td>

                                    <td className="p-4">
                                        {user.email}
                                    </td>

                                    <td className="p-4">
                                        {user.role}
                                    </td>

                                    <td className="p-4">
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="p-4">

                                        <button
                                            onClick={() =>
                                                deleteUser(user._id)
                                            }
                                            className="bg-red-600 text-white px-4 py-2 rounded"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
};

export default AdminUsers;