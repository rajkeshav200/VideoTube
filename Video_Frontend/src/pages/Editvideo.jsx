import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditVideo() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    api.get(`/video/${videoId}`)
      .then(res => {
        const video = res.data.data;
        setTitle(video.title);
        setDescription(video.description);
      });
  }, [videoId]);

  const updateVideo = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    await api.patch(`/video/${videoId}`, formData);

    alert("Video updated successfully");
    navigate("/dashboard");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit Video</h2>

      <input
        className="border p-2 w-full mb-3"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
      />

      <textarea
        className="border p-2 w-full mb-3"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
      />

      <input
        type="file"
        onChange={e => setThumbnail(e.target.files[0])}
        className="mb-3"
      />

      <button
        onClick={updateVideo}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Update
      </button>
    </div>
  );
}
