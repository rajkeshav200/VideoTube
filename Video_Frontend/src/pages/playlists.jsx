import { useEffect, useState } from "react";
import api from "../api/axios";
//import { useAuth } from "../hook/useAuth";
import { Link } from "react-router-dom";

export default function PlayList({ user }) {
    // const { user } = useAuth()
    const [lists, setLists] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        if (!user?._id) return;
        api.get(`/playlist/user/${user._id}`)
            .then(res => setLists(res.data.data))
    }, [user])

    if (!user) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <h2 className="text-xl font-bold text-black-500">
                    Login required !!
                </h2>
            </div>
        );
    }

    const createPlaylist = async () => {
        if (!name || !description) return
        const res = await api.post('/playlist', {
            name,
            description
        });
        setLists([res.data.data, ...lists])
        setName("")
        setDescription("")
    }

    const deletePlaylist = async (playlistId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this playlist?"
        );
        if (!confirmDelete) return;

        try {
            await api.delete(`/playlist/${playlistId}`);

            // remove from UI instantly
            setLists(prev => prev.filter(p => p._id !== playlistId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete playlist");
        }
    };


    return (
        <div className="max-w-xl mx-auto p-4 space-y-5">
            <h2 className="text-xl font-semibold tracking-wide">My Playlists</h2>

            {/* Create bar */}
            <div className="flex items-center gap-2 border border-zinc-700 rounded-lg p-2">
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Name"
                    className="flex-1 bg-transparent outline-none text-sm"
                />
                <input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description"
                    className="flex-1 bg-transparent outline-none text-sm"
                />
                <button
                    onClick={createPlaylist}
                    className="px-4 py-2 text-sm rounded-md bg-purple-400 hover:bg-zinc-600"
                >
                    ADD
                </button>
            </div>

            {/* Playlist list */}
            <div className="space-y-2">
                {lists.map(p => (
                    <div
                        key={p._id}
                        className="flex items-center justify-between gap-3 p-3 rounded-md border border-transparent hover:border-zinc-700 transition"
                    >
                        {/* Left: playlist link */}
                        <Link
                            to={`/playlist/${p._id}`}
                            className="flex items-center gap-3 flex-1 min-w-0"
                        >
                            <span className="w-1.5 h-6 rounded-full bg-blue-500/70" />
                            <span className="font-medium text-sm truncate">{p.name}</span>
                        </Link>

                        {/* Right: delete button */}
                        <button
                            onClick={() => deletePlaylist(p._id)}
                            className="px-3 py-1 text-xs font-medium text-zinc-800 
                           border border-black-400 rounded-md
                           hover:bg-red-500 hover:text-white transition"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>

    )
}