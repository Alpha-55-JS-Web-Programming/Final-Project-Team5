import { Meta } from "../components/Meta/Meta";
import { Index } from "./Index";
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Login } from "./Login";


export function LockScreen() {
  return (
    <>
      <Meta title={'LockScreen'}></Meta>
      {/* magnific-popup css */}
      <link
        href="assets/libs/magnific-popup/magnific-popup.css"
        rel="stylesheet"
        type="text/css"
      />
      {/* owl.carousel css */}
      <link
        rel="stylesheet"
        href="assets/libs/owl.carousel/assets/owl.carousel.min.css"
      />
      <link
        rel="stylesheet"
        href="assets/libs/owl.carousel/assets/owl.theme.default.min.css"
      />
      <link rel="stylesheet" href="assets/css/icons.css" />
      <link rel="stylesheet" href="assets/css/tailwind.css" />

      <div className="w-full h-full">
        <div className="px-5 py-24 sm:px-24 lg:px-0">
          <div className="grid items-center justify-center grid-cols-1 lg:grid-cols-12 auth-bg">
            <div className="mx-5 lg:mx-20 lg:col-start-5 lg:col-span-4">
              <div className="text-center">
                {/* <a href="index.html" className="block mb-10"> */}
                <NavLink to="/index" className="block mb-10" >Index</NavLink>
                  <img
                    src="assets/images/logo-dark.png"
                    alt=""
                    className="block h-8 mx-auto dark:hidden"
                  />
                  <img
                    src="assets/images/logo-light.png"
                    alt=""
                    className="hidden h-8 mx-auto logo-light dark:block"
                  />
                {/* </a> */}
                <h4 className="mb-2 text-gray-800 text-21 dark:text-gray-50">
                  Lock screen
                </h4>
                <p className="mb-6 text-gray-500 dark:text-gray-300">
                  Enter your password to unlock the screen!
                </p>
              </div>
              <div className="bg-white card dark:bg-zinc-800 dark:border-transparent">
                <div className="p-5">
                  <div className="p-4">
                    <div className="mb-4 text-center user-thumb">
                      <img
                        src="assets/images/users/avatar-1.jpg"
                        className="w-24 h-24 mx-auto border-4 rounded-full border-gray-50 dark:border-zinc-600"
                        alt="thumbnail"
                      />
                      <h5 className="mt-3 text-base text-gray-700 dark:text-gray-200">
                        Patricia Smith
                      </h5>
                    </div>
                    <form action="index.html">
                      <div className="mb-5">
                        <label className="font-medium text-gray-700 dark:text-gray-200">
                          Password
                        </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span
                            className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600"
                            id="basic-addon3"
                          >
                            <i className="ri-lock-2-line text-16" />
                          </span>
                          <input
                            type="email"
                            className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200"
                            placeholder="Enter Password"
                            aria-label="Enter Password"
                            aria-describedby="basic-addon3"
                          />
                        </div>
                      </div>
                      <div className="grid">
                        <button
                          className="py-2 text-white border-transparent btn bg-violet-500 hover:bg-violet-600 text-16"
                          type="submit"
                        >
                          Unlock
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-10 text-center">
                <p className="mb-5 text-gray-700 dark:text-gray-200">
                  Not you ? return{" "}

                  <Login className="fw-medium text-violet-500"></Login>
                  {/* <a href="auth-login.html" className="fw-medium text-violet-500">
                    {" "}
                    Sign in{" "}
                  </a>{" "} */}
                  <NavLink to="/login" className="fw-medium text-violet-500" >Login</NavLink>
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  © ChatApp. Crafted{" "}
                  <i className="text-red-500 mdi mdi-heart" /> by Andrey, Zvezdy, Marty
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <script src="assets/libs/jquery/jquery.min.js"></script>
      <script src="assets/libs/@popperjs/core/umd/popper.min.js"></script>
      <script src="assets/libs/simplebar/simplebar.min.js"></script>
    </>

  );
}