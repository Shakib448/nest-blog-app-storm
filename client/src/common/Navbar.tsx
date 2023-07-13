"use client";
import React from "react";
import Link from "next/link";
import { signOut } from "@/hooks/signOut";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 fixed top-0 px-4 shadow-md">
      <div className="flex-1">
        <Link href="/">
          <span className="btn btn-ghost normal-case text-xl">Blog Storm</span>
        </Link>
      </div>
      <div className="flex-none gap-2">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Posts</Link>
          </li>
          <li>
            <Link href="/create-post">Create Post</Link>
          </li>
          <li>
            <Link href="/sign-in">Sign In</Link>
          </li>
          <li>
            <Link href="/sign-up">Sign Up</Link>
          </li>
        </ul>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <a onClick={() => signOut({ callbackUrl: "/sign-in" })}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
