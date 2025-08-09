import {
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

interface PopoutMenuProps {
    trigger: ReactNode;
    children: ReactNode;
    width?: string;
    align?: "left" | "right";
    closeOnClickOutside?: boolean;
    closeOnClickItem?: boolean;
}

export const PopoutMenu = ({
    trigger,
    children,
    width = "w-60",
    align = "right",
    closeOnClickOutside = true,
    closeOnClickItem = true,
}: PopoutMenuProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!closeOnClickOutside) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [closeOnClickOutside]);

    const handleItemClick = () => {
        if (closeOnClickItem) {
            setOpen(false);
        }
    };

    return (
        <div ref={ref} className="relative text-sm">
            <button className="not-btn" onClick={() => setOpen((prev) => !prev)}>
                {trigger}
            </button>

            <div
                className={`absolute mt-2 ${width} bg-white border border-zinc-200 rounded-xl shadow-md z-50 transform transition-all duration-200 ease-out
            ${align === "right" ? "right-0" : "left-0"}
            ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
        `}
                onClick={handleItemClick}
            >
                {children}
            </div>
        </div>

    );
};
