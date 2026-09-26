
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log("LOGIN RESPONSE:", response.data);

            // Save token using AuthContext
            login(
    response.data.token,
    response.data.user
);

            alert("Login successful");

            // Redirect according to role
            if (response.data.user?.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            console.log("LOGIN ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-md"
            >

                <h2 className="text-3xl font-bold text-center mb-6">
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded mb-5"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white p-3 rounded hover:bg-gray-800"
                >
                    Login
                </button>

            </form>

        </div>
    );
};

export default Login;

