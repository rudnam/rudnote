import { Newspaper } from "lucide-react";
import { Link, } from "react-router"
import { ProfileButton } from "./ProfileButton";

export const Navbar = () => {

    return (
        <nav className="w-full flex flex-col">
            <div className="py-4 px-6 font-semibold border-b border-zinc-200 flex justify-between items-center">
                <Link to="https://rudnam.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center hover:bg-zinc-200 rounded-lg"
                >
                    <Newspaper className="h-8 w-8" />
                </Link>
                <Link to="/" className="text-2xl font-serif font-bold">
                    Rudnote
                </Link>
                <ProfileButton />
            </div>

        </nav >
    );
}