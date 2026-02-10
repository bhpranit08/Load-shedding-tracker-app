import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

const useLogin = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()
    const navigate = useNavigate()

    const login = async (user) => {
        if (!user.email || !user.password) {
            toast.error('Please enter all the fields')
            return
        }

        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({user})
            })

            const data = await response.json()

            if (response.status !== 201) {
                toast.error(data.message || 'Error signing in')
                return
            }

            localStorage.setItem("user", JSON.stringify(data))
            setAuthUser(data)
            
            navigate("/home")
            toast.success('Logged In Successfully')

        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return { login, loading }
}

const useRegister = () => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const register = async (user) => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({user})
            })

            const data = await response.json()

            if (response.status !== 201) {
                toast.error(data.message)
                return
            }

            toast.success("Account created successfully: Please login")
            navigate("/login")

        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, register }
}

const useLogout = () => {
    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const logout = async() => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/logout`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
            })

            if (response.status !== 201) {
                toast.error('Error logging out')
                return
            }

            localStorage.removeItem("user")
            setAuthUser(null)

        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return { loading, logout }
}

export { useLogin, useRegister, useLogout }