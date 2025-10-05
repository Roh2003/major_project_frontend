"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"
import { toast } from "react-toastify"
import Button from "../components/common/Button"
import Input from "../components/common/Input"

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Demo credentials
      if (email === "admin@skillup.com" && password === "admin123") {
        toast.success("Login successful! Welcome back.")
        onLogin("demo-auth-token-12345")
      } else {
        toast.error("Invalid credentials. Try admin@skillup.com / admin123")
      }
      setLoading(false)
    }, 1500)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()

    if (!recoveryEmail) {
      toast.error("Please enter your recovery email")
      return
    }

    setLoading(true)

    setTimeout(() => {
      toast.success("Password recovery email sent! Check your inbox.")
      setShowForgotPassword(false)
      setRecoveryEmail("")
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
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
        {/* Card */}
        <div className="bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-border p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg"
            >
              <GraduationCap className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
              SkillUp Admin
            </h1>
            <p className="text-text-secondary">
              {showForgotPassword ? "Recover Your Password" : "Sign in to your dashboard"}
            </p>
          </div>

          {/* Demo Credentials Info */}
          {!showForgotPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-info/10 border border-info/20 rounded-lg flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-text-secondary">
                  <span className="font-semibold text-info">Demo Credentials:</span>
                </p>
                <p className="text-text-muted">Email: admin@skillup.com</p>
                <p className="text-text-muted">Password: admin123</p>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@skillup.com"
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border bg-surface-light text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-text-secondary">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:text-primary-light transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <Button type="submit" variant="primary" fullWidth loading={loading} icon={ArrowRight}>
                Sign In
              </Button>
            </form>
          ) : (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <Input
                label="Recovery Email"
                type="email"
                placeholder="Enter your email address"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                icon={Mail}
                required
              />

              <div className="flex gap-3">
                <Button type="button" variant="secondary" fullWidth onClick={() => setShowForgotPassword(false)}>
                  Back to Login
                </Button>
                <Button type="submit" variant="primary" fullWidth loading={loading}>
                  Submit
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted text-sm mt-6">© 2025 SkillUp. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

export default LoginPage
