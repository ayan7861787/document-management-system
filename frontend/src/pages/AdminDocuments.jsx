import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDocuments = () => {

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/admin/documents", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("ADMIN DOCUMENTS:", response.data);

            setDocuments(response.data.documents || []);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to fetch documents"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    if (loading) {
        return <p>Loading documents...</p>;
    }

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Manage Documents
            </h1>

            {documents.length === 0 ? (
                <p className="text-gray-500">
                    No documents found.
                </p>
            ) : (

                <div className="bg-white rounded-xl shadow overflow-x-auto">

                    <table className="w-full">

                        <thead>
                            <tr className="border-b bg-gray-50">

                                <th className="text-left p-4">
                                    Title
                                </th>

                                <th className="text-left p-4">
                                    File Name
                                </th>

                                <th className="text-left p-4">
                                    Owner
                                </th>

                                <th className="text-left p-4">
                                    Category
                                </th>

                                <th className="text-left p-4">
                                    File Type
                                </th>

                                <th className="text-left p-4">
                                    Created
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {documents.map((document) => (

                                <tr
                                    key={document._id}
                                    className="border-b"
                                >

                                    <td className="p-4">
                                        {document.title}
                                    </td>

                                    <td className="p-4">
                                        {document.fileName}
                                    </td>

                                    <td className="p-4">
                                        {document.owner?.name || "Unknown"}
                                    </td>

                                    <td className="p-4">
                                        {document.category}
                                    </td>

                                    <td className="p-4">
                                        {document.fileType}
                                    </td>

                                    <td className="p-4">
                                        {new Date(
                                            document.createdAt
                                        ).toLocaleDateString()}
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

export default AdminDocuments;