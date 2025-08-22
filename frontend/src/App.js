import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/navbar";
import Home from "./pages/home";
import Login from "./pages/login";
import Chat from "./pages/chat";
import Signup from "./pages/signup";
import Dash from "./pages/dashbord";
import Videos from "./pages/videos"
import Notifications from "./pages/notification";
import Main from "./pages/main"
import VideoPlayer from "./pages/videoplayer"


function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
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
    </BrowserRouter>
  );
}

export default App;
