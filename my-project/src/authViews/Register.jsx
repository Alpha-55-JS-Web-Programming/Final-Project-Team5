import React from 'react';
import { Meta } from "../components/Meta/Meta";
import { Login } from "./Login";
import { NavLink } from 'react-router-dom';


export function Register() {
  return (
    <>
      <Meta title={'Register'} />

      {/* magnific-popup css */}
      <link href="./assets/libs/magnific-popup/magnific-popup.css" rel="stylesheet" type="text/css" />
      {/* owl.carousel css */}
      <link rel="stylesheet" href="./assets/libs/owl.carousel/assets/owl.carousel.min.css" />
      <link rel="stylesheet" href="./assets/libs/owl.carousel/assets/owl.theme.default.min.css" />
      <link rel="stylesheet" href="./assets/css/icons.css" />
      <link rel="stylesheet" href="./assets/css/tailwind.css" />

      <div className="w-full h-full">
        <div className="px-5 py-24 sm:px-24 lg:px-0">
          <div className="grid items-center justify-center grid-cols-1 lg:grid-cols-12 auth-bg">
            <div className="mx-5 lg:mx-20 lg:col-start-5 lg:col-span-4">
              <div className="text-center">
                {/* <a href="Index.jsx" className="block mb-10"> */}
                <NavLink to='/index' className="block mb-10"> Index{" "}</NavLink>
                  <img src="assets/images/logo-dark.png" alt="" className="block h-8 mx-auto dark:hidden" />
                  <img src="assets/images/logo-light.png" alt="" className="hidden h-8 mx-auto logo-light dark:block" />
                {/* </a> */}
                <h4 className="mb-2 text-gray-800 text-21 dark:text-gray-50"> Sign up </h4>
                <p className="mb-6 text-gray-500 dark:text-gray-300">
                  Get your Chatvia account now.
                </p>
              </div>
              <div className="bg-white card dark:bg-zinc-800 dark:border-transparent">
                <div className="p-5">
                  <div className="p-4">
                    <form action="Index.jsx">
                      <div className="mb-5">
                        <label className="font-medium text-gray-700 dark:text-gray-200"> Email </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600" id="basic-addon3">
                            <i className="ri-mail-line text-16" />
                          </span>
                          <input type="text" className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200" placeholder="Enter Email" aria-label="Enter Email" aria-describedby="basic-addon3" />
                        </div>
                      </div>
                      <div className="mb-5">
                        <label className="font-medium text-gray-700 dark:text-gray-200"> Username </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600" id="basic-addon3">
                            <i className="ri-user-2-line text-16" />
                          </span>
                          <input type="text" className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200" placeholder="Enter Username" aria-label="Enter Username" aria-describedby="basic-addon3" />
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="font-medium text-gray-700 dark:text-gray-200">
                          Password
                        </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600" id="basic-addon4">
                            <i className="ri-lock-2-line text-16" />
                          </span>
                          <input type="password" className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200" placeholder="Enter Password" aria-label="Enter Password" aria-describedby="basic-addon4" />
                        </div>
                      </div>
                      <div className="grid">
                        <button className="py-2 text-white border-transparent btn bg-violet-500 hover:bg-violet-600 text-16" type="submit">
                          Sign up
                        </button>
                      </div>
                      <div className="mt-5 text-center">
                        <p className="mb-0 text-gray-500 dark:text-gray-300">
                          By registering you agree to the Chatvia{" "}
                          <a href="#" className="text-violet-500"> Terms of Use </a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-10 text-center">
                <p className="mb-5 text-gray-700 dark:text-gray-200"> Don't have an account ?{" "}
                  <Login className="fw-medium text-violet-500"></Login>
                </p>
                <p className="text-gray-700 dark:text-gray-200"> © Chatvia. Crafted with{" "}
                  <i className="text-red-500 mdi mdi-heart" /> by Themesbrand
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
