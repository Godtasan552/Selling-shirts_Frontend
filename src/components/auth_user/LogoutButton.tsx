"use client";

export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/user_auth/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-outline btn-black text-black hover:scale-105 transition-transform duration-300"
    >
      Logout
    </button>
  );
}
