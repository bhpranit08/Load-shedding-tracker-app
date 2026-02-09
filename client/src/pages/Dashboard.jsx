import React from 'react'

import TopCards from '../components/Dashboard/TopCards'
import StatusCards from '../components/Dashboard/StatusCards'
import OwnReports from '../components/Dashboard/OwnReports'

const Dashboard = () => {
    return (
        <div className='w-full flex flex-col gap-4 items-center justify-center mt-4'>
            <TopCards />
            <StatusCards />
            <OwnReports />
        </div>
    )
}

export default Dashboard