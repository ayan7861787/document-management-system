import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const linkClass = ({ isActive }) =>
        `block px-4 py-3 rounded ${
            isActive
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <aside className="w-64 min-h-screen bg-white border-r p-4">

            <h2 className="text-2xl font-bold mb-8">
                DMS
            </h2>

            <div className="space-y-2">

                <NavLink
                    to="/dashboard"
                    className={linkClass}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/documents"
                    className={linkClass}
                >
                    My Documents
                </NavLink>

                <NavLink
                    to="/upload"
                    className={linkClass}
                >
                    Upload Document
                </NavLink>

                <NavLink
                    to="/trash"
                    className={linkClass}
                >
                    Trash
                </NavLink>

            </div>

        </aside>
    );
};

export default Sidebar;