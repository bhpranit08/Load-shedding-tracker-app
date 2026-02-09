import React from 'react'

import { useLogout } from "../hooks/useAuth"

import { Link } from 'react-router-dom'

import ThemeChanger from "../utils/ThemeChanger"

import { useAuthContext } from "../context/AuthContext"

const NavBar = () => {
    const { logout, loading } = useLogout()
    const { authUser } = useAuthContext()

    return (
        <div className="navbar bg-base-200 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to="/home/dashboard">Dashboard</Link></li>
                        <li><Link to="/home/map">Map</Link></li>
                        <li><Link to="/home/report-outage">Report Outage</Link></li>
                        {/* <li>
                            <a>Parent</a>
                            <ul className="p-2">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </li> */}
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">PowerTrack</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/home/dashboard">Dashboard</Link></li>
                    <li><Link to="/home/map">Map</Link></li>
                    <li><Link to="/home/report-outage">Report Outage</Link></li>
                    {/* <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className="p-2 bg-base-100 w-40 z-1">
                                <li><a>Submenu 1</a></li>
                                <li><a>Submenu 2</a></li>
                            </ul>
                        </details>
                    </li> */}
                </ul>
            </div>
            <div className="navbar-end">
                <ThemeChanger />
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src={authUser.profilePic} />
                        </div>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><a>{authUser.name}</a></li>
                        <li>
                            <button className={`btn btn-outline btn-sm btn-error ${ loading ? 'btn-disabled' : 'btn-outline btn-error' }`} onClick={() => logout()}>{loading ? <span className='loading loading-spinner'></span> : 'Logout'}</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar