import { NavLink } from "react-router-dom"
import { Meta } from "../components/Meta/Meta"
import { Index } from "./Index"


export function Login() {
  return (
    <>
      <Meta title={'Login'}></Meta>
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
                <img src="assets/images/logo-dark.png" alt="" className="block h-8 mx-auto dark:hidden"/>
                  <img src="assets/images/logo-light.png" alt="" className="hidden h-8 mx-auto logo-light dark:block"/>
                {/* </a> */}
                <h4 className="mb-2 text-gray-800 text-21 dark:text-gray-50">
                  Sign in
                </h4>
                <p className="mb-6 text-gray-500 dark:text-gray-300">
                  Sign in to continue to Chatvia.
                </p>
              </div>
              <div className="bg-white card dark:bg-zinc-800 dark:border-transparent">
                <div className="p-5">
                  <div className="p-4">
                    <form action="index.html">
                      <div className="mb-5">
                        <label className="font-medium text-gray-700 dark:text-gray-200">
                          Username
                        </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span
                            className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600"
                            id="basic-addon3"
                          >
                            <i className="ri-user-2-line text-16" />
                          </span>
                          <input
                            type="text"
                            className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200"
                            placeholder="Enter Username"
                            aria-label="Enter Username"
                            aria-describedby="basic-addon3"
                          />
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="float-right">
                          <a
                            href="auth-recoverpw.html"
                            className="text-gray-500 text-13 "
                          >
                            Forgot password?
                          </a>
                        </div>
                        <label className="font-medium text-gray-700 dark:text-gray-200">
                          Password
                        </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span
                            className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600"
                            id="basic-addon4"
                          >
                            <i className="ri-lock-2-line text-16" />
                          </span>
                          <input
                            type="password"
                            className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200"
                            placeholder="Enter Password"
                            aria-label="Enter Password"
                            aria-describedby="basic-addon4"
                          />
                        </div>
                      </div>
                      <div className="flex items-center mb-6">
                        <input
                          type="checkbox"
                          className="border-gray-100 rounded focus:ring-1 checked:ring-1 focus:ring-offset-0 focus:outline-0 checked:bg-violet-500 dark:bg-zinc-600 dark:border-zinc-600 dark:checked:bg-violet-500 "
                          id="memberCheck1"
                        />
                        <label
                          className="font-medium text-gray-700 ltr:ml-2 rtl:mr-2 dark:text-gray-200"
                          htmlFor="remember-check"
                        >
                          Remember me
                        </label>
                      </div>
                      <div className="grid">
                        <button
                          className="py-2 text-white border-transparent btn bg-violet-500 hover:bg-violet-600 text-16"
                          type="submit"
                        >
                          Sign in
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-10 text-center">
                <p className="mb-5 text-gray-700 dark:text-gray-200">
                  Don't have an account ?{" "}
                  <a
                    href="auth-register.html"
                    className="fw-medium text-violet-500"
                  >
                    {" "}
                    Signup now{" "}
                  </a>{" "}
                </p>
                <p className="text-gray-700 dark:text-gray-200">
                  © Chatvia. Crafted with{" "}
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

  )
}
