import { useEffect, useState } from "react";
import api from "../services/api";

const Trash = () => {

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrash = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/documents/trash", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setDocuments(response.data.documents || []);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    const restoreDocument = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/documents/trash/${id}/restore`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Document restored successfully");

            fetchTrash();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Restore failed"
            );
        }
    };

    const permanentlyDelete = async (id) => {

        const confirmDelete = window.confirm(
            "This document will be permanently deleted. Continue?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await api.delete(
                `/documents/trash/${id}/permanent`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Document permanently deleted");

            fetchTrash();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Permanent delete failed"
            );
        }
    };

    if (loading) {
        return <p>Loading trash...</p>;
    }

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Trash
            </h1>

            {documents.length === 0 ? (
                <p className="text-gray-500">
                    Trash is empty.
                </p>
            ) : (

                <div className="grid gap-4">

                    {documents.map((document) => (

                        <div
                            key={document._id}
                            className="bg-white p-5 rounded-xl shadow"
                        >

                            <h2 className="text-xl font-semibold">
                                {document.title}
                            </h2>

                            <p className="text-gray-500">
                                {document.fileName}
                            </p>

                            <p className="text-sm text-red-500 mt-2">
                                Deleted document
                            </p>

                            <div className="flex gap-3 mt-4">

                                <button
                                    onClick={() =>
                                        restoreDocument(document._id)
                                    }
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Restore
                                </button>

                                <button
                                    onClick={() =>
                                        permanentlyDelete(document._id)
                                    }
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                >
                                    Delete Permanently
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default Trash;