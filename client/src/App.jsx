import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Map from './pages/Map'
import Login from './pages/Login'
import Register from './pages/Register'
import NavbarComponent from './components/NavbarComponent'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="app-shell">
      <div className="absolute inset-x-0 top-0 z-0 h-[420px] blur-[80px]">
        <div className="mx-auto h-full max-w-4xl bg-linear-to-r from-sky-500/30 via-indigo-500/40 to-cyan-400/30" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col px-4 pb-10 pt-6 sm:px-8">
        <NavbarComponent />
        <main className="mt-10 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <Toaster toastOptions={{ className: '', style: { width: '1020px' } }} />
        </main>
      </div>
    </div>
  )
}

export default App
