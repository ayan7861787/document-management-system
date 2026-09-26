import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const Register = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("employee");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            const response = await api.post("/auth/register", {
                name,
                email,
                password,
                role
            });

            console.log("REGISTER RESPONSE:", response.data);

            alert("Registration successful. Please login.");

            // Clear form
            setName("");
            setEmail("");
            setPassword("");
            setRole("employee");

            // Go to login page
            navigate("/login");

        } catch (error) {

            console.log("REGISTER ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleRegister}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-md"
            >

                <h2 className="text-3xl font-bold text-center mb-6">
                    Create Account
                </h2>


                {/* Name */}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    required
                />


                {/* Email */}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    required
                />


                {/* Password */}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded mb-4"
                    required
                />


                {/* Role */}

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border p-3 rounded mb-5"
                >
                    <option value="employee">
                        Employee
                    </option>

                    <option value="admin">
                        Admin
                    </option>
                </select>


                {/* Register */}

                <button
                    type="submit"
                    className="w-full bg-black text-white p-3 rounded hover:bg-gray-800"
                >
                    Register
                </button>


                {/* Login */}

                <p className="text-center mt-5 text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-black font-semibold hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </form>

        </div>
    );
};

export default Register;

