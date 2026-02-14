// import { Outlet } from "react-router-dom"
// import Sidebar from "../components/sidebar"
// import Navbar from "../components/navbar"

// export function Mainlayout() {
//     return (
//         <div className="flex h-screen">
//             <Sidebar />
//             <div className="flex flex-col flex-1">
//                 <Navbar />
//                 <main className="flex-1 overflow-y-auto p-4 bg-zinc-900 text-white">
//                     <Outlet />
//                 </main>
//             </div>
//         </div>
//     )
// }
import { Outlet } from "react-router-dom"
import Sidebar from "../components/sidebar"
import Navbar from "../components/navbar"

export function Mainlayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800 text-white">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          {/* LIGHT CONTENT BACKGROUND */}
          <div className="h-full rounded-xl bg-zinc-400 text-gray-900 shadow-xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

