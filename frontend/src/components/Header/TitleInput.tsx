import clsx from "clsx";

type TitleInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function TitleInput({ value, onChange }: TitleInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Untitled"
      className={clsx(
        "w-[300px] text-center overflow-hidden text-ellipsis whitespace-nowrap",
        "bg-transparent text-zinc-900 dark:text-white",
        "placeholder-zinc-500 dark:placeholder-zinc-400",
        "border-none outline-none text-md font-medium focus:ring-0"
      )}
      aria-label="Note title"
    />
  );
}
