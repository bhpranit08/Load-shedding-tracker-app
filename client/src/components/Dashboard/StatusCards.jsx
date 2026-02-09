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
    CircleCheckBig,
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
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6'>
                    <div>
                        <div className='skeleton h-8 w-64 mb-2'></div>
                        <div className='skeleton h-4 w-48'></div>
                    </div>
                    <div className='skeleton h-10 w-32'></div>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    {[1, 2, 3, 4].map((i) => (
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

    if (!outages || outages.length === 0) {
        return (
            <div className='w-full'>
                <h2 className='text-2xl font-bold mb-6'>Active Outages Near You</h2>
                <div className='card bg-base-100 shadow-lg'>
                    <div className='card-body items-center text-center py-12'>
                        <div className='rounded-full bg-success/10 p-6 mb-4'>
                            <CheckCircle2 className='h-12 w-12 text-success' />
                        </div>
                        <h3 className='text-xl font-semibold mb-2'>No Active Outages</h3>
                        <p className='text-base-content/60 max-w-md'>
                            Power looks stable in your area right now. We'll notify you if any outages are reported.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full px-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
                <div>
                    <h2 className='text-2xl font-bold'>Active Outages Near You</h2>
                    <p className='text-sm text-base-content/60 mt-1'>
                        Showing {summary.total} report{summary.total === 1 ? '' : 's'} near your location
                    </p>
                </div>
                <button
                    className='btn btn-primary gap-2'
                    onClick={() => navigate('/home/map')}
                >
                    <MapPinned className='h-4 w-4' />
                    View All on Map
                </button>
            </div>

            <div className='flex flex-wrap gap-2 mb-6'>
                <div className='badge badge-lg gap-2 badge-error'>
                    <div className='w-2 h-2 rounded-full bg-error-content'></div>
                    Confirmed: {summary.confirmed}
                </div>
                <div className='badge badge-lg gap-2 badge-warning'>
                    <div className='w-2 h-2 rounded-full bg-warning-content'></div>
                    Likely: {summary.likely}
                </div>
                <div className='badge badge-lg gap-2 badge-ghost'>
                    <div className='w-2 h-2 rounded-full bg-base-content/30'></div>
                    Unverified: {summary.unverified}
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {outages.map((outage) => {
                    const meta = getStatusMeta(outage?.status)
                    const when = outage?.reportedAt
                        ? formatDistanceToNow(new Date(outage.reportedAt), { addSuffix: true })
                        : 'unknown time'
                    const hasVoted = outage?.verifications?.find((verification) => verification.userId === authUser._id)
                    const isOwnReport = outage.userId._id.toString() === authUser._id.toString()
                    const hasConfirmedResolution = outage?.resolutionConfirmations?.find((confirmation) => confirmation.userId === authUser._id)

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

                                        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/60'>
                                            <span className='inline-flex items-center gap-1.5'>
                                                <Clock className='h-3.5 w-3.5' />
                                                {when}
                                            </span>
                                            <span className='inline-flex items-center gap-1.5'>
                                                <ThumbsUp className='h-3.5 w-3.5' />
                                                {outage?.upvotes ?? 0}
                                            </span>
                                            <span className='inline-flex items-center gap-1.5'>
                                                <ThumbsDown className='h-3.5 w-3.5' />
                                                {outage?.downvotes ?? 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {outage?.description && (
                                    <p className='text-sm text-base-content/80 line-clamp-2 mb-3'>
                                        {outage.description}
                                    </p>
                                )}

                                <div className='flex flex-col gap-2 mt-auto pt-3 border-t border-base-content/10'>
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <button
                                            type='button'
                                            className='btn btn-sm btn-ghost gap-1.5'
                                            onClick={() => navigate('/map', { state: { selectedOutage: outage._id } })}
                                        >
                                            <MapPinned className='h-4 w-4' />
                                            View on Map
                                        </button>

                                        {hasVoted ? (
                                            <span className='badge badge-info badge-sm gap-1'>
                                                <ThumbsUp className='h-3 w-3' />
                                                Already Voted
                                            </span>
                                        ) : !isOwnReport ? (
                                            <>
                                                <button
                                                    type='button'
                                                    className='btn btn-sm btn-primary gap-1.5'
                                                    onClick={() => verifyOutage({
                                                        _id: outage._id,
                                                        type: 'upvote',
                                                        xCoordinate: authUser.homeLocation.coordinates[0],
                                                        yCoordinate: authUser.homeLocation.coordinates[1]
                                                    })}
                                                >
                                                    <ThumbsUp className='h-4 w-4' />
                                                    Upvote
                                                </button>
                                                <button
                                                    type='button'
                                                    className='btn btn-sm btn-error gap-1.5'
                                                    onClick={() => verifyOutage({
                                                        _id: outage._id,
                                                        type: 'downvote',
                                                        xCoordinate: authUser.homeLocation.coordinates[0],
                                                        yCoordinate: authUser.homeLocation.coordinates[1]
                                                    })}
                                                >
                                                    <ThumbsDown className='h-4 w-4' />
                                                    Downvote
                                                </button>
                                            </>
                                        ) : null}
                                    </div>

                                    {outage?.status === "confirmed" && !isOwnReport && (
                                        <div className='flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-base-content/10'>
                                            <span className='text-xs text-base-content/70'>
                                                {3 - (outage?.resolutionConfirmations?.length || 0)}/3 confirmations needed
                                            </span>
                                            {hasConfirmedResolution ? (
                                                <span className='badge badge-success badge-sm gap-1'>
                                                    <CheckCircle2 className='h-3 w-3' />
                                                    Resolution Confirmed
                                                </span>
                                            ) : (
                                                <button
                                                    type='button'
                                                    className='btn btn-success btn-sm gap-1.5'
                                                    onClick={() => resolveOutage({
                                                        _id: outage._id,
                                                        xCoordinate: authUser.homeLocation.coordinates[0],
                                                        yCoordinate: authUser.homeLocation.coordinates[1]
                                                    })}
                                                >
                                                    <CheckCircle2 className='h-4 w-4' />
                                                    Confirm Resolution
                                                </button>
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

export default StatusCards