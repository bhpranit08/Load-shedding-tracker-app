import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { Alert, FloatingLabel, Button } from 'flowbite-react'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const handleRegister = async (e) => {
        e.preventDefault() 
        setError(null)
        setMessage(null)
        setLoading(true)

        const { error } = await supabase.auth.signUp({ email, password })

        if (error) {
            setError(error.message)
        } else {
            setMessage('Registration successful! Please check your email to confirm your account.')
        }
        setLoading(false)
    } 

    return (
        <div className="flex justify-center">
            <form onSubmit={handleRegister} className="flex w-lg flex-col gap-4">
                <h2 className="text-2xl font-bold">Create an account</h2>
                { error && <Alert color='failure'>{error}</Alert> }
                { message && <Alert color='success'>{message}</Alert> }
                <FloatingLabel variant='standard' color='default' label='Your Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <FloatingLabel variant='standard' color='default' label='Password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type='submit'>Register</Button>
            </form>
        </div>
    )
}

export default Register 