import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { TimeAgo } from "../utils/timeago";

export default function Home() {
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/video")
            .then(res => setVideos(res.data.data.docs))
            .catch(console.error)
    }, [])

    return (
        <div className="grid grid-cols-3 gap-3">
            {videos.map(v => (
                <div
                    key={v._id}
                    className="bg-zinc-600 p-0.5 rounded cursor-pointer"
                    onClick={() => navigate(`/watch/${v._id}`)}
                >
                    <img src={v.thumbnail} />
                    <p className="bg-zinc-400">{v.title}</p>
                    <p className="text-sm text-zinc-900">
                        {v.views} views • {TimeAgo(v.createdAt)}
                    </p>
                </div>
            ))}
        </div>
    )
}