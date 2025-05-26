import React from "react"
import { useLocation } from "react-router-dom"
import AuthForm from "../../components/auth/AuthForm"

export default function AuthPage() {
  const { pathname } = useLocation()
  const mode = pathname.includes("registro") ? "register" : "login"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <AuthForm mode={mode} />
      </div>
    </div>
  )
}
