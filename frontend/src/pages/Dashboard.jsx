import React, { useState, useEffect } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Home from '../pages/Home';
import UsersList from './Users/UsersList';
import RolesList from './Users/RolesList';
import SendSMS from './SMS/SendSMS';
import SMSTemplates from './SMS/SMSTemplstes';
import SMSAPI from './SMS/SMSAPI';
import CompanyProfile from './Settings/CompanyProfile';
import SiteSettings from './Settings/SiteSettings';
import ChangePassword from './Settings/ChangePassword';
import DatabaseBackup from './Settings/DatabaseBackup';
import Notification from '../components/Notification';
import axios from "axios";

function Dashboard() {

  const [notify, setNotify] = useState({
    isOpen: false,
    message: '',
    type: '',
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogged = window.localStorage.getItem("LoggedIn");
  const token = window.localStorage.getItem("token");
  const [loggedInUserDetails, setLoggedInUserDetails] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Define the effect to monitor changes in localStorage
    const handleStorageChange = () => {
      const updatedIsLogged = window.localStorage.getItem("LoggedIn");
      if (!updatedIsLogged) {
        // If not logged in, redirect to login page
        window.location.href = "/login";
      }
    };

    // Listen for changes in localStorage
    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [500]);

  useEffect(() => {
    getUserDetails(token);
  },[])

  if (isLogged == "false") {
    // If not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  //NOTIFICATION CONTROL
  useEffect(() => {
    if (sessionStorage.getItem("userCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "User Created Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("userCreated");
    }

    if (sessionStorage.getItem("userUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "User Updated Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("userUpdated");
    }

    if (sessionStorage.getItem("userDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "User Deleted Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("userDeleted");
    }

    if (sessionStorage.getItem("roleCreated") == "1") {
      setNotify({
        isOpen: true,
        message: "Role Created Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("roleCreated");
    }

    if (sessionStorage.getItem("roleUpdated") == "1") {
      setNotify({
        isOpen: true,
        message: "Role Updated Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("roleUpdated");
    }

    if (sessionStorage.getItem("roleDeleted") == "1") {
      setNotify({
        isOpen: true,
        message: "Role Deleted Successfully!",
        type: "success",
      });
      sessionStorage.removeItem("roleDeleted");
    }
  });


  //Getting Loggen In user's details
  async function getUserDetails(token){
    await axios
        .get(`http://localhost:8070/users/getUser`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) =>{
            setLoggedInUserDetails(res.data);
        })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* NOTIFICATION */}
      <Notification notify={notify} setNotify={setNotify} />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Cards */}
            <div> {/* <div className="grid grid-cols-12 gap-6"> */}
              {/* Define routes and load corresponding components */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users/usersList" element={<UsersList />} />
                <Route path="/users/rolesList" element={<RolesList />} />
                <Route path="/sms/sendSMS" element={<SendSMS />} />
                <Route path="/sms/smsTemplates" element={<SMSTemplates />} />
                <Route path="/sms/smsAPI" element={<SMSAPI />} />
                <Route path="/settings/companyProfile" element={<CompanyProfile />} />
                <Route path="/settings/siteSettings" element={<SiteSettings />} />
                <Route path="/settings/changePassword" element={<ChangePassword />} />
                <Route path="/settings/databaseBackup" element={<DatabaseBackup />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;