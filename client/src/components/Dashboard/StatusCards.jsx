import React, { useMemo } from 'react'
import { useGetOutages, useVerifyOutage, useResolveOutage } from '../../hooks/useReportOutage'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useAuthContext } from '../../context/AuthContext'
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

const StatusCards = () => {
    const { loading, outages, getOutages } = useGetOutages()
    const { verifyOutage } = useVerifyOutage(getOutages)
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

    const summary = useMemo(() => {
        const list = Array.isArray(outages) ? outages : []
        const counts = { confirmed: 0, likely: 0, unverified: 0, unknown: 0 }
        for (const o of list) {
            if (o?.status === 'confirmed') counts.confirmed += 1
            else if (o?.status === 'likely') counts.likely += 1
            else if (o?.status === 'unverified') counts.unverified += 1
            else counts.unknown += 1
        }
        return { total: list.length, ...counts }
    }, [outages])

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

    if (!outages || outages.length === 0) {
        return (
            <div className='w-full'>
                <h2 className='text-2xl font-bold mb-4 text-center'>Active Outages Near You</h2>
                <div className='card bg-base-100 shadow-sm border border-base-200'>
                    <div className='card-body items-center text-center'>
                        <div className='rounded-full bg-success/10 p-4'>
                            <CheckCircle2 className='h-8 w-8 text-success' />
                        </div>
                        <p className='text-xl font-semibold mt-2'>No active outages near you</p>
                        <p className='text-base-content/60'>Power looks stable in your area right now.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3 w-full'>
                <div className="hidden sm:block w-full"></div>
                <div className='flex flex-col items-center w-full'>
                    <h2 className='text-2xl font-bold text-center'>Active Outages Near You</h2>
                    <p className='text-sm text-base-content/60 mt-1 text-center'>
                        Showing {summary.total} report{summary.total === 1 ? '' : 's'} near your location
                    </p>
                </div>
                <div className='flex w-full items-center justify-center'>
                    <div className='stats shadow-sm border border-base-200 bg-base-100'>
                        <div className='stat py-3 px-4'>
                            <div className='stat-title text-xs'>Confirmed</div>
                            <div className='stat-value text-base text-error'>{summary.confirmed}</div>
                        </div>
                        <div className='stat py-3 px-4'>
                            <div className='stat-title text-xs'>Likely</div>
                            <div className='stat-value text-base text-warning'>{summary.likely}</div>
                        </div>
                        <div className='stat py-3 px-4'>
                            <div className='stat-title text-xs'>Unverified</div>
                            <div className='stat-value text-base'>{summary.unverified}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='space-y-3 grid grid-cols-1 md:grid-cols-3 gap-2'>
                {outages.map((outage) => (
                    <div
                        key={outage._id}
                        className='card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow'
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
                                                    <span className='inline-flex items-center gap-1.5'>
                                                        <ThumbsUp className='h-4 w-4' />
                                                        {outage?.upvotes ?? 0}
                                                    </span>
                                                    <span className='inline-flex items-center gap-1.5'>
                                                        <ThumbsDown className='h-4 w-4' />
                                                        {outage?.downvotes ?? 0}
                                                    </span>
                                                </div>

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

                            <div className='card-actions justify-end mt-4 pt-3 border-t border-base-200'>
                                <div className='flex flex-wrap items-center justify-end gap-2 w-full'>
                                    <button
                                        type='button'
                                        className='btn btn-sm btn-ghost gap-1.5'
                                        onClick={() => navigate('/map', { state: { selectedOutage: outage._id } })}
                                    >
                                        <MapPinned className='h-4 w-4' />
                                        View on Map
                                    </button>
                                    {outage?.verifications?.find((verification) => verification.userId === authUser._id ) ? (
                                        <span className='badge badge-info badge-sm'>Already Voted</span>
                                    ) : outage.userId._id.toString() !== authUser._id.toString() ? (
                                        <div className='flex items-center gap-1.5'>
                                            <button
                                                type='button'
                                                className='btn btn-sm btn-primary gap-1.5'
                                                onClick={() => verifyOutage({_id: outage._id, type: 'upvote', xCoordinate: authUser.homeLocation.coordinates[0], yCoordinate: authUser.homeLocation.coordinates[1] })}
                                            >
                                                <ThumbsUp className='h-4 w-4' />
                                                Upvote
                                            </button>
                                            <button
                                                type='button'
                                                className='btn btn-sm btn-outline btn-error gap-1.5'
                                                onClick={() => verifyOutage({_id: outage._id, type: 'downvote', xCoordinate: authUser.homeLocation.coordinates[0], yCoordinate: authUser.homeLocation.coordinates[1] })}
                                            >
                                                <ThumbsDown className='h-4 w-4' />
                                                Downvote
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                                {outage?.status === "confirmed" && outage?.userId._id.toString() !== authUser._id && (
                                    <div className='flex flex-wrap items-center justify-end gap-2 mt-2'>
                                        <span className='text-xs text-base-content/70'>
                                            {3 - outage?.resolutionConfirmations?.length}/3 resolution{3 - outage?.resolutionConfirmations?.length === 1 ? '' : 's'} required
                                        </span>
                                        {outage?.resolutionConfirmations?.length > 0 && outage?.resolutionConfirmations?.find((confirmation) => confirmation.userId === authUser._id) ? (
                                            <span className='badge badge-info badge-sm'>Resolution Added</span>
                                        ) : (
                                            <button
                                                type='button'
                                                className='btn btn-primary btn-sm gap-1.5'
                                                onClick={() => resolveOutage({_id: outage._id, xCoordinate: authUser.homeLocation.coordinates[0], yCoordinate: authUser.homeLocation.coordinates[1] })}
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StatusCards