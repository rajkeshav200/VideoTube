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
import EditVideo from "./pages/Editvideo";
import EditPlaylist from "./pages/Editplaylist";
import ProtectedRoute from "./components/protectedRoute";


function App() {

  const { user } = useAuth();

  //playlist from watchvideo
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Mainlayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/watch/:videoId" element={<Watch />} />
          <Route path="/channel/:username" element={<Channel />} />
          <Route path="/search" element={<Searchpage />} />

          {/* Protected Routes */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <Watchhistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboardpage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/likedvideo"
            element={
              <ProtectedRoute>
                <Likedvideo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/me/videos"
            element={
              <ProtectedRoute>
                <Myvideo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/playlist"
            element={
              <ProtectedRoute>
                <PlayList user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/playlist/:playlistId"
            element={
              <ProtectedRoute>
                <PlayListDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Upload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscriptionpage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-video/:videoId"
            element={
              <ProtectedRoute>
                <EditVideo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-playlist/:playlistId"
            element={
              <ProtectedRoute>
                <EditPlaylist />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
