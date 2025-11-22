import React, { useEffect, useState } from 'react'
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const NavbarComponent = () => {
    const [active, setActive] = useState('home')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const current = window.location.pathname === '/' ? 'home' : window.location.pathname.replace('/', '')
        setActive(current || 'home')
    }, [])

    const linkClasses = (key) =>
        `text-sm uppercase tracking-[0.2em] transition ${active === key ? 'text-sky-300' : 'text-slate-300 hover:text-white'}`

    return (
        <Navbar fluid rounded className="glass-panel border border-white/10 px-6 py-4 text-slate-100 shadow-2xl">
            <NavbarBrand as={Link} to="/" onClick={() => setActive('home')} className="gap-4">
                <div className="pulse-ring flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-sky-500 via-cyan-500 to-indigo-500 text-lg font-bold text-slate-900">
                    LT
                </div>
                <div>
                    <p className="text-base font-semibold leading-tight text-white">Loadshedding Tracker</p>
                    <span className="text-xs uppercase tracking-[0.35em] text-slate-300">Live energy insights</span>
                </div>
            </NavbarBrand>
            <div className="hidden items-center gap-4 md:flex">
                <div className="accent-pill px-4 py-1 text-xs uppercase tracking-[0.25em] text-cyan-200">Realtime mode</div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Last sync</p>
                    <p className="text-sm font-medium text-white">Just now</p>
                </div>
            </div>
            <NavbarToggle className="text-white focus:ring-0" />
            <NavbarCollapse className="bg-transparent text-right md:text-left">
                <NavbarLink as={Link} to="/" onClick={() => setActive('home')} className={linkClasses('home')}>
                    Home
                </NavbarLink>
                <NavbarLink as={Link} to="/map" onClick={() => setActive('map')} className={linkClasses('map')}>
                    Map
                </NavbarLink>
                <NavbarLink as={Link} to="/register" onClick={() => setActive('register')} className={linkClasses('register')}>
                    Register
                </NavbarLink>
                <NavbarLink as={Link} to="/login" onClick={() => setActive('login')} className={linkClasses('login')}>
                    Login
                </NavbarLink>
            </NavbarCollapse>
        </Navbar>
    )
}

export default NavbarComponent