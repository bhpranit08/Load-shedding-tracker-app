import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import axios from 'axios'

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
            const response = await axios.post('/api/user/login', {
                user
            })

            if (response.status !== 201) {
                toast.error(response.data.message || 'Error signing in')
                return
            }

            localStorage.setItem("user", JSON.stringify(response.data))
            setAuthUser(response.data)
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
            const response = await axios.post('/api/user/register', {
                user
            })

            if (response.error) {
                toast.error(response.message)
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

    return {  loading, register }
}

export { useLogin, useRegister }