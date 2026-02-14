import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hook/useAuth";
import { Link } from "react-router-dom";

export default function Subscriptionpage() {
    const [channels, setChannel] = useState([])
    const [mysubscriber, setMysubscriber] = useState([])
    const { user } = useAuth()

    useEffect(() => {
        if (!user?._id) return

        api.get(`/subscription/u/${user._id}`)
            .then(prev => setChannel(prev.data.data))
            .catch(console.error)

        api.get(`/subscription/c/${user._id}`)
            .then(prev => setMysubscriber(prev.data.data))
            .catch(console.error)
    }, [user])

    // useEffect(() => {
    //     console.log("Subscribed channels:", channels)
    // }, [channels])

    if (channels.length === 0) return <h1>No subscription</h1>

    return (
        <div style={{ padding: "20px" }}>
            <h2>Subscribed Channels</h2>

            {channels.length === 0 ? (
                <p>No subscriptions yet</p>
            ) : (
                channels.map(c => (
                    <Link key={c.channel._id} to={`/channel/${c.channel.username}`}>
                        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                            <img src={c.channel.avatar} width="50" />
                            <p>{c.channel.username}</p>
                        </div>
                    </Link>
                ))
            )}

            <hr style={{ margin: "30px 0" }} />

            <h2>My Subscribers</h2>

            {mysubscriber.length === 0 ? (
                <p>No one subscribed to you yet 😢</p>
            ) : (
                mysubscriber.map(s => (
                    <Link key={s.subscriber._id} to={`/channel/${s.subscriber.username}`}>
                        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                            <img src={s.subscriber.avatar} width="50" />
                            <p>{s.subscriber.username}</p>
                        </div>
                    </Link>
                ))
            )}
        </div>
    );
}