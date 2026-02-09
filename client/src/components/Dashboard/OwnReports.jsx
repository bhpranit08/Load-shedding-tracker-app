import React from 'react'
import { useGetOutages, useResolveOutage } from '../../hooks/useReportOutage'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Clock,
    MapPinned,
    ThumbsUp,
    HelpCircle,
    CircleCheckBig,
    ThumbsDown,
    TrendingUp,
    TrendingDown
} from 'lucide-react'

const OwnReports = () => {
    const { loading, ownReports: ownOutages, getOutages } = useGetOutages()
    const { resolveOutage } = useResolveOutage(getOutages)
    const { authUser } = useAuthContext()
    const navigate = useNavigate()

    const getStatusMeta = (status) => {
        switch (status) {
            case 'confirmed':
                return {
                    label: 'Confirmed',
                    Icon: AlertCircle,
                    badgeClass: 'badge-error',
                    iconClass: 'text-error',
                    bgClass: 'bg-error/10'
                }
            case 'likely':
                return {
                    label: 'Likely',
                    Icon: AlertTriangle,
                    badgeClass: 'badge-warning',
                    iconClass: 'text-warning',
                    bgClass: 'bg-warning/10'
                }
            case 'unverified':
                return {
                    label: 'Unverified',
                    Icon: HelpCircle,
                    badgeClass: 'badge-ghost',
                    iconClass: 'text-base-content/60',
                    bgClass: 'bg-base-content/5'
                }
            case 'resolved':
                return {
                    label: 'Resolved',
                    Icon: CircleCheckBig,
                    badgeClass: 'badge-success',
                    iconClass: 'text-success',
                    bgClass: 'bg-success/10'
                }
            default:
                return {
                    label: 'Unknown',
                    Icon: HelpCircle,
                    badgeClass: 'badge-ghost',
                    iconClass: 'text-base-content/60',
                    bgClass: 'bg-base-content/5'
                }
        }
    }

    if (loading) {
        return (
            <div className='w-full'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6'>
                    <div>
                        <div className='skeleton h-8 w-64 mb-2'></div>
                        <div className='skeleton h-4 w-48'></div>
                    </div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    {[1, 2].map((i) => (
                        <div key={i} className='card bg-base-100 shadow-lg'>
                            <div className='card-body'>
                                <div className='skeleton h-6 w-32 mb-2'></div>
                                <div className='skeleton h-4 w-full mb-2'></div>
                                <div className='skeleton h-4 w-2/3'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!ownOutages || ownOutages.length === 0) {
        return (
            <div className='w-full'>
                <h2 className='text-2xl font-bold mb-6'>Outages Reported by You</h2>
                <div className='card bg-base-100 shadow-lg'>
                    <div className='card-body items-center text-center py-12'>
                        <div className='rounded-full bg-info/10 p-6 mb-4'>
                            <CheckCircle2 className='h-12 w-12 text-info' />
                        </div>
                        <h3 className='text-xl font-semibold mb-2'>No Reports Yet</h3>
                        <p className='text-base-content/60 max-w-md mb-4'>
                            You haven't reported any outages. Help your community by reporting power issues when you experience them.
                        </p>
                        <button 
                            className='btn btn-primary'
                            onClick={() => navigate('/report')}
                        >
                            Report an Outage
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full px-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
                <div>
                    <h2 className='text-2xl font-bold'>Outages Reported by You</h2>
                    <p className='text-sm text-base-content/60 mt-1'>
                        Track the status of your {ownOutages.length} report{ownOutages.length === 1 ? '' : 's'}
                    </p>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {ownOutages.map((outage) => {
                    const meta = getStatusMeta(outage?.status)
                    const when = outage?.reportedAt
                        ? formatDistanceToNow(new Date(outage.reportedAt), { addSuffix: true })
                        : 'unknown time'
                    
                    const totalVotes = (outage?.upvotes || 0) + (outage?.downvotes || 0)
                    const upvotePercentage = totalVotes > 0 
                        ? Math.round((outage?.upvotes / totalVotes) * 100) 
                        : 0

                    return (
                        <div
                            key={outage._id}
                            className='card bg-base-200 shadow-sm hover:shadow-md transition-all duration-200'
                        >
                            <div className='card-body p-4'>
                                <div className='flex items-start gap-3 mb-3'>
                                    <div className={`rounded-lg ${meta.bgClass} p-2.5 shrink-0`}>
                                        <meta.Icon className={`h-5 w-5 ${meta.iconClass}`} />
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-start justify-between gap-2 mb-2'>
                                            <h3 className='font-semibold text-lg leading-tight'>
                                                {outage?.area || 'Unknown area'}
                                            </h3>
                                            <span className={`badge ${meta.badgeClass} badge-sm shrink-0`}>
                                                {meta.label}
                                            </span>
                                        </div>

                                        <div className='flex items-center gap-2 text-sm text-base-content/60 mb-3'>
                                            <Clock className='h-3.5 w-3.5' />
                                            <span>{when}</span>
                                        </div>

                                        <div className='space-y-2'>
                                            <div className='flex items-center justify-between text-xs'>
                                                <div className='flex items-center gap-1.5 text-success'>
                                                    <TrendingUp className='h-3.5 w-3.5' />
                                                    <span className='font-medium'>{outage?.upvotes || 0} upvotes</span>
                                                </div>
                                                <div className='flex items-center gap-1.5 text-error'>
                                                    <TrendingDown className='h-3.5 w-3.5' />
                                                    <span className='font-medium'>{outage?.downvotes || 0} downvotes</span>
                                                </div>
                                            </div>

                                            {totalVotes > 0 && (
                                                <div className='space-y-1'>
                                                    <div className='w-full bg-base-300 rounded-full h-2 overflow-hidden'>
                                                        <div 
                                                            className='bg-success h-full rounded-full transition-all duration-300'
                                                            style={{ width: `${upvotePercentage}%` }}
                                                        />
                                                    </div>
                                                    <p className='text-xs text-base-content/60 text-center'>
                                                        {upvotePercentage}% confidence ({totalVotes} vote{totalVotes === 1 ? '' : 's'})
                                                    </p>
                                                </div>
                                            )}

                                            {totalVotes === 0 && (
                                                <div className='text-xs text-base-content/50 text-center py-2'>
                                                    No votes yet
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {outage?.description && (
                                    <p className='text-sm text-base-content/80 line-clamp-2 mb-3 pl-[52px]'>
                                        {outage.description}
                                    </p>
                                )}

                                <div className='flex flex-col gap-2 mt-auto pt-3 border-t border-base-content/10'>
                                    <div className='flex flex-wrap items-center gap-2 justify-end'>
                                        <button
                                            type='button'
                                            className='btn btn-sm btn-ghost gap-1.5'
                                            onClick={() => navigate('/map', { state: { selectedOutage: outage._id } })}
                                        >
                                            <MapPinned className='h-4 w-4' />
                                            View on Map
                                        </button>

                                        {outage?.status === "confirmed" && (
                                            <button 
                                                type='button'
                                                className='btn btn-sm btn-success gap-1.5' 
                                                onClick={() => resolveOutage({ 
                                                    _id: outage._id, 
                                                    xCoordinate: authUser.homeLocation.coordinates[0], 
                                                    yCoordinate: authUser.homeLocation.coordinates[1] 
                                                })}
                                            >
                                                <CheckCircle2 className='h-4 w-4' />
                                                Mark as Resolved
                                            </button>
                                        )}
                                    </div>

                                    {outage?.status === "confirmed" && outage?.resolutionConfirmations && (
                                        <div className='flex items-center justify-between pt-2 border-t border-base-content/10'>
                                            <span className='text-xs text-base-content/70'>
                                                {outage.resolutionConfirmations.length}/3 resolution confirmations
                                            </span>
                                            {outage.resolutionConfirmations.length > 0 && (
                                                <div className='flex gap-1'>
                                                    {[...Array(3)].map((_, i) => (
                                                        <div 
                                                            key={i}
                                                            className={`w-2 h-2 rounded-full ${
                                                                i < outage.resolutionConfirmations.length 
                                                                    ? 'bg-success' 
                                                                    : 'bg-base-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default OwnReports