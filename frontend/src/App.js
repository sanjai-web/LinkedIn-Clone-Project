import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./pages/navbar";
import Home from "./pages/home";
import Login from "./pages/login";
import Chat from "./pages/chat";
import Signup from "./pages/signup";
import Dash from "./pages/dashbord";
import Videos from "./pages/videos";
import Notifications from "./pages/notification";
import Main from "./pages/main";
import VideoPlayer from "./pages/videoplayer";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/" || location.pathname === "/signup";

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashbord" element={<Dash />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;

