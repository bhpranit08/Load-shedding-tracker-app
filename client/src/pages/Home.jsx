import React from 'react'

import NavBar from '../components/NavBar'

import { Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Map from './Map'
import ReportOutage from './ReportOutage'

const Home = () => {
    return (
        <div className='flex flex-col items-start justify-start'>
            <NavBar />
            <Routes>
                <Route path='/*' element={<Dashboard />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/map' element={<Map />} />
                <Route path='/report-outage' element={<ReportOutage />} />
            </Routes>
        </div>
    )
}

export default Home