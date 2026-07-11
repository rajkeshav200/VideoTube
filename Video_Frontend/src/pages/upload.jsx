import { useState } from "react";
import api from "../api/axios";

export default function Upload() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const upload = async () => {
        if (!videoFile || !thumbnail) {
            alert("Video and thumbnail are required");
            return;
        }
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("videoFile", videoFile);
        formData.append("thumbnail", thumbnail);

        try {
            const res = await api.post("/video", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert("Uploaded successfully!");
            console.log(res.data);
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Upload failed");
        }
    };
    return (
        <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Upload Video</h2>

            <input
                className="border p-2 w-full mb-3"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className="border p-2 w-full mb-3"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
            />

            <label className="block text-sm mb-1">Video</label>
            <input className="border p-2 w-full mb-3"
                type="file" placeholder="video"
                onChange={(e) => setVideoFile(e.target.files[0])}
            />
            <label className="block text-sm mb-1">Thumbnail</label>
            <input className="border p-2 w-full mb-3"
                type="file" placeholder="thumbnail"
                onChange={(e) => setThumbnail(e.target.files[0])}
            />
            <br />
            <button
                onClick={upload}
                className="bg-violet-700 text-white px-4 py-2 mt-3"
            >
                Upload
            </button>
        </div>
    )
}