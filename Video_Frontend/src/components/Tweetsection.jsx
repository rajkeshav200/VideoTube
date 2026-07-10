import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hook/useAuth";


export default function TweetsSection({ channel }) {
  const { user } = useAuth();   
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");

  const isOwner = user?._id === channel._id;

  useEffect(() => {
    api.get(`/tweet/user/${channel._id}`)
      .then(res => setTweets(res.data.data));
  }, [channel._id]);

  const createTweet = async () => {
    if (!content.trim()) return;

    const res = await api.post("/tweet", { content });
    setTweets([res.data.data, ...tweets]);
    setContent("");
  };

  const deleteTweet = async (id) => {
    await api.delete(`/tweet/${id}`);
    setTweets(tweets.filter(t => t._id !== id));
  };

  const updateTweet = async (id) => {
    const newContent = prompt("Update tweet:");
    if (!newContent) return;

    const res = await api.patch(`/tweet/${id}`, {
      content: newContent
    });

    setTweets(tweets.map(t =>
      t._id === id ? res.data.data : t
    ));
  };

  return (
    <div className="p-4 space-y-4">

      {/* Create tweet (only owner) */}
      {isOwner && (
        <div>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="border w-full p-2"
          />
          <button onClick={createTweet}>
            Tweet
          </button>
        </div>
      )}

      {/* Tweets list */}
      {tweets.map(tweet => (
        <div key={tweet._id} className="border p-3 rounded">
          <p>{tweet.content}</p>

          {isOwner && (
            <div className="flex gap-3 text-sm">
              <button onClick={() => updateTweet(tweet._id)}>
                Edit
              </button>
              <button onClick={() => deleteTweet(tweet._id)}>
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
