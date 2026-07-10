import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hook/useAuth";
import StatBox from "../components/statBox";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboardpage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user])

    const loadData = async () => {
        try {
            const statsres = await api.get('/dashboard/stats')
            const videores = await api.get('/dashboard/videos')

            setStats(statsres.data.data);
            setVideos(videores.data.data);
        }
        catch (error) {
            console.log(error);
        }
    }
    const togglePublish = async (id) => {
        await api.patch(`/video/toggle/publish/${id}`)
        setVideos(videos.map(v =>
            v._id === id ? { ...v, isPublished: !v.isPublished } : v
        ))
    }

    const deleteVideo = async (id) => {
        await api.delete(`/video/${id}`)
        setVideos(videos.filter(v => v._id !== id))
    }

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <div className="text-center bg-zinc-900 p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Login Required
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Please login to view your Dashboard
                    </p>

                    <Link
                        to="/login"
                        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }
    if (!stats) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>

            <div className="grid grid-cols-4 gap-4 mb-8">
                <StatBox title="Videos" value={stats.totalvideos} />
                <StatBox title="Subscribers" value={stats.totalsubscribers} />
                <StatBox title="Views" value={stats.totalviews} />
                <StatBox title="Likes" value={stats.totalLikes} />
            </div>

            <h2 className="text-xl font-semibold mb-4">Your Videos</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {videos.map(v => (
                    <div key={v._id} className="bg-zinc-900 rounded-lg overflow-hidden">
                        <img src={v.thumbnail} className="h-36 w-full object-cover" />

                        <div className="p-3 space-y-1">
                            <p className="text-white font-medium truncate">{v.title}</p>
                            <p className="text-xs text-gray-400">{v.views} views</p>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => togglePublish(v._id)}
                                    className={`cursor-pointer flex-1 text-xs py-1.5 rounded
                                        ${v.isPublished
                                            ? "bg-indigo-500"
                                            : "bg-teal-500"
                                        } text-white`}
                                >
                                    {v.isPublished ? "Unpublish" : "Publish"}
                                </button>

                                <button
                                    onClick={() => deleteVideo(v._id)}
                                    className="cursor-pointer flex-1 text-xs py-1.5 rounded bg-rose-500 text-white"
                                >
                                    Delete
                                </button>
                                <button onClick={() => navigate(`/edit-video/${v._id}`)} className="cursor-pointer flex-1 text-xs py-1.5 rounded bg-yellow-600 text-white text-center">Edit</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}