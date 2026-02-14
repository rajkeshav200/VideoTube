import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/user/currentuser")
            .then(res => setUser(res.data.data.user))
            .catch((err) => {
                if (err.response?.status !== 401) {
                    console.error(err); // log only unexpected errors
                }
                setUser(null);
            })
            .finally(() => setLoading(false))
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}