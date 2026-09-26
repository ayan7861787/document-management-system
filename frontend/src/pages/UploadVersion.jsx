import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const UploadVersion = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("document", file);

            const token = localStorage.getItem("token");

            const response = await api.put(
                `/documents/${id}/version`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            alert("New version uploaded successfully");

            navigate(`/documents/${id}/versions`);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Version upload failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">

            <h1 className="text-3xl font-bold mb-6">
                Upload New Version
            </h1>

            <form
                onSubmit={handleUpload}
                className="bg-white p-6 rounded-xl shadow"
            >

                <input
                    type="file"
                    onChange={(e) =>
                        setFile(e.target.files[0])
                    }
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full border p-3 rounded mb-5"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-5 py-2 rounded"
                >
                    {loading
                        ? "Uploading..."
                        : "Upload New Version"
                    }
                </button>

            </form>

        </div>
    );
};

export default UploadVersion;