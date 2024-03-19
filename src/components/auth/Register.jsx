import React, { useContext, useState } from 'react';
import { Meta } from '../Meta.jsx';
import { NavLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../../service/auth.service.js';
import { createUserProfile } from '../../service/users.service.js';
import { AppContext } from '../../AppContext.jsx';
import { format } from 'date-fns';

export function Register() {
  const { setUser } = useContext(AppContext);
  const [form, setForm] = useState({
    uid: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    image: '',
    status: '',
    friendsRequests: '',
    friendsList: '',
    location: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const updateForm = (prop) => (e) => {
    setForm({ ...form, [prop]: e.target.value });
  };

  function validateDetails(phoneNumber) {
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      setErrorMessage('Phone number must be of 10 digits');
      return false;
    }
    return true;
  };

  const register = async (event) => {
    event.preventDefault();

    if (form.username.trim() === '') {
      setErrorMessage('Username cannot be empty');
      return;
    }

    if (form.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(form.email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }

      if (form.password !== form.confirmPassword) {
        setErrorMessage('Password and Confirm Password do not match');
        return;
      }

      if (!validateDetails(form.phoneNumber)) {
        setErrorMessage('Phone Number number must be of 10 digits');
        return;
      }

      const credentials = await registerUser(form.email, form.password);
      const readableDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      await createUserProfile(
        credentials.user.uid,
        form.username,
        form.email,
        form.phoneNumber,
        form.password,
        form.role,
        form.image,
        form.status,
        readableDate,
        [],
      );
      setUser(credentials.user);
      navigate('/login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already in use.');
      } else {
        setErrorMessage('An error occurred during registration. Please try again.');
      }
      console.log(error.message);
    }
  };

  return (
    <>
      <Meta title={'Register'} />
      <div className="w-full h-full">
        <div className="px-5 py-24 sm:px-24 lg:px-0">
          <div className="grid items-center justify-center grid-cols-1 lg:grid-cols-12 auth-bg">
            <div className="mx-5 lg:mx-20 lg:col-start-5 lg:col-span-4">
              <div className="text-center">
                <NavLink to="/register" className="block mb-10">
                  <img src="/assets/images/logo-dark.png" alt="" className="block h-8 mx-auto dark:hidden" />
                  <img src="/assets/images/logo-light.png" alt="" className="hidden h-8 mx-auto logo-light dark:block" />
                </NavLink>
                <h4 className="mb-2 text-gray-800 text-21 dark:text-gray-50"> Register </h4>
                <p className="mb-6 text-gray-500 dark:text-gray-300"> Get your ChatApp account now. </p>
              </div>
              <div className="bg-white card dark:bg-zinc-800 dark:border-transparent">
                <div className="p-5">
                  <div className="p-4">
                    <form action="/">
                      {errorMessage && (
                        <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                          <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                          </svg>
                          <div>
                            {errorMessage}
                          </div>
                        </div>
                      )}
                      {/* Email */}
                      <div className="mb-5">
                        <label className="font-medium text-gray-700 dark:text-gray-200"> Email </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600" id="basic-addon3">
                            <i className="ri-mail-line text-16" />
                          </span>
                          <input value={form.email} onChange={updateForm("email")} type="text" className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200" placeholder="Enter Email" aria-label="Enter Email" aria-describedby="basic-addon3" />
                        </div>
                      </div>

                      {/* Username */}
                      <div className="mb-5">
                        <label className="font-medium text-gray-700 dark:text-gray-200"> Username </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600" id="basic-addon3">
                            <i className="ri-user-2-line text-16" />
                          </span>
                          <input value={form.username} onChange={updateForm("username")} type="text" className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200" placeholder="Enter Username" aria-label="Enter Username" aria-describedby="basic-addon3" />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="mb-6">
                        <label className="font-medium text-gray-700 dark:text-gray-200"> Password </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600" id="basic-addon4">
                            <i className="ri-lock-2-line text-16" />
                          </span>
                          <input value={form.password} onChange={updateForm("password")} type="password" className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200" placeholder="Enter Password" aria-label="Enter Password" aria-describedby="basic-addon4" />
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="mb-6">
                        <label className="font-medium text-gray-700 dark:text-gray-200"> Confirm password </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600" id="basic-addon4">
                            <i className="ri-lock-2-line text-16" />
                          </span>
                          <input value={form.confirmPassword} onChange={updateForm("confirmPassword")} type="password" className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200" placeholder="Confirm password" aria-label="Confirm password" aria-describedby="basic-addon4" />
                        </div>
                      </div>

                      {/* Phone number */}
                      <div className="mb-6">
                        <label className="font-medium text-gray-700 dark:text-gray-200"> Phone number </label>
                        <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                          <span className="flex items-center px-4 py-2 text-gray-500 border border-r-0 border-gray-100 rounded rounded-r-none dark:border-zinc-600" id="basic-addon4">
                            <i className="ri-phone-line text-16" />
                          </span>
                          <input value={form.phoneNumber} onChange={updateForm("phoneNumber")} type="number" className="w-full border-gray-100 rounded rounded-l-none placeholder:text-14 bg-slate-50/50 text-14 focus:ring-0 dark:bg-zinc-700 dark:border-zinc-600 dark:text-gray-200" placeholder="Enter Phone Number" aria-label="phone number" aria-describedby="basic-addon4" />
                        </div>
                      </div>

                      {/* Register up button */}
                      <div className="grid">
                        <button onClick={register} className="py-2 text-white border-transparent btn bg-violet-500 hover:bg-violet-600 text-16">
                          Register
                        </button>
                      </div>
                      <div className="mt-5 text-center">
                        <p className="mb-0 text-gray-500 dark:text-gray-300">
                          By registering you agree to the ZAMO Chat App{" "}
                          <a href="#" className="text-violet-500"> Terms of Use </a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-10 text-center">
                <p className="mb-5 text-gray-700 dark:text-gray-200"> Have an account ?{" "}
                  <NavLink to='/login' className="fw-medium text-violet-500 "> Login {" "}</NavLink>
                </p>
                <p className="text-gray-700 dark:text-gray-200"> © ChatApp. Crafted{" "}
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
