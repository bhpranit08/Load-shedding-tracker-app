import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const getAuthHeaders = () => {
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    
    return {
        "Content-Type": "application/json",
        ...(user?.token && { "Authorization": `Bearer ${user.token}` })
    }
}

const useGetOutages = () => {
    const [loading, setLoading] = useState(false)
    const [outages, setOutages] = useState()
    const [ownReports, setOwnReports] = useState()
    const [allReports, setAllReports] = useState()

    const { authUser } = useAuthContext()

    const getOutages = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/outage/nearby?xCoordinate=${authUser?.homeLocation?.coordinates[0]}&yCoordinate=${authUser?.homeLocation?.coordinates[1]}`, {
                method: "GET",
                headers: getAuthHeaders(),
            })

            const data = await response.json()

            if (response.status !== 200) {
                toast.error(data.message)
                return
            }

            setOutages(data.reports)
            setOwnReports(data.ownReports)
            setAllReports(data.allReports)
        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (authUser) {
            getOutages()
        }
    }, [authUser])

    return { loading, outages, getOutages, ownReports, allReports }
}

const useReportOutage = (getOutages) => {
    const [loading, setLoading] = useState(false)

    const reportOutage = async (outage) => {
        setLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/outage`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({outage})
            })

            const data = await response.json()

            if (response.status !== 201) {
                toast.error(data.message)
                return
            }

            toast.success(data.message)
            await getOutages()
            return true
        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, reportOutage }
}

const useVerifyOutage = (getOutages) => {
    const [loading, setLoading] = useState(false)

    const verifyOutage = async (outage) => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/outage/${outage._id}/verify`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({outage})
            })

            const data = await response.json()

            if (response.status !== 201) {
                toast.error(data.message)
                return
            }

            toast.success(data.message)

            await getOutages()
        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, verifyOutage }
}

const useResolveOutage = (getOutages) => {
    const [loading, setLoading] = useState(false)

    const resolveOutage = async (outage) => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/outage/${outage._id}/resolve`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({outage})
            })

            const data = await response.json()

            if (response.status !== 201) {
                toast.error(data.message)
                return
            }

            toast.success(data.message)

            await getOutages()
        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, resolveOutage }
}

export { useReportOutage, useVerifyOutage, useResolveOutage, useGetOutages }