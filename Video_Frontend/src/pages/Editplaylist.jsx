import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditPlaylist() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    api.get(`/playlist/${playlistId}`)
      .then(res => {
        const playlist = res.data.data;
        setName(playlist.name);
        setDescription(playlist.description || "");
      });
  }, [playlistId]);

  const updatePlaylist = async () => {
    await api.patch(`/playlist/${playlistId}`, {
      name,
      description
    });
    alert("Playlist updated successfully");
    navigate("/playlist");
  };

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-xl font-bold mb-4">
        Edit Playlist
      </h2>

      <input
        className="border p-2 w-full mb-3"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Playlist Name"
      />

      <textarea
        className="border p-2 w-full mb-3"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
      />

      <button
        onClick={updatePlaylist}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update Playlist
      </button>
    </div>
  );
}
