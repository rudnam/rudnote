import { useRef, useLayoutEffect } from "react";

export function AutoResizeTextarea({
    value,
    onChange,
    placeholder,
    className,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const ref = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        if (ref.current) {
            ref.current.style.height = "0px";
            ref.current.style.height = `${ref.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={ref}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={1}
            className={`w-full overflow-hidden resize-none focus:outline-none ${className}`}
            {...props}
        />
    );
}
