import { useEffect, useState } from "react";
import type { UserMe } from "../types";

export const useUserForm = (editing: boolean, user: UserMe | null) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    displayName: "",
    bio: "",
    avatarUrl: "",
    websiteUrl: "",
    location: ""
  });

  useEffect(() => {
    if (editing && user) {
      setFormData({
        email: user.email || "",
        username: user.username || "",
        displayName: user.displayName || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        websiteUrl: user.websiteUrl || "",
        location: user.location || ""
      });
    }
  }, [editing, user]);

  return { formData, setFormData };
};
