import { useContext, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthContext } from "../context/authContext";

export default function Register() {
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        username: "",
        password: "",
        avatar: null,
        coverImage: null
    })
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser } = useAuth()
    const navigate = useNavigate()

    const { user } = useContext(AuthContext)
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const setTexts = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError("")
    }
    const setFiles = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        setForm({ ...form, [e.target.name]: file })
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true)
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("fullname", form.fullname);
        formData.append("email", form.email);
        formData.append("username", form.username);
        formData.append("password", form.password);

        if (form.avatar) formData.append("avatar", form.avatar);
        if (form.coverImage) formData.append("coverImage", form.coverImage);

        try {
            const res = await api.post("/user/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setSuccess(res.data.message);
            setUser(res.data.data);

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (err) {
            console.log(err.response?.data);
            setError(
                err.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false)
        }
    };

    console.log("error:", error);
    console.log("user:", user);
    
    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-xl mb-4">Sign Up</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input name="fullname" placeholder="Full name" onChange={setTexts} className="w-full p-2 bg-zinc-500" />
                <input name="email" placeholder="Email" onChange={setTexts} className="w-full p-2 bg-zinc-500" />
                <input name="username" placeholder="Username" onChange={setTexts} className="w-full p-2 bg-zinc-500" />
                <input name="password" type="password" placeholder="Password" onChange={setTexts} className="w-full p-2 bg-zinc-500" />
                <label className="block text-sm mb-1">Avatar</label>
                <input name="avatar" type="file" placeholder="avatar" onChange={setFiles} className="w-full p-2 bg-zinc-500" />
                <label className="block text-sm mb-1">Cover Image</label>
                <input name="coverImage" type="file" placeholder="coverImage" onChange={setFiles} className="w-full p-2 bg-zinc-500" />
                <p style={{ color: "red", fontSize: "20px" }}>
                    {error}
                </p>
                {success && (
                    <div className="bg-green-500 text-white p-2 rounded">
                        {success}
                    </div>
                )}
                <button
                    disabled={loading}
                    className="bg-blue-400 px-4 py-2 disabled:opacity-50"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    )

}