import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        username: "",
        password: "",
        avatar: null,
        coverImage: null
    })

    const { setUser } = useAuth()
    const navigate = useNavigate()

    const setTexts = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const setFiles = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        setForm({ ...form, [e.target.name]: file })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("fullname", form.fullname);
        formData.append("email", form.email);
        formData.append("username", form.username);
        formData.append("password", form.password);

        if (form.avatar) formData.append("avatar", form.avatar);
        if (form.coverImage) formData.append("coverImage", form.coverImage);

        try {
            const res = await api.post("/user/register", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setUser(res.data.data);
            navigate("/");
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl mb-4">Sign Up</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input name="fullname" placeholder="Full name" onChange={setTexts} className="w-full p-2 bg-zinc-500" />
                <input name="email" placeholder="Email" onChange={setTexts} className="w-full p-2 bg-zinc-500" />
                <input name="username" placeholder="Username" onChange={setTexts} className="w-full p-2 bg-zinc-500" />
                <input name="password" type="password" placeholder="Password" onChange={setTexts} className="w-full p-2 bg-zinc-500" />
                <input name="avatar" type="file" placeholder="avatar" onChange={setFiles} className="w-full p-2 bg-zinc-500" />
                <input name="coverImage" type="file" placeholder="coverImage" onChange={setFiles} className="w-full p-2 bg-zinc-500" />

                <button className="bg-blue-400 px-4 py-2">Register</button>
            </form>
        </div>
    )

}