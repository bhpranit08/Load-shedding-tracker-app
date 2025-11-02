import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Map from './pages/Map';
import Login from './pages/Login';
import Register from './pages/Register';
import NavbarComponent from './components/NavbarComponent';

function App() {

  return (
    <div className="w-full">
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
