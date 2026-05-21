import React, { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import {
  logoutUser,
  uploadBackgroundPhoto,
  uploadProfileImage,
  uploadPictureURL
} from "../service/auth.service";
import { updateUserData } from "../service/users.service";
import { useNavigate } from "react-router-dom";

export function ProfileDialog({ onClose }) {
  const { user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [open, setOpen] = useState(false);
  const [openStatusDropdown, setOpenStatusDropdown] = useState(false);

  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [editProfilePhotoURL, setEditProfilePhotoURL] = useState(false);

  const [editedUsername, setEditedUsername] = useState(
    user ? user.username : ""
  );
  const [editedEmail, setEditedEmail] = useState(user ? user.email : "");
  const [editedLocation, setEditedLocation] = useState(
    user ? user.location : ""
  );

  const [localStatus, setLocalStatus] = useState(
    user ? user.status : "Loading..."
  );

  const [editedProfilePhotoURL, setEditedProfilePhotoURL] = useState('');
  const navigate = useNavigate();
  const toggleDropdown = (dropdownSetter) => {
    dropdownSetter((prevState) => !prevState);
  };

  async function handleUploadPhoto() {
    if (!editedProfilePhotoURL.trim()) return;
    const url = editedProfilePhotoURL;
    if (url) {
      try {
        await uploadPictureURL(url, user, setLoading)
        setUser({ ...user, profilePhotoURL: url });
        setEditProfilePhotoURL(false);
        setEditedProfilePhotoURL("");
      } catch (e) {
        console.error("Error uploading profile image:", e);
      }
    }
  }

  async function handleBackgroundPhoto(e) {
    if (!user) return;
    const photo = e.target.files[0];
    if (photo) {
      try {
        const profileBackgroundURL = await uploadBackgroundPhoto(
          photo,
          user,
          setLoading2
        );
        await updateUserData(user?.uid, { profileBackgroundURL });
        setUser({ ...user, profileBackgroundURL });
      } catch (e) {
        console.error("Error uploading background image:", e);
      }
    }
  }

  const handleUsernameUpdate = async () => {
    try {
      await updateUserData(user?.uid, { username: editedUsername });
      setEditUsername(false);
      setUser({ ...user, username: editedUsername });
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const handleEmailUpdate = async () => {
    try {
      await updateUserData(user?.uid, { email: editedEmail });
      setEditEmail(false);
      setUser({ ...user, email: editedEmail });
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const handleLocationUpdate = async () => {
    try {
      await updateUserData(user?.uid, { location: editedLocation });
      setEditLocation(false);
      setUser({ ...user, location: editedLocation });
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      setLocalStatus(status);
      await updateUserData(user.uid, { status });
      setOpenStatusDropdown(false);
      setUser({ ...user, status });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      await currentUser.delete();
      await firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid)
        .delete();
      await firebase.database().ref("users").child(currentUser.uid).remove();
      await firebase.auth().signOut();
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      console.log("User logged out successfully.");
      alert("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full top-0 left-0 absolute z-50 backdrop-blur-sm bg-black/20 l:pt-40 xl:pt-0 m:pt-40">
      <div className="relative bg-white min-w-full min-h-full lg:min-w-[800px] lg:min-h-[600px] lg:rounded-lg lg:shadow-lg dark:bg-gray-800">
        {/* exit button */}
        <button
          type="button"
          className="z-50 absolute top-10 left-7 xl:text-4xl lg:text-3xl base:text-2xl sm:text-2xl"
          onClick={onClose}
        >
          <svg
            className="w-7 h-7 xl:w-10 xl:h-10 lg:w-9 lg:h-9 sm:w-8 sm:h-8 xs:w-7 xs:h-7 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m15 19-7-7 7-7"
            />
          </svg>
        </button>

        <div className="bg-cover bg-center relative dark:bg-gray-800">
          <img
            src={
              user?.profileBackgroundURL ||
              "https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            }
            className="w-full h-80 object-cover absolute rounded-t-lg"
            alt="background"
          />
          {/* Add Background Img */}
          <div className="absolute right-28 top-60 ">
            <label
              htmlFor="background-img-file"
              className="relative cursor-pointer"
            >
              <input
                type="file"
                onChange={() => { alert("This feature is currently unavailable.") }}
                id="background-img-file"
                name="backgroundFile"
                className="hidden"
              />
              <span className="absolute inset-0 flex items-center justify-center w-12 h-12 bg-white rounded-full dark:bg-zinc-800 dark:text-gray-100 hover:bg-gray-300 transition duration-300">
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                  />
                </svg>
              </span>
            </label>
          </div>

          {/* Drop Down for Delete Profile */}
          <div className="px-6 pt-6">
            <div className="ltr:float-right rtl:float-left">
              <div className={`relative flex-shrink-0 dropdown `}>
                <button
                  onClick={() => toggleDropdown(setOpen)}
                  className="mr-10 mt-5 text-white"
                  data-bs-toggle="dropdown"
                  id="dropdownMenuButtonA"
                >
                  <i className="text-3xl ri-more-2-fill" />
                </button>
                <ul
                  className={`${
                    open ? "visible" : "invisible"
                    } absolute z-50 block w-40 text-left list-none bg-red-700 border border-transparent rounded shadow-lg rtl:right-auto rtl:left-0 ltr:left-auto ltr:right-0 my-7 bg-clip-padding dark:bg-zinc-700 dark:shadow-sm dark:border-zinc-600`}
                  aria-labelledby="dropdownMenuButtonA"
                >
                  <li>
                    <button
                      onClick={logout}
                      className="block w-full px-4 py-2 text-sm font-normal text-white bg-transparent dropdown-item whitespace-nowrap hover:bg-red-800 dark:text-black-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right"
                      type="button"
                    >
                      Log out
                      <i className="text-gray-500 rtl:float-left ltr:float-right ri-logout-circle-r-line  text-16"></i>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleDeleteAccount}
                      className="block w-full px-4 py-2 text-sm font-normal text-white bg-transparent dropdown-item whitespace-nowrap hover:bg-red-800 dark:text-black-100 dark:hover:bg-zinc-600 ltr:text-left rtl:text-right"
                      type="button"
                    >
                      Delete your account
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Title */}
            <div className="relative">
              <p className="left-14 top-3.5 font-semibold text-center text-white absolute xl:text-4xl lg:text-3xl base:text-2xl sm:text-2xl xs:text-2xl">
                {" "}
                My Profile{" "}
              </p>
            </div>
          </div>

          {/* Profile picture */}
          <div className="p-6 text-center">
            <div className="mb-4 relative flex flex-col items-start justify-end top-24">
              <label
                disabled={loading}
                onClick={() => setEditProfilePhotoURL(true)}
                className="left-40 absolute bottom-6 pt-2 ri-pencil-fill w-10 h-10 bg-gray-100 rounded-full dark:bg-zinc-800 dark:text-gray-100 cursor-pointer hover:bg-gray-200"
              />
              <img
                src={
                  user?.profilePhotoURL ||
                  "https://thinksport.com.au/wp-content/uploads/2020/01/avatar-.jpg"
                }
                className="sm:w-12 sm:h-12 md:w-52 md:h-52 lg:w-56 lg:h-56 xl:w-60 xl:h-60 2xl:w-64 2xl:h-64 p-1 border border-gray-100 rounded-full dark:border-zinc-800"
                alt="Avatar"
              />
            </div>
          </div>

          {/* edit profile picture */}
          {editProfilePhotoURL && (
            <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm bg-black/30">

              <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg w-[300px]">

                <input
                  value={editedProfilePhotoURL}
                  onChange={(e) => setEditedProfilePhotoURL(e.target.value)}
                  type="text"
                  placeholder="Paste image URL..."
                  className="w-full p-2 mb-3 border rounded border-gray-200 dark:border-zinc-600"
                />

                <div className="flex justify-end gap-2">

                  <button
                    onClick={() => {
                      setEditProfilePhotoURL(false);
                      setEditedProfilePhotoURL("");
                    }}
                    className="px-3 py-1 rounded bg-gray-200 dark:bg-zinc-700"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleUploadPhoto}
                    className="px-3 py-1 rounded bg-blue-500 text-white"
                  >
                    Save
                  </button>

                </div>
              </div>
            </div>
          )}

        </div>
        {/* End profile Header */}

        {/* Username and Status*/}
        <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-lg w-100 h-auto mt-20 ml-5 mr-5 mb-5">
          <h5 className="mb-1 text-lg font-semibold text-black-700 dark:text-gray-50 border-b-2 ">
            About
          </h5>

          {/* Dropdown menu for status*/}
          <div className="relative mb-1 flex mt-2 dark:bg-gray-800">
            <div className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-50 mt-1">
              Status:{" "}
            </div>

            <div className="relative ml-2 dark:bg-gray-800">
              <button
                onClick={() => toggleDropdown(setOpenStatusDropdown)}
                className=" flex items-center justify-between px-4 py-2 text-sm font-medium bg-gray-50 dark:text-white dark:bg-gray-500 rounded-md focus:outline-none focus:bg-gray-200 dark:focus:bg-gray-600 transition duration-300 ease-in-out"
              >
                <span className="flex items-center">
                  <span
                    className={`text-${
                      localStatus === "Online" ? "green" : "red"
                      }-500 mr-2`}
                  >
                    <i className={`ri-record-circle-fill text-10`} />
                  </span>
                  {localStatus}
                </span>
                <i
                  className={`mdi mdi-chevron-down ${
                    openStatusDropdown ? "transform rotate-180" : ""
                    } text-gray-400`}
                />
              </button>
              <div
                className={`${
                  openStatusDropdown ? "" : "hidden"
                  } absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 shadow-lg rounded-md`}
              >
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => handleStatusChange("Online")}
                      className="dark:bg-gray-800 block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                    >
                      <i className="text-green-500 ri-record-circle-fill text-10 mr-2" />
                      Online
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleStatusChange("Busy")}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                    >
                      <i className="text-orange-500 ri-error-warning-fill text-10 mr-2" />
                      Busy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleStatusChange("Away")}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                    >
                      <i className="text-yellow-500 ri-time-fill text-10 mr-2" />
                      Away
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleStatusChange("Offline")}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                    >
                      <i className="text-red-500 ri-record-circle-fill text-10 mr-2" />
                      Offline
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Username*/}
          <div className="pt-3">
            <div>
              <div>
                <div className="mb-2 flex items-center">
                  <span className="inline-block w-3 h-6 mr-2">
                    <i className="ri-user-fill text-gray-500 dark:text-gray-400"></i>
                  </span>
                  <p className="text-gray-500 dark:text-gray-300">Username</p>
                </div>
                {editUsername ? (
                  <>
                    <input
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      type="text"
                      className="w-full p-2 mb-2 border rounded border-gray-100 dark:border-zinc-600"
                    />
                    <button
                      onClick={handleUsernameUpdate}
                      className="py-1.5 btn bg-slate-100 border-transparent rounded hover:bg-gray-50 transition-all ease-in-out dark:bg-zinc-600 dark:text-gray-50 dark:hover:bg-zinc-500/50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditUsername(false);
                        setEditedUsername(user ? user.username : "");
                      }}
                      className="ml-2 py-1.5 btn bg-slate-100 border-transparent rounded hover:bg-gray-50 transition-all ease-in-out dark:bg-zinc-600 dark:text-gray-50 dark:hover:bg-zinc-500/50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="flex items-center">
                    <h5 className="text- dark:text-gray-50">
                      {user ? user.username : "N/A"}
                    </h5>
                    <button
                      onClick={() => setEditUsername(true)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mt-5">
                <div className="mb-2 flex items-center">
                  <span className="inline-block w-3 h-6 mr-2">
                    <i className="ri-mail-fill text-gray-500 dark:text-gray-400"></i>
                  </span>
                  <p className="text-gray-500 dark:text-gray-300">Email</p>
                </div>
                {editEmail ? (
                  <>
                    <input
                      value={editedEmail}
                      onChange={(e) => setEditedEmail(e.target.value)}
                      type="text"
                      className="w-full p-2 mb-2 border rounded border-gray-100 dark:border-zinc-600"
                    />
                    <button
                      onClick={handleEmailUpdate}
                      className="py-1.5 btn bg-slate-100 border-transparent rounded hover:bg-gray-50 transition-all ease-in-out dark:bg-zinc-600 dark:text-gray-50 dark:hover:bg-zinc-500/50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditEmail(false);
                        setEditedEmail(user ? user.email : "");
                      }}
                      className="ml-2 py-1.5 btn bg-slate-100 border-transparent rounded hover:bg-gray-50 transition-all ease-in-out dark:bg-zinc-600 dark:text-gray-50 dark:hover:bg-zinc-500/50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="flex items-center">
                    <h5 className="dark:text-gray-50">
                      {user ? user.email : "N/A"}
                    </h5>
                    <button
                      onClick={() => setEditEmail(true)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="mt-5">
                <div className="mb-2 flex items-center">
                  <span className="inline-block w-3 h-6 mr-2">
                    <i className="ri-map-pin-2-fill text-gray-500 dark:text-gray-400"></i>
                  </span>
                  <p className="text-gray-500 dark:text-gray-300">Location</p>
                </div>
                {editLocation ? (
                  <>
                    <input
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      type="text"
                      className="w-full p-2 mb-2 border rounded border-gray-100 dark:border-zinc-600"
                    />
                    <button
                      onClick={handleLocationUpdate}
                      className="py-1.5 btn bg-slate-100 border-transparent rounded hover:bg-gray-50 transition-all ease-in-out dark:bg-zinc-600 dark:text-gray-50 dark:hover:bg-zinc-500/50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditLocation(false);
                        setEditedLocation(user ? user.location : "");
                      }}
                      className="ml-2 py-1.5 btn bg-slate-100 border-transparent rounded hover:bg-gray-50 transition-all ease-in-out dark:bg-zinc-600 dark:text-gray-50 dark:hover:bg-zinc-500/50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="flex items-center">
                    <h5 className=" dark:text-gray-50">
                      {user ? user.location : "N/A"}
                    </h5>
                    <button
                      onClick={() => setEditLocation(true)}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Time */}
              <div className="mt-5">
                <div className="mb-2 flex items-center">
                  <span className="inline-block w-3 h-6 mr-2">
                    <i className="ri-calendar-fill text-gray-500 dark:text-gray-400"></i>
                  </span>
                  <p className="text-gray-500 dark:text-gray-300">
                    Create Profile Date
                  </p>
                </div>
                <h5 className="dark:text-gray-50">
                  {user ? user.createdOnReadable : "N/A"}
                </h5>
              </div>
            </div>
          </div>
        </div>
        {/* End Profile Status and Username*/}
      </div>
    </div>
  );
}
