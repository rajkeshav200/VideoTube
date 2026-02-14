import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function PlayListDetail() {
    const { playlistId } = useParams()
    const [playlist, setPlaylist] = useState(null)

    useEffect(() => {
        api.get(`/playlist/${playlistId}`)
            .then(res => setPlaylist(res.data.data))
    }, [playlistId])

    const removeVideo = async (videoId) => {
        await api.patch(`/playlist/remove/${videoId}/${playlistId}`)
        setPlaylist({
            ...playlist,
            videos: playlist.videos.filter(p => p._id !== videoId)
        });
    }

    if (!playlist) return <p>Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Playlist Title */}
            <h2 className="text-2xl font-bold mb-6 border-b border-zinc-700 pb-2">
                {playlist.name}
            </h2>

            {/* Videos List */}
            <div className="space-y-4">
                {playlist.videos.map((v) => (
                    <div
                        key={v._id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition"
                    >
                        {/* Clickable Area */}
                        <Link
                            to={`/watch/${v._id}`}
                            className="flex items-center gap-4 flex-1 min-w-0"
                        >
                            {/* Thumbnail */}
                            <img
                                src={v.thumbnail}
                                alt={v.title}
                                className="w-40 h-24 object-cover rounded-md flex-shrink-0"
                            />

                            {/* Title */}
                            <p className="text-lg font-semibold text-white hover:text-blue-400 line-clamp-2">
                                {v.title}
                            </p>
                        </Link>

                        {/* Remove Button */}
                        <button
                            onClick={() => removeVideo(v._id)}
                            className="px-4 py-2 text-sm font-medium text-red-400 border border-red-400 rounded-md hover:bg-red-500 hover:text-white transition"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}