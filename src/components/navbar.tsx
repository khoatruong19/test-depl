/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Logo from "../assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import NavItem from "./navitem";

interface IProps {
  toggleLanguage: () => void;
}

const Navbar = ({ toggleLanguage }: IProps) => {
  const user = useUser();
  console.log({user})
  const router = useRouter();
  const { t } = useTranslation("common");
  return (
    <div className="flex h-24 items-center justify-between">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div className="img-container h-14 w-14 rounded-md">
            <Image alt="logo" src={Logo} />
          </div>
          <span className="text-3xl font-semibold">Cooking Recipe</span>
        </div>
        {user.isSignedIn && (
          <div className="flex items-center gap-3">
            <NavItem path="/my-recipes" text={t("myRecipes") ?? ""} />
            <NavItem path="/create-recipe" text={t("createRecipe") ?? ""} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user.isSignedIn && (
          <div className="text-xl font-medium">
            {t("hello")},{" "}
            <span className="font-extrabold text-primaryColor">
              {user.user.fullName} !
            </span>
          </div>
        )}
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
  );
};

export default Navbar;
