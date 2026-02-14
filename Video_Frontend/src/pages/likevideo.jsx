import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Likedvideo() {
    const [likes, setLikes] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/like/likeVideo')
            .then((res) => setLikes(res.data?.data) || [])
            .catch((err) => {
                console.error(err);
                setLikes([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [])

    if (loading) {
        return (
            <p className="text-lg text-gray-400">
                Loading liked videos...
            </p>
        );
    }
    if (likes.length === 0) {
        return (
            <p className="text-lg text-black-500">
                No video is liked
            </p>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Liked Videos</h2>

            <div className="grid grid-cols-4 gap-4">
                {likes.map(v => (
                    <Link key={v._id} to={`/watch/${v.likevideo._id}`}>
                        <div>
                            <img src={v.likevideo.thumbnail} width="200"/>
                            <p className="font-semibold">{v.likevideo.title}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}