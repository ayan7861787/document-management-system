import { useAuth } from "../context/AuthContext";

const Navbar = () => {

    const { logout } = useAuth();

    return (
        <nav className="h-16 bg-white border-b flex items-center justify-between px-6">

            <h1 className="text-xl font-bold">
                Document Management System
            </h1>

            <button
                onClick={logout}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Logout
            </button>

        </nav>
    );
};

export default Navbar;