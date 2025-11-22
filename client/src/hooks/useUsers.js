import toast from "react-hot-toast"
import React, { useState } from "react"

export const useRegister = () => {
    const [loading, setLoading] = useState(false)

    const register = async(user) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/user/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user })
            })

            const data = await response.json()
            console.log(data)

            localStorage.setItem("user", data)
        } catch (err) {
            console.error(err.message)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { register, loading }
}