import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Likebutton({ video }) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(video.likes?.length || 0);

    useEffect(() => {
        if (!video) return;

        setLiked(video.isLiked);
        setLikes(video.likesCount);
    }, [video]);

    const toggleLike = async () => {
        try {
            setLiked(prev => !prev);
            setLikes(prev => liked ? prev - 1 : prev + 1);
            await api.post(`/like/toggle/v/${video._id}`);
        } catch (err) {
            console.error(err);
            setLiked(prev => !prev);
            setLikes(prev => liked ? prev + 1 : prev - 1);
        }
    };

    return (
        <div className="mt-3">
            <h2 className="text-xl font-semibold">{video.title}</h2>
            <p className="text-sm text-gray-400">
                {video.views || 0} views
            </p>

            <button
                onClick={toggleLike}
                className="mt-2 px-3 py-1 bg-violet-400 rounded"
            >
                {liked ? "❤️ Liked" : "🤍 Like"}({likes})
            </button>
            <p className="mt-2 text-zinc-700">{video.description}</p>
        </div>
    );
}