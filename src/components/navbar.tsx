/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Logo from "../assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import NavItem from "./navitem";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

interface IProps {
  toggleLanguage: () => void;
}

const Navbar = ({ toggleLanguage }: IProps) => {
  const user = useUser();
  const router = useRouter();
  const { t } = useTranslation("common");

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="relative flex h-24 items-center">
      <div onClick={() => setOpenMenu(prev => !prev)} className={`z-[999999] ${openMenu ? "fixed right-[5px]" : "absolute right-0"} top-7.5  lg:hidden`}>
          {openMenu ? 
          <XMarkIcon className="h-10 w-10"/>
        : <Bars3Icon className="h-10 w-10"/>  
        }
      </div>
      <div className="flex items-center gap-10">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => router.push("/")}
        >
          <div className="img-container h-14 w-14 rounded-md">
            <Image alt="logo" src={Logo} />
          </div>
          <span className="text-[26px] md:text-3xl font-semibold">Cooking Recipe</span>
        </div>
      </div>
      <div
        className={`ml-5 ${
          openMenu
            ? "fixed shadow-xl right-0 top-0 z-[99999] h-[100vh] w-[280px] md:min-w-[300px] flex-col-reverse bg-gray-200 px-4 md:px-8 py-10 lg:bg-transparent lg:px-0 lg:py-0"
            : "hidden lg:flex lg:flex-row shadow-none"
        }
       flex flex-1 items-center justify-end lg:relative lg:justify-between`}
       onClick={() => setOpenMenu(false)}
      >
        {user.isSignedIn && (
          <div className="flex flex-col items-center gap-7 lg:gap-3 lg:flex-row mt-10 lg:mt-0">
            <NavItem path="/my-recipes" text={t("myRecipes") ?? ""} />
            <NavItem path="/create-recipe" text={t("createRecipe") ?? ""} />
          </div>
        )}
        <div className="flex flex-col items-center gap-4 lg:flex-row mt-10 lg:mt-0 lg:ml-auto">
         
          {user.isSignedIn && (
            <div className="text-xl font-medium">
              {t("hello")},{" "}
              <span className="font-extrabold text-primaryColor">
                {user.user.fullName} !
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 flex-1">
            {!user.isSignedIn ? (
              <SignInButton>
                <span className="button-container">{t("signIn")}</span>
              </SignInButton>
            ) : (
              <SignOutButton>
                <span className="button-container">{t("signOut")}</span>
              </SignOutButton>
            )}
            <button
              onClick={toggleLanguage}
              className="w-[43px] rounded-md bg-secondaryColor py-2 font-bold text-white hover:text-primaryColor"
            >
              {router.locale === "en" ? "VI" : "EN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
