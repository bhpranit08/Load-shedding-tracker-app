import React, { useEffect, useState } from 'react'
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { Link } from 'react-router-dom'

const NavbarComponent = () => {
    const [active, setActive] = useState("home")

    useEffect(() => {
        setActive(window.location.href.split("/").at(-1))
    }, [])

    return (
        <Navbar fluid rounded>
            <NavbarBrand as={Link} to="/" onClick={() => setActive('home')}>
                <span className="self-center whitespace-nowrap text-xl font-semibold text-black">Loadshedding Tracker App</span>
            </NavbarBrand>
            <NavbarToggle />
            <NavbarCollapse>
                <NavbarLink as={Link} to="/" onClick={() => setActive('home')} active={active === 'home'}>
                    Home
                </NavbarLink>
                <NavbarLink as={Link} to="/map" onClick={() => setActive('map')} active={active === 'map'}>
                    Map
                </NavbarLink>
                <NavbarLink as={Link} to="/register" onClick={() => setActive('register')} active={active === 'register'}>
                    Register
                </NavbarLink>
                <NavbarLink as={Link} to="/login" onClick={() => setActive('login')} active={active === 'login'}>
                    Login
                </NavbarLink>
            </NavbarCollapse>
        </Navbar>
    )
}

export default NavbarComponent