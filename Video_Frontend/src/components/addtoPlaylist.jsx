import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AddToPlaylist({ videoId, userId }) {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (!userId) return;

    api.get(`/playlist/user/${userId}`)
      .then(res => {
        // safety dedupe (UI-level)
        const unique = Array.from(
          new Map(res.data.data.map(p => [p._id, p])).values()
        );
        setLists(unique);
      })
      .catch(console.error);
  }, [userId]);

  const toggleVideo = async (playlistId, isPresent) => {
    try {
      await api.patch(
        isPresent
          ? `/playlist/remove/${videoId}/${playlistId}`
          : `/playlist/add/${videoId}/${playlistId}`
      );

      const res = await api.get(`/playlist/user/${userId}`);
      setLists(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="yt-playlist-box">
      <h4 className="yt-title">Save to playlist</h4>

      <div className="yt-playlist-list">
        {lists.map(p => {
          const isChecked = p.videos?.includes(videoId);

          return (
            <label key={p._id} className="yt-playlist-item">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleVideo(p._id, isChecked)}
              />
              <span className="yt-checkbox" />
              <span className="yt-playlist-name">{p.name}</span>
            </label>
          );
        })}
      </div>
    </div>

  );
}
