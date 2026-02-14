import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Mainlayout } from "./layout/mainlayout";
import './App.css'
import Home from "./pages/homepage";
import Login from "./pages/loginpage";
import Watch from "./pages/watchvideo";
import Watchhistory from "./pages/watchHistory";
import Dashboardpage from "./pages/dashboardpage";
import Channel from "./pages/channels";
import Searchpage from "./pages/searchpage";
import Likedvideo from "./pages/likevideo";
import Myvideo from "./pages/myvideo";
import PlayList from "./pages/playlists";
import Profile from "./pages/profile";
import Register from "./pages/register";
import Upload from "./pages/upload";
import { useAuth } from "./hook/useAuth";
import PlayListDetail from "./pages/playListDetail";
import Subscriptionpage from "./pages/subscription";
import ChangePassword from "./pages/changePassword";


function App() {

  const {user} = useAuth();

  //playlist from watchvideo
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
        <Route index element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="watch/:videoId" element={<Watch/>}/>
        <Route path="/history" element={<Watchhistory/>}/>
        <Route path="/channel/:username" element={<Channel/>}/>
        <Route path="/dashboard" element={<Dashboardpage/>}/>
        <Route path="/search" element={<Searchpage/>}/>
        <Route path="/likedvideo" element={<Likedvideo/>}/>
        <Route path="/me/videos" element={<Myvideo/>}/>
        <Route path="/playlist" element={<PlayList user={user}/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/signup" element={<Register/>}/>
        <Route path="/upload" element={<Upload/>}/>
        <Route path="/playlist/:playlistId" element={<PlayListDetail/>}/>
        <Route path="/subscription" element={<Subscriptionpage/>}/>
        <Route path="/change-password" element={<ChangePassword/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
