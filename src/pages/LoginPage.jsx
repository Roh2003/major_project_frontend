"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Mail, Lock, ArrowRight, Shield, ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate, useSearchParams } from "react-router-dom"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import AdminService from "../services/admin.service"
import TutorService from "../services/tutor.service"

const LoginPage = ({ onLogin, onTutorLogin }) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loginType = searchParams.get("type") || "admin" // admin or tutor
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      if (loginType === "tutor") {
        // Tutor Login
        const response = await TutorService.tutorLogin({ email, password })
        const data = response.data
        localStorage.setItem('tutorToken', data.data.authToken)
        localStorage.setItem('tutorUser', JSON.stringify(data.data.tutor))
        
        toast.success(`Welcome back, ${data.data.tutor.firstName || 'Tutor'}!`)
        // onTutorLogin(data.data.authToken)
        navigate('/tutor/dashboard')
      } else {
        // Admin Login
        const response = await AdminService.adminLogin({ email, password })
        const data = response.data
        localStorage.setItem('adminToken', data.data.authToken)
        localStorage.setItem('adminUser', JSON.stringify(data.data.user))
        
        toast.success(`Welcome back, ${data.data.user.firstName || 'Admin'}!`)
        onLogin(data.data.authToken)
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${
                loginType === "tutor" ? "from-secondary to-secondary-dark" : "from-primary to-accent"
              } rounded-2xl mb-4 shadow-lg`}
            >
              {loginType === "tutor" ? (
                <GraduationCap className="w-10 h-10 text-white" />
              ) : (
                <Shield className="w-10 h-10 text-white" />
              )}
            </motion.div>

            <h1 className={`text-3xl font-bold mb-2 ${
              loginType === "tutor" ? "text-secondary" : "text-primary"
            }`}>
              {loginType === "tutor" ? "Tutor Login" : "Admin Login"}
            </h1>
            <p className="text-text-secondary">
              {loginType === "tutor" ? "Sign in to manage your courses" : "Sign in to your dashboard"}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder={loginType === "tutor" ? "tutor@example.com" : "admin@skillup.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} icon={ArrowRight}>
              Sign In
            </Button>
          </form>

          {/* Footer Links */}
          {loginType === "tutor" && (
            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/tutor/signup")}
                  className="text-secondary font-semibold hover:underline"
                >
                  Sign up as Tutor
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted text-sm mt-6">© 2025 SkillUp. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

export default LoginPage
