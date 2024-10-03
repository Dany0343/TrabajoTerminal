// components/Navbar.jsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dynamic from "next/dynamic";
import UnauthenticatedNavbar from "./UnauthenticatedNavbar";

const AuthenticatedHeader = dynamic(() => import("./AuthenticatedHeader"), { ssr: false });

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return <AuthenticatedHeader />;
  }

  return <UnauthenticatedNavbar />;
};

export default Navbar;