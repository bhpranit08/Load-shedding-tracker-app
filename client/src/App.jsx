import { ToastContainer } from "react-toastify"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"

import { Navigate, Route, Routes } from "react-router-dom"
import { useAuthContext } from "./context/AuthContext"

function App() {
  const { authUser } = useAuthContext()

  return (
    <div>
      <Routes>
        <Route path="/" element={authUser ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={authUser ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={authUser ? <Navigate to="/home" /> : <Register />} />
        <Route path="/home" element={!authUser ? <Navigate to="/login" /> : <Home />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
