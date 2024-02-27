import { BrowserRouter as Router, Routes, Route, Switch } from "react-router-dom";
import "./App.css";
import { Index } from "./authViews/Index";
import { RecoverPassword } from "./authViews/RecoverPassword";
import { LockScreen } from "./authViews/LockScreen";
import { Login } from "./authViews/Login";
import { Register } from "./authViews/Register";
import { Chats } from "./components/Chats/Chats";
import { Contacts } from "./components/Contacts/Contacts";
import { Groups } from "./components/Groups/Groups";
import { Meta } from "./components/Meta/Meta";
import { Profile } from "./components/Profile/Profile";
import { Settings } from "./components/Settings/Settings";
import { SidebarMenu } from "./components/Sidebar-menu/SidebarMenu";
import { Switcher } from "./components/Switcher/Switcher"
import { UserProfileDetails } from "./components/UserProfileDetails/UserProfileDetails";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lock-screen" element={<LockScreen />} />
        <Route path="/recover" element={<RecoverPassword />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/meta" element={<Meta />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sidebar-menu" element={<SidebarMenu />} />
        <Route path="/switcher" element={<Switcher />} />
        <Route path="/user-profile-details" element={<UserProfileDetails />} />
      </Routes>
        <div className="App">
          <Index />
        </div>
    </Router>
  );
}

export default App;
