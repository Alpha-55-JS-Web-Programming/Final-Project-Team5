import { NavLink } from "react-router-dom";
import { logoutUser } from "../../service/auth.service";
import { AppContext } from "../../appContext/AppContext";
import { useContext, useState } from "react";

export function SidebarMenu() {
    const { user, setContext } = useContext(AppContext);
    // const [photo, setPhoto] = useState(null);
    // const [loading, setLoading] = useState(false);
    const [photoURL] = useState(user?.photoURL);
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    // const toggleDarkMode = () => {
    //     setIsDarkMode(!isDarkMode);
    //   };

    // const darkModeClass = isDarkMode ? 'dark-mode' : '';

    const logout = async () => {
      try {
        await logoutUser();
        setContext({ user: null, userData: null });
        console.log('User logged out successfully.');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    return (
        <div className="sidebar-menu w-full lg:w-[75px] shadow lg:flex lg:flex-col flex flex-row justify-between items-center fixed lg:relative z-40 bottom-0 bg-white dark:bg-zinc-600 ">
            <div className="hidden lg:my-5 lg:block">
                <NavLink to="../index/index.jsx" className="block dark:hidden">
                    <span>
                        {/* <img src="../../../public/assets/images/logo.svg" alt="" className="h-[30px]" /> */}
                    </span>
                </NavLink>

                <NavLink to="../index/index.jsx" className="hidden dark:block">
                    <span>
                        {/* <img src="../../../public/assets/images/logo.svg" alt="" className="h-[30px]" /> */}
                    </span>
                </NavLink>
            </div>
            {/* <!-- end navbar-brand-box --> */}


            {/* <!-- Start side-menu nav --> */}
            {/* <!-- Tabs --> */}
            <div className="w-full mx-auto lg:my-auto">
                <ul id="tabs" className="flex flex-row justify-center w-full lg:flex-col lg:flex nav-tabs">

                    {/*profile*/}
                    <li className="flex-grow lg:flex-grow-0">
                        <NavLink to="/profile" id="default-tab" className="tab-button flex relative items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg">
                            <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                                <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Profile</span>
                            </div>
                            <i className="text-2xl ri-user-2-line"></i>
                        </NavLink>
                    </li>

                    {/*chats*/}
                    <li className="flex-grow lg:flex-grow-0">
                        <NavLink to="/chats" className="tab-button active relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg">
                            <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                                <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Chats</span>
                            </div>
                            <i className="text-2xl ri-message-3-line"></i>
                        </NavLink>
                    </li>

                    {/*groups*/}
                    <li className="flex-grow lg:flex-grow-0">
                        <NavLink to="/groups" className="tab-button relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg">
                            <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                                <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Groups</span>
                            </div>
                            <i className="text-2xl ri-group-line"></i>
                        </NavLink>
                    </li>

                    {/*contacts*/}
                    <li className="flex-grow lg:flex-grow-0">
                        <NavLink to="/contacts" className="tab-button relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg">
                            <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                                <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Contacts</span>
                            </div>
                            <i className="text-2xl ri-contacts-line"></i>
                        </NavLink>
                    </li>

                    {/*settings*/}
                    <li className="flex-grow lg:flex-grow-0">
                        <NavLink to="/settings" className="tab-button relative flex items-center justify-center mx-auto h-14 w-14 leading-[14px] group/tab my-2 rounded-lg">
                            <div className="absolute items-center hidden -top-10 ltr:left-0 group-hover/tab:flex rtl:right-0">
                                <div className="absolute -bottom-1 left-[40%] w-3 h-3 rotate-45 bg-black"></div>
                                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-black rounded shadow-lg">Settings</span>
                            </div>
                            <i className="text-2xl ri-settings-2-line"></i>
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* <!-- Start side-menu footer --> */}
            <div className="w-20 my-5 lg:w-auto">
                <ul className="lg:block">

                    {/*dark mode need to change attribute(a)*/} 
                    <li className="hidden text-center light-dark-mode nav-item lg:block">
                        <a href="#" className="hidden dark:block dark:text-violet-100/80">
                            <i className="text-2xl ri-sun-line "></i>
                        </a>
                        <a href="#" className="block text-gray-500 dark:hidden">
                            <i className="text-2xl ri-moon-clear-line"></i>
                        </a>
                    </li>


                    {/*profile picture need to fix the "to="#""" */}

                    <li className="relative lg:mt-4 dropdown lg:dropup">
                     <NavLink  href="#" className="dropdown-toggle" id="dropdownButton2" data-bs-toggle="dropdown">
                       <img src={photoURL} alt="Avatar" className="w-10 h-10 p-1 mx-auto rounded-full bg-gray-50 dark:bg-zinc-700"/>
                     </NavLink>

                        {/* Dropdown */}  
                        <ul className="absolute bottom-5 z-40 float-left w-40 py-2 mx-4 mb-12 text-left list-none bg-white border-none rounded-lg shadow-lg dropdown-menu bg-clip-padding dark:bg-zinc-700" aria-labelledby="dropdownButton2">
                            
                            {/* Profile */}  
                            <li>
                              <NavLink to="/profile" className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50">
                                Profile
                                <i className="text-gray-500 rtl:float-left ltr:float-right ri-profile-line text-16"></i>
                              </NavLink>
                            </li>

                            {/* Setting */}  
                            <li>
                                <NavLink to="/setting" className=" block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50 ltr:text-left rtl:text-right">
                                    Setting
                                    <i className="text-gray-500 rtl:float-left ltr:float-right ri-settings-3-line text-16"></i>
                                </NavLink>
                            </li>

                            {/* Lock Screen */}    
                            <li>
                                <NavLink to="/lock-screen " className=" block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50 ltr:text-left rtl:text-right">
                                    Lock Screen 
                                    <i className="text-gray-500 rtl:float-left ltr:float-right ri-git-repository-private-line text-16"></i>
                                </NavLink>
                            </li>

                            <li className="my-2 border-b border-gray-100/20"></li>

                            {/* Log out */}
                            <li>
                              <NavLink to="/login" className="block w-full px-4 py-2 text-sm font-normal text-gray-700 bg-transparent dropdown-item whitespace-nowrap hover:bg-gray-100/30 dark:text-gray-100 dark:hover:bg-zinc-600/50 ltr:text-left rtl:text-right">
                                <button onClick={logout}>Log out</button>
                                <i className="text-gray-500 rtl:float-left ltr:float-right ri-logout-circle-r-line text-16"></i>
                              </NavLink>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>    
        </div>   
    );
}