import React from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { useGetOutages } from '../../hooks/useReportOutage'
import { Check, CircleAlert, MapPin, ClipboardList } from "lucide-react"

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
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
                {[1, 2, 3].map((i) => (
                    <div key={i} className='card bg-base-100 shadow-lg'>
                        <div className='card-body'>
                            <div className='skeleton h-4 w-24 mb-2'></div>
                            <div className='skeleton h-12 w-16 mb-2'></div>
                            <div className='skeleton h-3 w-32'></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
            <div className='card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200'>
                <div className='card-body p-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                            <h2 className='text-sm font-medium text-base-content/70 mb-3'>
                                Power Status
                            </h2>
                            <div className='flex items-center gap-3 mb-2'>
                                <span className={`text-4xl font-bold ${hasPowerOutage ? 'text-error' : 'text-success'}`}>
                                    {hasPowerOutage ? 'OUT' : 'ON'}
                                </span>
                                {hasPowerOutage ? (
                                    <CircleAlert className='w-10 h-10 text-error' />
                                ) : (
                                    <Check className='w-10 h-10 text-success' />
                                )}
                            </div>
                            <p className='text-xs text-base-content/60'>
                                {hasPowerOutage
                                    ? `${confirmedOutagesNearby} confirmed outage${confirmedOutagesNearby > 1 ? 's' : ''}`
                                    : 'All clear in your area'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200'>
                <div className='card-body p-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                            <h2 className='text-sm font-medium text-base-content/70 mb-3'>
                                Nearby Outages
                            </h2>
                            <div className='flex items-center gap-3 mb-2'>
                                <span className='text-4xl font-bold text-primary'>
                                    {outages?.length || 0}
                                </span>
                                <MapPin className='w-10 h-10 text-primary' />
                            </div>
                            <p className='text-xs text-base-content/60'>
                                Within 5km radius
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-200'>
                <div className='card-body p-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                            <h2 className='text-sm font-medium text-base-content/70 mb-3'>
                                Your Reports
                            </h2>
                            <div className='flex items-center gap-3 mb-2'>
                                <span className='text-4xl font-bold text-primary'>
                                    {totalUserReports}
                                </span>
                                <ClipboardList className='w-10 h-10 text-primary' />
                            </div>
                            <p className='text-xs text-base-content/60'>
                                Total reported by you
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopCards