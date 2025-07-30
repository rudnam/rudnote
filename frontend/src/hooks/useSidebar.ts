import { useState } from "react";

export function useSidebar(initialOpen = true) {
  const [sidebarOpen, setSidebarOpen] = useState(initialOpen);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return { sidebarOpen, toggleSidebar, closeSidebar };
}
