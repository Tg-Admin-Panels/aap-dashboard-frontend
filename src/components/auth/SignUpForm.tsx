import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar"
      style={{ backgroundColor: "var(--aap-bg-color)", color: "var(--aap-text-color)" }}
    >
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-300 transition-colors hover:text-white"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-xl sm:text-2xl">
              Sign Up
            </h1>
            <p className="text-sm text-gray-300">
              Enter your email and password to sign up!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
            {/* Google Button */}
            <button
              className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal rounded-lg px-7 transition-colors w-full"
              style={{
                backgroundColor: "var(--aap-secondary-color)",
                color: "var(--aap-text-color)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M19.8052 10.2307C19.8052 9.55307 19.7494 8.93977 19.6469 8.33301H10.2002V11.9106H15.646C15.4052 13.2392 14.6455 14.3726 13.5289 15.1123V17.3725H16.5993C18.4451 15.6619 19.8052 13.1808 19.8052 10.2307Z"
                  fill="#4285F4"
                />
                <path
                  d="M10.2002 20.0003C12.897 20.0003 15.1603 19.1236 16.5993 17.3727L13.5289 15.1125C12.7645 15.623 11.6707 15.9465 10.2002 15.9465C7.59159 15.9465 5.37625 14.2157 4.61088 11.897H1.4353V14.2272C2.86773 17.4109 6.27158 20.0003 10.2002 20.0003Z"
                  fill="#34A853"
                />
                <path
                  d="M4.61098 11.897C4.22541 10.7684 4.22541 9.56417 4.61098 8.43552V6.10535H1.4354C0.26474 8.44692 0.26474 11.8857 1.4354 14.2273L4.61098 11.897Z"
                  fill="#FBBC05"
                />
                <path
                  d="M10.2002 3.95788C11.7589 3.93395 13.2607 4.52513 14.3851 5.60774L16.6713 3.32156C14.9948 1.72297 12.6379 0.841647 10.2002 0.866262C6.27158 0.866262 2.86773 3.4556 1.4353 6.63934L4.61088 8.96951C5.37625 6.65083 7.59159 3.95788 10.2002 3.95788Z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>

            {/* Twitter (X) Button */}
            <button
              className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal rounded-lg px-7 transition-colors w-full"
              style={{
                backgroundColor: "var(--aap-secondary-color)",
                color: "var(--aap-text-color)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M20.263 3H23.338L16.484 10.293L24 21H17.594L12.69 14.43L6.997 21H3.92L11.26 13.172L4 3H10.594L15.03 9.047L20.263 3ZM19.111 19H20.953L8.982 4.844H6.997L19.111 19Z"
                  fill="white"
                />
              </svg>
              Sign up with X
            </button>
          </div>

          <div className="relative py-3 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="p-2 bg-transparent text-gray-300 sm:px-5 sm:py-2">
                Or
              </span>
            </div>
          </div>

          <form>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label>
                    First Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="fname"
                    name="fname"
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label>
                    Last Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="lname"
                    name="lname"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label>
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label>
                  Password<span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-300 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-300 size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="text-sm text-gray-300">
                  By creating an account, you agree to the{" "}
                  <span className="text-white underline cursor-pointer">
                    Terms and Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-white underline cursor-pointer">
                    Privacy Policy
                  </span>
                </p>
              </div>

              <div>
                <button
                  className="w-full px-4 py-3 text-sm font-medium rounded-lg shadow-md"
                  style={{
                    background: "var(--aap-button-bg)",
                    color: "var(--aap-button-text)",
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>

          <div className="mt-5 text-sm text-center text-gray-300">
            Already have an account?{" "}
            <Link to="/signin" className="text-yellow-400 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
