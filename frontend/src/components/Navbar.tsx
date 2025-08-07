import { Newspaper } from "lucide-react";
import { Link, } from "react-router"
import { ProfileButton } from "./ProfileButton";

export const Navbar = () => {

    return (
        <nav className="w-full flex flex-col justify-between items-center">
            <div className="py-4 px-6 w-full text-center text-2xl font-semibold border-b border-gray-200 flex justify-between items-center">
                <Link to="https://rudnam.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center hover:bg-gray-200 rounded-lg">
                    <Newspaper className="h-8 w-8 text-gray-800 cursor-pointer" />
                </Link>
                <Link to="/" className="font-serif font-bold text-gray-800">
                    Rudnote
                </Link>
                <ProfileButton />
            </div>
            <ul className="w-full text-center flex justify-center border-b border-gray-200 font-semibold">
                <Link
                    to="/"
                    className={`hover:bg-gray-200 text-sm px-3 py-4`}
                >
                    <li>Home</li>
                </Link>
                <Link
                    to="/about"
                    className={`hover:bg-gray-200 text-sm px-3 py-4`}
                >
                    <li>About</li>
                </Link>
                <Link
                    to="/contact"
                    className={`hover:bg-gray-200 text-sm px-3 py-4`}
                >
                    <li>Contact</li>
                </Link>
            </ul>
        </nav >
    );
}