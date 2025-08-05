import { Newspaper } from "lucide-react";
import { Link } from "react-router"
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
    const { token, logout } = useAuth();

    return (
        <nav className="w-full flex flex-col justify-between items-center">
            <div className="p-4 w-full text-center
 text-2xl font-semibold border-b border-gray-200 flex justify-between items-center">
                <Link to="https://rudnam.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Newspaper className="h-8 w-8 text-gray-800 cursor-pointer" />
                </Link>
                <Link to="/" className="font-serif text-gray-800">
                    Rudnote
                </Link>
                {token ? (
                    <button
                        onClick={() => logout()}
                        className="text-sm hover:bg-gray-200 px-3 py-2 rounded h-full"
                    >
                        Log out
                    </button>
                ) : (
                    <Link to="/login" className="text-sm hover:bg-gray-200 px-3 py-2 rounded h-full">
                        Sign in
                    </Link>
                )}

            </div>
            <ul className="w-full text-center flex justify-center border-b border-gray-200">
                <Link to="/" className="hover:bg-gray-200 text-sm font-semibold px-3 py-4">
                    <li>Home</li>
                </Link>
                {token && (
                    <Link to="/studio" className="hover:bg-gray-200 text-sm font-semibold px-3 py-4">
                        <li>Studio</li>
                    </Link>
                )}
                <Link to="/about" className="hover:bg-gray-200 text-sm font-semibold px-3 py-4">
                    <li>About</li>
                </Link>
                <Link to="/contact" className="hover:bg-gray-200 text-sm font-semibold px-3 py-4">
                    <li>Contact</li>
                </Link>
            </ul>
        </nav >
    );
}