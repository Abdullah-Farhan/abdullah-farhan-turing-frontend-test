"use client";

import useAuthStore from "@/services/auth.service";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const pathname = usePathname();
  const { logoutUser } = useAuthStore();
  const router = useRouter();

  const logout = async () => {
    try {
      await logoutUser();
      router.push("/login")
      toast.success("Logged out Successfully.");
    } catch (err) {
      console.error(err);
      toast.error("An Unexpected Error Occurred.");
    }
  };

  if (pathname !== "/login") {
    return (
      <div>
        <button
          className="px-4 cursor-pointer md:px-10 py-2 bg-primary text-xs md:text-base text-white"
          onClick={logout}
        >
          Log Out
        </button>
      </div>
    );
  }
};

export default LogoutButton;
