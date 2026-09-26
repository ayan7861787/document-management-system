import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const DocumentActivity = () => {

    const { id } = useParams();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                `/documents/${id}/activity`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setActivities(response.data.logs || []);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [id]);

    if (loading) {
        return <p>Loading activity...</p>;
    }

    return (
        <div>

            <h1 className="text-3xl font-bold mb-6">
                Activity History
            </h1>

            {activities.length === 0 ? (
                <p className="text-gray-500">
                    No activity found.
                </p>
            ) : (

                <div className="space-y-4">

                    {activities.map((activity) => (

                        <div
                            key={activity._id}
                            className="bg-white p-5 rounded-xl shadow"
                        >

                            <div className="flex justify-between">

                                <div>

                                    <h2 className="font-semibold">
                                        {activity.action}
                                    </h2>

                                    <p className="text-gray-600">
                                        {activity.details}
                                    </p>

                                </div>

                                <p className="text-sm text-gray-500">
                                    {new Date(
                                        activity.createdAt
                                    ).toLocaleString()}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default DocumentActivity;