import React from 'react';
import { Meta } from "../Meta";
import { NavLink } from 'react-router-dom';

export function RecoverPassword() {
  return (
    <>
      <Meta title={'RecoverPassword'} />

      <div className="w-full h-full">
        <div className="px-5 py-24 sm:px-24 lg:px-0">
          <div className="grid items-center justify-center grid-cols-1 lg:grid-cols-12 auth-bg">
            <div className="mx-5 lg:mx-20 lg:col-start-5 lg:col-span-4">
              <div className="text-center">
                <NavLink to='/' className="block mb-10">

                  <img src="/assets/images/logo-dark.png" alt="" className="block h-8 mx-auto dark:hidden" />
                  <img src="/assets/images/logo-light.png" alt="" className="hidden h-8 mx-auto logo-light dark:block" />
                </NavLink>
                <h4 className="mb-2 text-gray-800 text-21 dark:text-gray-50"> Reset Password </h4>
                <p className="mb-6 text-gray-500 dark:text-gray-300"> Reset Password With ZAMO Chat App. </p>
              </div>
              <div className="bg-white card dark:bg-zinc-800 dark:border-transparent">
                <div className="p-5">
                  <div className="p-4">
                    <div className="px-8 py-5 mb-4 text-center text-green-800 border rounded border-green-500/30 bg-green-500/20 dark:text-green-400" role="alert">
                      Enter your Email and instructions will be sent to you!
                    </div>
                    <form action="/">
                      <div className="mb-5">
                        <label className="font-medium text-gray-700 dark:text-gray-200"> Email </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600" id="basic-addon3" >
                            <i className="ri-mail-line text-16" />
                          </span>
                          <input type="text" className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200" placeholder="Enter Email" aria-label="Enter Email" aria-describedby="basic-addon3" />
                        </div>
                      </div>
                      <div className="grid">
                        <button className="py-2 text-white border-transparent btn bg-violet-500 hover:bg-violet-600 text-16" type="submit" >
                          Reset
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-10 text-center">
                <p className="mb-5 text-gray-700 dark:text-gray-200">Remember It ?{" "}
                  <NavLink to='/register' className="fw-medium text-violet-500"> Login {" "}</NavLink>
                </p>
                <p className="text-gray-700 dark:text-gray-200">© ChatApp. Crafted {" "}
                  <i className="text-red-500 mdi mdi-heart" /> by Andy, Zvezdy, Marty
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
