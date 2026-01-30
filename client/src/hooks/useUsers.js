import toast from "react-hot-toast"
import React, { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

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

            if (response.ok) {
                toast.success("User created successfully")
            } else {
                toast.error("Intenal server error.")
            }
        } catch (err) {
            console.error(err.message)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { register, loading }
}

export const useUserLogin = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()
    const navigate = useNavigate()

    const loginUser = async (user) => {
        setLoading(true)
        try {
            const response = await fetch(`/api/user/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user })
            })

            const data = await response.json()

            if (!response.ok || data.message) {
                toast.error(data.message || 'Login failed')
                return
            }

            localStorage.setItem("user-load-shedding", JSON.stringify(data))
            setAuthUser(data)
            navigate("/map")
        } catch (err) {
            console.error(err.message)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, loginUser }
}