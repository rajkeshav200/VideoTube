import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Comment from "../components/comments";
import Likebutton from "../components/likebutton";
import SubscribeBtn from "../components/subscribeBtn";
import VideoPlayer from "../components/Videoplayer";
import AddToPlaylist from "../components/addtoPlaylist";
import { useAuth } from "../hook/useAuth";

export default function Watch() {
    const { user } = useAuth()
    const { videoId } = useParams()
    const [video, setVideo] = useState(null)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        api.get(`/video/${videoId}`)
            .then(res => setVideo(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [videoId])

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-lg text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-2">👀 Hold on there!</h2>
                    <p className="text-zinc-300 mb-4">
                        You need to{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-violet-400 font-semibold cursor-pointer hover:underline hover:text-violet-300 transition"
                        >
                            log in first
                        </span>{" "}
                        to unlock this video 🔐
                    </p>
                    <p className="text-sm text-zinc-400">
                        First login, then access 😏
                    </p>
                </div>
            </div>
        );
    }

    if (loading) return <p>Loading...</p>;
    if (!video) return <p>Video not found</p>;

    return (
        <div className="watch-page">
            <VideoPlayer videoUrl={video.videoFile} />
            <Likebutton video={video} />
            <SubscribeBtn channel={video.owner} videoId={video._id} />
            <Comment videoId={video._id} />
            <AddToPlaylist videoId={video._id} userId={user._id} />
        </div>
    );
}
// <div className="space-y-4">
    //     <video src={video.videoFile} controls className="w-full rounded" />
    //     <h2 className="text-xl font-bold">{video.title}</h2>
    //     <p>{video.description}</p>
    //     <p className="cursor-pointer text-blue-400"
    //         onClick={() => useNavigate(`/channel/${video.owner.username}`)}
    //     >{video.owner.username}</p>
    //     <Comment videoId={video._id} />
    //     <Likebutton videoId={video._id} />
    //     <SubscribeBtn channelId={video.owner._id} isSubsccribed={false} />
    // </div>