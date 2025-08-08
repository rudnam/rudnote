import { useUserForm } from "../hooks/useUserForm";
import { useState } from "react";
import { API_URL } from "../consts";
import type { UserMe } from "../types";
import { useAuth } from "../context/AuthContext";

export const UserProfileForm = ({
    user,
    token,
    onClose,
}: {
    user: UserMe;
    token: string;
    onClose: () => void;
}) => {
    const { refetchUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const { formData, setFormData } = useUserForm(true, user);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/users/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update");

            await refetchUser();
            onClose();
        } catch {
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { label: "Email", key: "email" },
        { label: "Username", key: "username" },
        { label: "Display Name", key: "displayName" },
        { label: "Bio", key: "bio", isTextarea: true },
        { label: "Avatar URL", key: "avatarUrl" },
        { label: "Website", key: "websiteUrl" },
        { label: "Location", key: "location" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ label, key, isTextarea }) => (
                <div key={key} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-zinc-700">{label}</label>
                    {isTextarea ? (
                        <textarea
                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            rows={4}
                            value={(formData as any)[key] ?? ""}
                            onChange={(e) =>
                                setFormData({ ...formData, [key]: e.target.value })
                            }
                        />
                    ) : (
                        <input
                            type="text"
                            className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={(formData as any)[key] ?? ""}
                            onChange={(e) =>
                                setFormData({ ...formData, [key]: e.target.value })
                            }
                        />
                    )}
                </div>
            ))}

            <div className="flex justify-end gap-4 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-zinc-700 hover:text-black underline"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className={`px-4 py-2 rounded-md text-white ${saving
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                        }`}
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
};
