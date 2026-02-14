import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

export default function Channel() {
    const {user} = useAuth()
    const { username } = useParams()
    const [channel, setChannel] = useState(null)
    const [tab, setTab] = useState("videos");
    const [videos, setVideo] = useState([])
    const [playlists, setPlaylists] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [subscribers, setSubscribers] = useState([]);

    useEffect(() => {
        api.get(`/user/c/${username}`)
            .then(res => setChannel(res.data.data))
            .catch(console.error)
    }, [username])

    useEffect(() => {
        if (!channel) return;

        if (tab === "videos") {
            api.get('/video')
                .then(res => {
                    //console.log("VIDEO RESPONSE", res.data.data)
                    const uservideo = res.data.data.docs.filter(
                        v => v.owner?._id === channel._id
                    )
                    setVideo(uservideo)
                })
        }
        if (tab === "playlists") {
            api.get(`/playlist/user/${channel._id}`)
                .then(res => setPlaylists(res.data.data))
        }
        if (tab === "tweets") {
            api.get(`/tweet/user/${channel._id}`)
                .then(res => setTweets(res.data.data));
        }

        if (tab === "subscribers") {
            api.get(`/subscription/c/${channel._id}`)
                .then(res => setSubscribers(res.data.data));
        }
    }, [tab, channel]);

    const toggle = async () => {
        if (!user) {
            alert("Please login");
            return;
        }

        if (channel._id === user._id) {
            alert("You cannot subscribe to your own channel");
            return;
        }
        setChannel(prev => ({
            ...prev,
            isSubscribed: !prev.isSubscribed,
            subscribersCount: prev.isSubscribed
                ? prev.subscribersCount - 1
                : prev.subscribersCount + 1
        }));

        try {
            await api.post(`/subscription/c/${channel._id}`);
        } catch (err) {
            setChannel(prev => ({
                ...prev,
                isSubscribed: !prev.isSubscribed,
                subscribersCount: prev.isSubscribed
                    ? prev.subscribersCount + 1
                    : prev.subscribersCount - 1
            }));
        }
    };

    if (!channel) return <p>Loading...</p>;

    return (
        <div>
            <div className="w-full">
                <div className="w-full h-52 md:h-64">
                    <img
                        src={channel.coverImage}
                        alt="cover"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex items-center justify-between px-6 py-1">
                    <div className="flex items-center gap-5">
                        <img
                            src={channel.avatar}
                            alt="avatar"
                            className="w-28 h-28 rounded-full border-2"
                        />

                        <div>
                            <h2 className="text-2xl font-bold">{channel.username}</h2>
                            <p className="text-gray-800 text-sm">
                                {channel.subscribersCount} subscribers
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggle}
                        className={`px-5 py-2 rounded-full font-medium transition 
                                ${channel.isSubscribed
                                ? "bg-gray-200 text-black hover:bg-gray-300"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                    >
                        {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                </div>
            </div>
            <div className="flex gap-6 px-4 border-b">
                {["videos", "playlists", "tweets", "subscribers"].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={tab === t ? "font-bold" : ""}
                    >
                        {t.toUpperCase()}
                    </button>
                ))}
            </div>
            {tab === "videos" && (
                <div className="grid grid-cols-4 gap-4 p-4">
                    {videos.map(v => (
                        <Link key={v._id} to={`/watch/${v._id}`}>
                            <img src={v.thumbnail} />
                            <p>{v.title}</p>
                        </Link>
                    ))}
                </div>
            )}
            {tab === "playlists" && (
                <div className="p-4">
                    {playlists.map(p => (
                        <Link key={p._id} to={`/playlist/${p._id}`}>
                            <p>{p.name}</p>
                        </Link>
                    ))}
                </div>
            )}
            {tab === "tweets" && (
                <div className="p-4">
                    {tweets.map(t => (
                        <p key={t._id}>{t.content}</p>
                    ))}
                </div>
            )}
            {tab === "subscribers" && (
                <div className="p-4">
                    {subscribers.map(s => (
                        <Link key={s._id} to={`/channel/${s.subscriber.username}`}>
                            <div className="flex items-center gap-2">
                                <img src={s.subscriber.avatar} className="w-10 h-10 rounded-full" />
                                <p>{s.subscriber.username}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
// res = {
//   data: {
//     data: { ...actual channel object }
//   }
// }
