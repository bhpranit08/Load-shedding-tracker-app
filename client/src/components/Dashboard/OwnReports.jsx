import React from 'react'

import { useGetOutages, useResolveOutage } from '../../hooks/useReportOutage'

import { useMemo } from 'react'

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
    CircleCheckBigIcon,
    ThumbsDown
} from 'lucide-react'

const OwnReports = () => {
    const { loading, ownReports: ownOutages, getOutages } = useGetOutages()
    const { resolveOutage } = useResolveOutage(getOutages)
    const { authUser } = useAuthContext()

    const getStatusMeta = (status) => {
        switch (status) {
            case 'confirmed':
                return {
                    label: 'Confirmed',
                    Icon: AlertCircle,
                    badgeClass: 'badge-error',
                    iconClass: 'text-error',
                }
            case 'likely':
                return {
                    label: 'Likely',
                    Icon: AlertTriangle,
                    badgeClass: 'badge-warning',
                    iconClass: 'text-warning',
                }
            case 'unverified':
                return {
                    label: 'Unverified',
                    Icon: HelpCircle,
                    badgeClass: 'badge-ghost',
                    iconClass: 'text-base-content/60',
                }
            case 'resolved':
                return {
                    label: 'Resolved',
                    Icon: CircleCheckBigIcon,
                    badgeClass: 'badge-success',
                    iconClass: 'text-success'
                }
            default:
                return {
                    label: 'Unknown',
                    Icon: HelpCircle,
                    badgeClass: 'badge-ghost',
                    iconClass: 'text-base-content/60',
                }
        }
    }

    if (loading) {
        return (
            <div className='w-full'>
                <div className='flex items-center justify-between gap-3 mb-4'>
                    <h2 className='text-2xl font-bold text-center'>Active Outages Near You</h2>
                    <div className='badge badge-outline'>Loading</div>
                </div>
                <div className='space-y-3'>
                    <div className='skeleton h-28 w-full rounded-box'></div>
                    <div className='skeleton h-28 w-full rounded-box'></div>
                    <div className='skeleton h-28 w-full rounded-box'></div>
                </div>
            </div>
        )
    }

    if (!ownOutages || ownOutages.length === 0) {
        return (
            <div className='w-full'>
                <h2 className='text-2xl font-bold mb-4 text-center'>Outages reported by you</h2>
                <div className='card bg-base-100 shadow-sm border border-base-200'>
                    <div className='card-body items-center text-center'>
                        <div className='rounded-full bg-success/10 p-4'>
                            <CheckCircle2 className='h-8 w-8 text-success' />
                        </div>
                        <p className='text-xl font-semibold mt-2'>No outages reported by you!</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='flex flex-col items-center w-full'>
                <h2 className='text-2xl font-bold text-center'>Outages reported by you</h2>
            </div>
            <div className='space-y-3 grid grid-cols-1 md:grid-cols-2 gap-2 mt-3'>
                {ownOutages.map((outage) => (
                    <div
                        key={outage._id}
                        className='card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow h-full'
                    >
                        <div className='card-body'>
                            {(() => {
                                const meta = getStatusMeta(outage?.status)
                                const when = outage?.reportedAt
                                    ? formatDistanceToNow(new Date(outage.reportedAt), { addSuffix: true })
                                    : 'unknown time'

                                return (
                                    <div className='flex items-start justify-between gap-4'>
                                        <div className='flex items-start gap-3 min-w-0 flex-1'>
                                            <div className='rounded-box bg-base-200/60 p-2 mt-0.5'>
                                                <meta.Icon className={`h-5 w-5 ${meta.iconClass}`} />
                                            </div>

                                            <div className='min-w-0 flex-1'>
                                                <div className='flex flex-wrap items-center gap-2'>
                                                    <h3 className='font-bold text-lg truncate'>{outage?.area || 'Unknown area'}</h3>
                                                    <span className={`badge badge-sm ${meta.badgeClass}`}>{meta.label}</span>
                                                </div>

                                                <div className='mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/60'>
                                                    <span className='inline-flex items-center gap-1.5'>
                                                        <Clock className='h-4 w-4' />
                                                        {when}
                                                    </span>
                                                </div>
                                                <div className="flex mt-2 w-72 justify-between items-center">
                                                    <p className='text-xs text-success flex items-center'><ThumbsUp className='w-4 h-4' /> {outage?.upvotes}</p>
                                                    <p className='text-xs text-error flex items-center justify-center'><ThumbsDown className='w-4 h-4' /> {outage?.downvotes}</p>
                                                </div>
                                                <progress className="progress progress-primary w-56" value={outage?.upvotes} max={outage?.upvotes + outage?.downvotes}></progress>

                                                {outage?.description && (
                                                    <p className='text-sm mt-3 text-base-content/80 line-clamp-3'>
                                                        {outage.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()}

                            <div className='card-actions justify-end mt-3'>
                                <button
                                    type='button'
                                    className='btn btn-sm btn-ghost'
                                    onClick={() => navigate('/map', { state: { selectedOutage: outage._id } })}
                                >
                                    <MapPinned className='h-4 w-4' />
                                    View on Map
                                </button>
                                {outage?.status === "confirmed" && (
                                    <button className='btn btn-sm btn-primary' onClick={() => resolveOutage({ _id: outage._id, xCoordinate: authUser.homeLocation.coordinates[0], yCoordinate: authUser.homeLocation.coordinates[1] })}>
                                        Resolve
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OwnReports