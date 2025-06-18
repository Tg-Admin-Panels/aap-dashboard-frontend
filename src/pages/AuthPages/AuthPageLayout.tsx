import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-[var(--aap-bg-color)] text-[var(--aap-text-color)] z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}

        {/* Right Side with Logo and Info */}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-[var(--aap-bg-color)] dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs text-center">
              {/* Title */}
              <div className="text-4xl font-bold text-[var(--aap-primary-color)] mb-2 whitespace-nowrap">
                Aam Aadmi Party Bihar
              </div>

              {/* Subtitle */}
              <p className="text-base text-[var(--aap-text-color)] opacity-90">
                Empowering Bihar through honest politics
              </p>

              {/* Optional Image (If needed again later) */}
              {/* <Link to="/" className="block my-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.svg"
                  alt="Logo"
                />
              </Link> */}
            </div>
          </div>
        </div>

        {/* Floating Theme Switcher */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
