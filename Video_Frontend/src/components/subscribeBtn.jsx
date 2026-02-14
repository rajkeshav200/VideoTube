import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SubscribeBtn({ channel }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [subscribed, setSubscribed] = useState(null)
  const [loading, setLoading] = useState(true)

  //const [subs, setSub] = useState(channel.isSubscribed)
  useEffect(() => {
    if (!channel?.username) return;

    api.get(`/user/c/${channel.username}`)
      .then(prev => setSubscribed(prev.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [channel?.username])

  if (loading || !subscribed) return null;

  if (user?._id === subscribed._id) return null;

  const toggle = async () => {
    if (!user) {
      alert("Please login to subscribe");
      navigate("/login");
      return;
    }
    setSubscribed(prev => ({
      ...prev,
      isSubscribed: !prev.isSubscribed,
      subscribersCount: prev.isSubscribed
        ? prev.subscribersCount - 1
        : prev.subscribersCount + 1
    }))
    try {
      await api.post(`/subscription/c/${subscribed._id}`);
    } catch (err) {
      // rollback
      setSubscribed(prev => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed
          ? prev.subscribersCount + 1
          : prev.subscribersCount - 1
      }));
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Link to={`/channel/${subscribed.username}`}>
        <img src={subscribed.avatar} width="50" />
      </Link>
      <div>
        <h4>{subscribed.username}</h4>
        <p>{subscribed.subscribersCount} subscribers</p>
      </div>
      <button
        onClick={toggle}
        className={`h-9 px-4 rounded-full text-sm font-medium
            transition-all duration-200
            ${subscribed.isSubscribed
            ? "bg-gray-200 text-black hover:bg-gray-300"
            : "bg-red-600 text-white hover:bg-red-700"
          }`}
      >
        {subscribed.isSubscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  )
}

/*
     <button
  onClick={toggleSubscribe}
  disabled={loading}
  className={`px-4 py-2 rounded font-semibold transition
    ${
      subscribed
        ? "bg-gray-600 hover:bg-gray-700"
        : "bg-red-600 hover:bg-red-700"
    }
    ${loading ? "opacity-50 cursor-not-allowed" : ""}
  `}
>
  {loading
    ? "Processing..."
    : subscribed
    ? "Subscribed"
    : "Subscribe"}
</button>*/