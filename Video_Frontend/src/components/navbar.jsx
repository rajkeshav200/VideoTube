// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/authContext";
// import { useContext, useState } from "react";

// export default function Navbar() {
//     const { user, loading } = useContext(AuthContext);
//     const [q, setQ] = useState("")
//     const navigate = useNavigate()

//     const search = () => {
//         navigate(`/search?q=${q}`)
//     }

//     return (
//         <div className="h-14 bg-zinc-800 flex items-center px-4">
//             <h1 className="font-bold">VideoTube</h1>

//             <input
//                 placeholder="Search videos"
//                 value={q}
//                 onChange={(e) => setQ(e.target.value)}
//             />
//             <button onClick={search}>Search</button>

//             {!loading && (
//                 user ? <p>{user.username}</p> : <Link to="/login">Login</Link>
//             )}
//             <Link to="/dashboard">Dashboard</Link>
//         </div>
//     );
// }

import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext, useState } from "react";
import api from "../api/axios";

export default function Navbar() {
    const { user, loading, setUser } = useContext(AuthContext);
    const [q, setQ] = useState("");
    const navigate = useNavigate();

    const search = () => {
        navigate(`/search?q=${q}`);
        setQ("")
    };

    const logout = async () => {
        const confirmlogout = window.confirm("Are you sure to logout?")
        if(!confirmlogout) return

        try {
            await api.post("/user/logout");
        } catch (err) {
            if (err.response?.status !== 401) {
                console.error(err);
            }
        }
        finally {
            setUser(null);
            navigate("/login");
        }
    };

    return (
        <div className="h-16 bg-pink-200 flex items-center justify-between px-6 shadow-md border-b">

            {/* Logo */}
            <h1 className="font-extrabold text-xl tracking-wide">
                <Link
                    to="/"
                    className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent hover:opacity-90 transition"
                >
                    VideoTube
                </Link>
            </h1>

            {/* Search */}
            <div className="flex items-center gap-2 w-[40%]">
                <input
                    className="flex-1 px-4 py-2 rounded-full border border-zinc-600 
                   text-black placeholder-black
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Search videos"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <button
                    onClick={search}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full transition"
                >
                    Search
                </button>
            </div>

            {/* Right side */}
            {!loading && (
                user ? (
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <Link to="/profile">
                            <img
                                src={user.avatar}
                                alt="avatar"
                                className="w-10 h-10 rounded-full cursor-pointer"
                            />
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center gap-6 text-gray-700 font-medium">
                            <Link
                                to="/upload"
                                className="hover:text-indigo-600 transition"
                            >
                                Upload
                            </Link>

                            <button
                                onClick={logout}
                                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                ) : (
                    <div className="flex items-center gap-4">
                        <Link className="text-gray-700 hover:text-indigo-600" to="/login">
                            Login
                        </Link>
                        <Link
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full"
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </div>
                )
            )}
        </div>
    )
}
