import { useEffect, useState } from "react";
import api from "../services/api";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments(response.data.documents);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const deleteDocument = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Document deleted successfully");

      fetchDocuments();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const downloadDocument = async (id, fileName) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/documents/download/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);

      alert("Download failed");
    }
  };

  if (loading) {
    return <p>Loading documents...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Documents</h1>

      {documents.length === 0 ? (
        <p className="text-gray-500">No documents found.</p>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <div key={document._id} className="bg-white p-5 rounded-xl shadow">
              <h2 className="text-xl font-semibold">{document.title}</h2>

              <p className="text-gray-600 mt-1">{document.description}</p>

              <p className="text-sm text-gray-500 mt-2">
                Category: {document.category}
              </p>

              <p className="text-sm text-gray-500">File: {document.fileName}</p>

              <div className="flex gap-3 mt-4">

                 <button
                  onClick={() =>
                    (window.location.href = `/documents/${document._id}`)
                  }
                  className="bg-gray-700 text-white px-4 py-2 rounded"
                >
                  View
                </button>
                
                <button
                  onClick={() =>
                    downloadDocument(document._id, document.fileName)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Download
                </button>

                <button
                  onClick={() => deleteDocument(document._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
