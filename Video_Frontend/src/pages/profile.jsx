import { useState } from "react";
import SubscribeBtn from "../components/subscribeBtn";
import { useAuth } from "../hook/useAuth";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Profile() {
    const { user, setUser } = useAuth();
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState(null);
    const [cover, setCover] = useState(null);

    const updateAccount = async () => {
        await api.patch("/user/update-account", {
            fullname,
            email: email
        })
            .then(res => setUser(res.data.data))
    }

    const updateAvatar = async () => {
        const formdata = new FormData();
        formdata.append("avatar", avatar)
        const res = await api.patch('/user/avatar', formdata);
        setUser(res.data.data)
    }

    const updateCover = async () => {
        const formData = new FormData();
        formData.append("coverImage", cover);
        const res = await api.patch("/user/coverImage", formData);
        setUser(res.data.data);
    };

    if (!user) {
        return (
            <div className="h-[70vh] flex items-center justify-center">
                <div className="text-center bg-zinc-900 p-8 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Login Required
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Please login to view your profile and subscriptions
                    </p>

                    <Link
                        to="/login"
                        className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            {/* Cover */}
            <img
                src={user.coverImage || null}
                className="w-full h-48 object-cover rounded-lg border"
            />

            {/* Avatar + Info */}
            <div className="flex items-center gap-6 -mt-14">
                <img
                    src={user.avatar}
                    className="w-28 h-28 rounded-full border-4 border-white shadow"
                />
                <div>
                    <h2 className="text-xl font-semibold">{user.fullname}</h2>
                    <p className="text-gray-500">{user.email}</p>
                </div>
            </div>

            {/* Text Inputs */}
            <div className="grid sm:grid-cols-2 gap-4">
                <input
                    value={fullname}
                    onChange={e => setFullname(e.target.value)}
                    placeholder="Full name"
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>

            {/* File Inputs */}
            <div className="grid sm:grid-cols-2 gap-4">
                <label className="block text-sm mb-1">Avatar *</label>
                <input
                    type="file"
                    onChange={e => setAvatar(e.target.files[0])}
                    className="border rounded-lg p-2 cursor-pointer hover:border-indigo-500"
                />
                <label className="block text-sm mb-1">CoverImage</label>
                <input
                    type="file"
                    onChange={e => setCover(e.target.files[0])}
                    className="border rounded-lg p-2 cursor-pointer hover:border-indigo-500"
                />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={updateAccount}
                    className="border border-indigo-600 text-indigo-600 px-5 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                >
                    Update Account
                </button>

                <button
                    onClick={updateAvatar}
                    className="border border-teal-600 text-teal-600 px-5 py-2 rounded-lg hover:bg-teal-600 hover:text-white transition"
                >
                    Update Avatar
                </button>

                <button
                    onClick={updateCover}
                    className="border border-violet-600 text-violet-600 px-5 py-2 rounded-lg hover:bg-violet-600 hover:text-white transition"
                >
                    Update Cover
                </button>

                <Link
                    to="/change-password"
                    className="ml-auto text-indigo-600 hover:underline"
                >
                    Change Password
                </Link>
            </div>
        </div>


    );
}


// import { useAuth } from "../hook/useAuth";

// export default function Profile() {
//     const { user } = useAuth()

//     if(!user) return null;

//     return (
//         <div>
//             <img src={user.avatar} width="100" />
//             <h2>{user.username}</h2>
//             <p>{user.email}</p>
//         </div>
//     );
// }