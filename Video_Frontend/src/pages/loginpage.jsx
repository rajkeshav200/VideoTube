import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, Setusername] = useState("")
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await api.post('/user/login', { email, password,username })
        setUser(res.data.data.loggedinUser)
        navigate('/')
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

            <button className="bg-blue-400 w-full p-2">Login</button>
        </form>
    );
}
