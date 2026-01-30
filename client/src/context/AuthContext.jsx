import { useContext, useState, createContext, useEffect } from "react";

export const AuthContext = createContext()

export const useAuthContext = () => {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem('user-load-shedding'))
    )

    useEffect(() => {
        let isMounted = true
        const checkSession = async () => {
            if (!authUser) return
            try {
                const response = await fetch(`/api/user/me`, {
                    method: "POST",
                    credentials: 'include'
                })
                if(!response.ok) {
                    localStorage.removeItem("user-load-shedding")
                    if (isMounted) setAuthUser(null)
                } else {
                    const data = await response.json()
                    localStorage.setItem('user-load-shedding', JSON.stringify(data))
                    if (isMounted) setAuthUser(data)
                }
            } catch (err) {
                localStorage.removeItem('user-load-shedding')
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