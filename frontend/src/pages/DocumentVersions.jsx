import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const DocumentVersions = () => {

    const { id } = useParams();

    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVersions = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                `/documents/${id}/versions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVersions(response.data.versions || []);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVersions();
    }, [id]);

    const restoreVersion = async (versionId) => {

        const confirmRestore = window.confirm(
            "Are you sure you want to restore this version?"
        );

        if (!confirmRestore) return;

        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/documents/${id}/versions/${versionId}/restore`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Version restored successfully");

            fetchVersions();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Restore failed"
            );
        }
    };

    if (loading) {
        return <p>Loading versions...</p>;
    }

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Document Versions
            </h1>

            {versions.length === 0 ? (
                <p className="text-gray-500">
                    No versions found.
                </p>
            ) : (

                <div className="space-y-4">

                    {versions.map((version) => (

                        <div
                            key={version._id}
                            className="bg-white p-5 rounded-xl shadow"
                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <h2 className="text-xl font-semibold">
                                        Version {version.version}
                                    </h2>

                                    <p className="text-gray-600">
                                        {version.fileName}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Uploaded:{" "}
                                        {new Date(
                                            version.createdAt
                                        ).toLocaleString()}
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        restoreVersion(version._id)
                                    }
                                    className="bg-green-600 text-white px-4 py-2 rounded"
                                >
                                    Restore
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default DocumentVersions;