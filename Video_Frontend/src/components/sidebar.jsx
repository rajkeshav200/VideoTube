// import { Link } from "react-router-dom";

// export default function Sidebar() {
//     return (
//         <div className="w-56 bg-zinc-950 text-white p-4 space-y-3">
//             <Link to="/">Home</Link>
//             <Link to="/me/videos">My Content</Link>
//             <Link to="/likedvideo">Liked</Link>
//             <Link to="/history">History</Link>
//             <Link to="/playlist">Playlist</Link>
//             <Link to="/profile">Profile</Link>
//         </div>
//     )
// }

import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `px-4 py-2.5 rounded-xl flex items-center gap-2
     font-medium transition-all duration-200
     ${
       pathname === path
         ? "bg-indigo-500/10 text-indigo-700 shadow-inner"
         : "text-zinc-700 hover:bg-zinc-200/70 hover:text-zinc-900"
     }`;

  return (
    <aside className="w-60 min-h-screen bg-zinc-100/70 backdrop-blur-md border-r border-zinc-200 shadow-lg p-5 flex flex-col">
      
      {/* Header */}
      <h2 className="text-lg font-bold mb-6 tracking-wide text-zinc-800">
        Menu
      </h2>

      {/* Links */}
      <nav className="flex flex-col gap-2">
        <Link className={linkClass("/")} to="/">Home</Link>
        <Link className={linkClass("/me/videos")} to="/me/videos">My Content</Link>
        <Link className={linkClass("/likedvideo")} to="/likedvideo">Liked</Link>
        <Link className={linkClass("/history")} to="/history">History</Link>
        <Link className={linkClass("/playlist")} to="/playlist">Playlist</Link>
        <Link className={linkClass("/dashboard")} to="/dashboard">Dashboard</Link>
        <Link className={linkClass("/subscription")} to="/subscription">Subscription</Link>
      </nav>

      {/* Bottom Accent */}
      <div className="mt-auto pt-6 text-xs text-zinc-500">
        © VideoTube
      </div>
    </aside>
  );
}

