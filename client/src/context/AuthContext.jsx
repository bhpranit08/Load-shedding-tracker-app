import { useContext, useState, createContext, useEffect } from "react";

export const AuthContext = createContext()

export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem('user'))
    )

    useEffect(() => {
        let isMounted = true
        const checkSession = async () => {
            if (!authUser) return
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, { credentials: 'include' })
                if (!res.ok) {
                    localStorage.removeItem('user')
                    if (isMounted) setAuthUser(null)
                } else {
                    const data = await res.json()
                    localStorage.setItem('user', JSON.stringify(data))
                    if (isMounted) setAuthUser(data)
                }
            } catch (e) {
                localStorage.removeItem('user')
                if (isMounted) setAuthUser(null)
            }
        }
        checkSession()
        return () => { isMounted = false }
    }, [])

    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    )
}