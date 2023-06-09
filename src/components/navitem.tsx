import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

interface IProps {
    path: string
    text: string
}

const NavItem = ({path,text}: IProps) => {
  const router = useRouter()

  return (
    <Link href={path}>
      <span className={`${router.pathname.includes(path) ? 'bg-orange-600 text-white font-semibold' : ''} rounded-md lg:border border-primaryColor px-3 py-2 text-2xl 
      font-medium text-primaryColor hover:bg-orange-400 hover:text-white lg:text-xl`}>
        {text}
      </span>
    </Link>
  );
};

export default NavItem;
