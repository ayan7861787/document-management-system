import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditDocument = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("other");
    const [loading, setLoading] = useState(true);

    const fetchDocument = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(`/documents/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const document = response.data.document;

            setTitle(document.title);
            setDescription(document.description || "");
            setCategory(document.category);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await api.put(
                `/documents/${id}`,
                {
                    title,
                    description,
                    category
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Document updated successfully");

            navigate(`/documents/${id}`);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Update failed"
            );
        }
    };

    if (loading) {
        return <p>Loading document...</p>;
    }

    return (
        <div className="max-w-2xl">

            <h1 className="text-3xl font-bold mb-6">
                Edit Document
            </h1>

            <form
                onSubmit={handleUpdate}
                className="bg-white p-6 rounded-xl shadow space-y-4"
            >

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document title"
                    className="w-full border p-3 rounded"
                    required
                />

                <textarea
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                    placeholder="Description"
                    rows="4"
                    className="w-full border p-3 rounded"
                />

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                    className="w-full border p-3 rounded"
                >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="academic">Academic</option>
                    <option value="financial">Financial</option>
                    <option value="other">Other</option>
                </select>

                <div className="flex gap-3">

                    <button
                        type="submit"
                        className="bg-black text-white px-5 py-2 rounded"
                    >
                        Update
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

export default EditDocument;