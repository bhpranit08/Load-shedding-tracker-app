import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { useGetOutages } from '../../hooks/useReportOutage'

import { Check } from "lucide-react"
import { CircleAlert } from 'lucide-react'
import { MapPin } from 'lucide-react'
import { ClipboardList } from 'lucide-react'

const TopCards = () => {
    const { authUser } = useAuthContext()
    const { loading, outages } = useGetOutages()

    const confirmedOutagesNearby = outages?.filter(outage =>
        outage.status === 'confirmed'
    ).length || 0

    const hasPowerOutage = confirmedOutagesNearby > 0

    const totalUserReports = authUser?.totalReports || 0

    if (loading) {
        return (
            <div className='stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100'>
                <div className='stat'>
                    <div className='skeleton h-12 w-24 mb-2'></div>
                    <div className='skeleton h-16 w-20'></div>
                </div>
                <div className='stat'>
                    <div className='skeleton h-12 w-24 mb-2'></div>
                    <div className='skeleton h-16 w-20'></div>
                </div>
                <div className='stat'>
                    <div className='skeleton h-12 w-24 mb-2'></div>
                    <div className='skeleton h-16 w-20'></div>
                </div>
            </div>
        )
    }

    return (
        <div className='stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100 px-4 gap-2'>
            <div className='stat border border-primary rounded-lg'>
                <div className='stat-figure'>
                    <span className='text-2xl font-bold'>
                        {hasPowerOutage ? <CircleAlert className='w-12 h-12 text-error' /> : <Check className='text-success w-12 h-12' />}
                    </span>
                </div>
                <div className='stat-title text-base-content/70'>Power Status</div>
                <div className='stat-value'>
                    <span className={hasPowerOutage ? 'text-error' : 'text-success'}>
                        {hasPowerOutage ? 'OUT' : 'ON'}
                    </span>
                </div>
                <div className='stat-desc'>
                    {hasPowerOutage
                        ? `${confirmedOutagesNearby} confirmed outage${confirmedOutagesNearby > 1 ? 's' : ''}`
                        : 'All clear'}
                </div>
            </div>

            <div className='stat border border-primary rounded-lg'>
                <div className='stat-figure text-primary'>
                    <MapPin className='h-12 w-12' />
                </div>
                <div className='stat-title text-base-content/70'>Nearby Outages</div>
                <div className='stat-value text-primary'>{outages?.length || 0}</div>
                <div className='stat-desc'>Within 5km radius</div>
            </div>

            <div className='stat border border-primary rounded-lg'>
                <div className='stat-figure text-primary'>
                    <ClipboardList className='h-12 w-12' />
                </div>
                <div className='stat-title text-base-content/70'>Your Reports</div>
                <div className='stat-value text-primary'>{totalUserReports}</div>
                <div className='stat-desc'>Total reported</div>
            </div>
        </div>
    )
}

export default TopCards