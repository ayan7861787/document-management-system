import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ShareDocument = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [permissions, setPermissions] = useState(["view"]);
    const [loading, setLoading] = useState(false);

    const handlePermission = (permission) => {

        if (permissions.includes(permission)) {
            setPermissions(
                permissions.filter(
                    (item) => item !== permission
                )
            );
        } else {
            setPermissions([
                ...permissions,
                permission
            ]);
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();

        if (permissions.length === 0) {
            alert("Select at least one permission");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await api.post(
                `/documents/share/${id}`,
                {
                    email,
                    permissions
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            alert("Document shared successfully");

            navigate(`/documents/${id}`);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Document sharing failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">

            <h1 className="text-3xl font-bold mb-6">
                Share Document
            </h1>

            <form
                onSubmit={handleShare}
                className="bg-white p-6 rounded-xl shadow space-y-5"
            >

                <div>
                    <label className="block font-medium mb-2">
                        User Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter user email"
                        className="w-full border p-3 rounded"
                        required
                    />
                </div>

                <div>

                    <p className="font-medium mb-3">
                        Permissions
                    </p>

                    <div className="space-y-2">

                        <label className="flex gap-2">
                            <input
                                type="checkbox"
                                checked={permissions.includes("view")}
                                onChange={() =>
                                    handlePermission("view")
                                }
                            />
                            View
                        </label>

                        <label className="flex gap-2">
                            <input
                                type="checkbox"
                                checked={permissions.includes("download")}
                                onChange={() =>
                                    handlePermission("download")
                                }
                            />
                            Download
                        </label>

                        <label className="flex gap-2">
                            <input
                                type="checkbox"
                                checked={permissions.includes("edit")}
                                onChange={() =>
                                    handlePermission("edit")
                                }
                            />
                            Edit
                        </label>

                    </div>

                </div>

                <div className="flex gap-3">

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-5 py-2 rounded"
                    >
                        {loading ? "Sharing..." : "Share Document"}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(`/documents/${id}`)
                        }
                        className="bg-gray-300 px-5 py-2 rounded"
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
};

export default ShareDocument;