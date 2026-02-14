import { useEffect, useState } from "react";
import api from "../api/axios";
import { useSearchParams } from "react-router-dom";

export default function Searchpage() {
    const [video, setVideo] = useState([])
    const [param] = useSearchParams()

    useEffect(() => {
        const q = param.get("q")
        api.get(`/video?query=${q}`)
            .then((e) => setVideo(e.data.data.docs))
    }, [param])

    return (
        <div>
            <h2>Search Results</h2>

            {video.length === 0 ? <p>No such Video exists</p> :
                video.map(v => (
                    <div key={v._id}>
                        <img src={v.thumbnail} width="200" />
                        <p>{v.title}</p>
                    </div>
                ))}
        </div>
    )
}