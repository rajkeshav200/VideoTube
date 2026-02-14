import { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";


export default function Watchhistory() {
    const { user } = useContext(AuthContext)
    const [videos, setVideos] = useState([])

    useEffect(() => {
        if (!user) {
            alert("Need login first!!")
            return;
        }
        api.get("/user/history")
            .then(res => setVideos(res.data.data))
            .catch(console.error);
    }, [user]);

    if (videos.length === 0) return <h1>No watch History</h1>
    return (
        <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4 text-zinc-800">
                Watch History
            </h2>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
                {videos.map(v => (
                    <Link
                        key={v._id}
                        to={`/watch/${v._id}`}
                        className="group"
                    >
                        <img
                            src={v.thumbnail}
                            className="w-full aspect-video object-cover rounded-md"
                        />

                        <p className="mt-2 text-sm font-medium text-zinc-900 group-hover:text-indigo-600 line-clamp-2">
                            {v.title}
                        </p>
                    </Link>
                ))}
            </div>
        </div>

    )
}