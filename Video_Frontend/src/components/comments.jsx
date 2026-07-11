import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Comment({ videoId }) {
    const [comment, setComment] = useState([])
    const [text, setText] = useState("")
    const [editingId, setEditingId] = useState(null)
    const [edit, setEdit] = useState("")

    useEffect(() => {
        api.get(`/comment/${videoId}`)
            .then(res => setComment(res.data.data));
    }, [videoId])

    // const loadComment = async () => {
    //     const res = await api.get(`/comments/${videoId}`)
    //     setComment(res.data.data)
    // }

    const addcomment = async () => {
        if (!text.trim()) return
        const res = await api.post(`/comment/${videoId}`, { content: text })
        setComment(prev => [res.data.data, ...prev])
        setText("")
    }

    const deletecomment = async (id) => {
        await api.delete(`/comment/c/${id}`)
        setComment(prev => prev.filter(c => c._id !== id))
    }

    const toggleCommentLike = async (commentId) => {
        setComment(prev =>
            prev.map(c =>
                c._id === commentId
                    ? {
                        ...c,
                        isLiked: !c.isLiked,
                        likesCount: c.isLiked
                            ? (c.likesCount || 0) - 1
                            : (c.likesCount || 0) + 1
                    }
                    : c
            )
        );

        try {
            await api.post(`/like/toggle/c/${commentId}`);
        } catch (err) {
            console.error(err);
            // rollback on failure
            setComment(prev =>
                prev.map(c =>
                    c._id === commentId
                        ? {
                            ...c,
                            isLiked: !c.isLiked,
                            likesCount: c.isLiked
                                ? (c.likesCount || 0) + 1
                                : (c.likesCount || 0) - 1
                        }
                        : c
                )
            );
        }
    };

    const startEdit = (comment) => {
        if (!comment.isOwner) return;
        setEdit(comment.content)
        setEditingId(comment._id)
    }
    const cancelEdit = () => {
        setEdit("")
        setEditingId(null)
    }
    const Editcomment = async (commentId) => {
        if (!edit.trim()) return
        try {
            const res = await api.patch(`/comment/c/${commentId}`, { content: edit })
            // setEdit(prev =>
            //     prev._id === commentId ? {
            //         ...prev, content: res.data.data.content
            //     } : prev,

                setComment(prev => 
                    prev.map(c => (
                        c._id === commentId ? { ...c, content: res.data.data.content } : c
                    ))
                )
            //)
            cancelEdit()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>

            {/* Add Comment */}
            <div className="flex gap-2 mb-6">
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Add a comment"
                    className="flex-1 border border-gray-500 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={addcomment}
                    className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
                >
                    Post
                </button>
            </div>

            {/* Comment List */}
            <div className="space-y-2">
                {comment.map(c => (
                    <div
                        key={c._id}
                        className="flex gap-3 p-3 border border-gray-700 rounded-lg"
                    >
                        {/* Avatar */}
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-800 text-white font-semibold uppercase">
                            {c.owner?.username?.[0]}
                        </div>
                        {/* Comment Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800">
                                    @{c.owner?.username}
                                </span>
                            </div>
                            <p className="text-zinc-900 mt-1">{c.content}</p>
                            <div className="flex items-center gap-4 mt-2">
                                {/* ❤️ LIKE BUTTON */}
                                <button
                                    onClick={() => toggleCommentLike(c._id)}
                                    className={`text-sm flex items-center gap-1
                                    ${c.isLiked ? "text-red-600" : "text-gray-500"}`}
                                >
                                    {c.isLiked ? "❤️" : "🤍"} {c.likesCount}
                                </button>
                                {editingId === c._id ? (
                                    <div className="mt-1">
                                        <textarea
                                            value={edit}
                                            onChange={e => setEdit(e.target.value)}
                                            className="w-full border border-gray-400 rounded-md p-2 text-sm"
                                            rows={2}
                                        />

                                        <div className="flex gap-3 mt-2">
                                            <button
                                                onClick={() => Editcomment(c._id)}
                                                className="text-sm text-green-700 hover:underline"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="text-sm text-gray-500 hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-zinc-900 mt-1">{c.content}</p>
                                )}
                                {c.isOwner && editingId !== c._id && (
                                    <div className="flex items-center gap-4 mt-2">
                                        <button
                                            onClick={() => startEdit(c)}
                                            className="text-sm text-blue-700 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deletecomment(c._id)}
                                            className="text-sm text-red-700 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}