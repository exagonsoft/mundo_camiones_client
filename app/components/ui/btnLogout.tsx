// /components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/", // Redirect to the homepage after logout
    });
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 20px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
