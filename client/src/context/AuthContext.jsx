import { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load user from localStorage on mount
        try {
            const userStr = localStorage.getItem('user')
            if (userStr) {
                const user = JSON.parse(userStr)
                setAuthUser(user)
            }
        } catch (error) {
            console.error('Error loading user from localStorage:', error)
            localStorage.removeItem('user')
        } finally {
            setLoading(false)
        }
    }, [])

    // Wrapper to also save to localStorage when setting auth user
    const updateAuthUser = (user) => {
        setAuthUser(user)
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }
    }

    const value = {
        authUser,
        setAuthUser: updateAuthUser,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}