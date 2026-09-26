import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const DocumentDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDocument = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(`/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocument(response.data.document);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  if (loading) {
    return <p>Loading document...</p>;
  }

  if (!document) {
    return <p>Document not found.</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Document Details</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">{document.title}</h2>

        <div className="space-y-3">
          <p>
            <strong>Description:</strong>{" "}
            {document.description || "No description"}
          </p>

          <p>
            <strong>File Name:</strong> {document.fileName}
          </p>

          <p>
            <strong>File Type:</strong> {document.fileType}
          </p>

          <p>
            <strong>File Size:</strong> {document.fileSize} bytes
          </p>

          <p>
            <strong>Category:</strong> {document.category}
          </p>

          <p>
            <strong>Public:</strong> {document.isPublic ? "Yes" : "No"}
          </p>

          <p>
            <strong>Created:</strong>{" "}
            {new Date(document.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => navigate(`/documents/${document._id}/edit`)}
          className="bg-black text-white px-4 py-2 rounded mt-5"
        >
          Edit Document
        </button>

        <button
          onClick={() => navigate(`/documents/${document._id}/share`)}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-5 ml-2"
        >
          Share Document
        </button>

        <button
          onClick={() => navigate(`/documents/${document._id}/versions`)}
          className="bg-purple-600 text-white px-4 py-2 rounded mt-5 ml-2"
        >
          Version History
        </button>

        <button
          onClick={() => navigate(`/documents/${document._id}/version`)}
          className="bg-orange-600 text-white px-4 py-2 rounded mt-5 ml-2"
        >
          Upload New Version
        </button>

        <button
          onClick={() => navigate(`/documents/${document._id}/activity`)}
          className="bg-gray-600 text-white px-4 py-2 rounded mt-5 ml-2"
        >
          Activity History
        </button>
      </div>
    </div>
  );
};

export default DocumentDetails;
