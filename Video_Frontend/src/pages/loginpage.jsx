import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, Setusername] = useState("")
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("")

    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);
    useEffect(() => {
        if (error) {
            setError("")
        }
    }, [email, password, username])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const res = await api.post("/user/login", {
                email,
                password,
                username
            });

            setUser(res.data.data.loggedinUser);
            navigate("/");
        } catch (err) {
            console.error(err.response?.data); // Optional: remove this in production

            setError(
                err.response?.data?.message ||
                "Invalid email/username or password."
            );
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4">
            <h1>Please Login!!</h1>
            <input type="email" className="w-full p-2 bg-zinc-500" placeholder="Email"
                onChange={e => setEmail(e.target.value)} />

            <input type="password" className="w-full p-2 bg-zinc-500" placeholder="Password"
                onChange={e => setPassword(e.target.value)} />

            <input type="text" className="w-full p-2 bg-zinc-500" placeholder="username"
                onChange={e => Setusername(e.target.value)} />

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}
            <button className="bg-blue-400 w-full p-2">Login</button>
        </form>
    );
}
