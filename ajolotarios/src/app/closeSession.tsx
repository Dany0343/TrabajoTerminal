"use client";
import { signOut } from "next-auth/react";

export default function CloseSession() {
  return (
    <button
      className="bg-white text-black px-4 py-2 rounded-md mt-4"
      onClick={() => signOut()}
    >
      Logout
    </button>
  );
}
