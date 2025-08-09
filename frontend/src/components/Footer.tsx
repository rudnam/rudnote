import { Link } from "react-router";

export const Footer = () => {
    return (
        <footer className="w-full border-t border-zinc-300 bg-white dark:bg-zinc-900">
            <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    © {new Date().getFullYear()} Rudnote. All rights reserved.
                </p>

                <nav>
                    <ul className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                        <li>
                            <Link to="/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};
