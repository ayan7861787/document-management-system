import { useState } from "react";
import api from "../services/api";

const UploadDocument = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("other");
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

            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("document", file);

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/documents/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(response.data);

            alert("Document uploaded successfully");

            setTitle("");
            setDescription("");
            setCategory("other");
            setFile(null);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Upload failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl">

            <h1 className="text-3xl font-bold mb-6">
                Upload Document
            </h1>

            <form
                onSubmit={handleUpload}
                className="bg-white p-6 rounded-xl shadow space-y-4"
            >

                <input
                    type="text"
                    placeholder="Document title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-3 rounded"
                    required
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border p-3 rounded"
                    rows="4"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border p-3 rounded"
                >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="academic">Academic</option>
                    <option value="financial">Financial</option>
                    <option value="other">Other</option>
                </select>

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full border p-3 rounded"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white p-3 rounded"
                >
                    {loading ? "Uploading..." : "Upload Document"}
                </button>

            </form>

        </div>
    );
};

export default UploadDocument;