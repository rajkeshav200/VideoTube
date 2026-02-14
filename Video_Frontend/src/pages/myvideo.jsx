import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hook/useAuth";
import { TimeAgo } from "../utils/timeago";

export default function Myvideo() {
    const { user } = useAuth()
    const [videos, setVideos] = useState([])

    useEffect(() => {
        loadData();
    }, [])

    const loadData = async () => {
        try {
            const videores = await api.get('/dashboard/videos')
            setVideos(videores.data.data);
        }
        catch (error) {
            console.log(error);
        }
    }
    if (!user) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <h2 className="text-xl font-bold text-black-500">
                    Login required !!
                </h2>
            </div>
        );
    }

    if (!videos) return <p>Loading...</p>;

    return (
        <div>
            <h1>All videos</h1>
            <div className="grid grid-cols-3 gap-1">
                {videos.map(v => (
                    <div key={v._id}>
                        <img src={v.thumbnail} />
                        <p className="font-semibold">{v.title}</p>
                        <p className="text-sm text-zinc-900">
                            {v.views} views • {TimeAgo(v.createdAt)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}