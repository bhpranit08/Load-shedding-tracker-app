import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { useLogin } from "../hooks/useAuth"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { loading, login } = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login({ email, password })

        setEmail('')
        setPassword('')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold">PowerTrack</h1>
                        <p className="text-base-content/60 mt-2">Welcome back</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-control mt-4">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="input input-bordered w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Signing in
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="divider">OR</div>

                    <div className="text-center">
                        <p className="text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="link link-primary">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login