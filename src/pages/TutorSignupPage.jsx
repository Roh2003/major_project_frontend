"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { GraduationCap, Mail, Lock, User, Phone, BookOpen, Award, ArrowRight, ArrowLeft } from "lucide-react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import TutorService from "../services/tutor.service"

const TutorSignupPage = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNo: "",
    bio: "",
    specialization: "",
    experience: "",
    qualification: ""
  })
  
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.firstName || !formData.email || !formData.username || !formData.password) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      const signupData = {
        ...formData,
        experience: formData.experience ? parseInt(formData.experience) : undefined
      }
      delete signupData.confirmPassword

      await TutorService.tutorSignup(signupData)
      
      toast.success("Account created successfully! Please login.")
      navigate("/login?type=tutor")
    } catch (error) {
      console.error('Signup error:', error)
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.')
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
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex items-center gap-2 text-text-secondary hover:text-secondary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-border p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl mb-4 shadow-lg"
            >
              <GraduationCap className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold mb-2 text-secondary">
              Join as a Tutor
            </h1>
            <p className="text-text-secondary">
              Start uploading courses and earning money
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                type="text"
                name="firstName"
                placeholder="Rohit "
                value={formData.firstName}
                onChange={handleChange}
                icon={User}
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                icon={User}
              />
            </div>

            <Input
              label="Email Address *"
              type="email"
              name="email"
              placeholder="tutor@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <Input
              label="Username *"
              type="text"
              name="username"
              placeholder="johndoe"
              value={formData.username}
              onChange={handleChange}
              icon={User}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              name="phoneNo"
              placeholder="+1234567890"
              value={formData.phoneNo}
              onChange={handleChange}
              icon={Phone}
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password *"
                type="password"
                name="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />
              <Input
                label="Confirm Password *"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                required
              />
            </div>

            {/* Professional Information */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Professional Information</h3>
              
              <div className="space-y-4">
                <Input
                  label="Specialization"
                  type="text"
                  name="specialization"
                  placeholder="e.g., Web Development, Data Science"
                  value={formData.specialization}
                  onChange={handleChange}
                  icon={BookOpen}
                />

                <Input
                  label="Years of Experience"
                  type="number"
                  name="experience"
                  placeholder="5"
                  value={formData.experience}
                  onChange={handleChange}
                  icon={Award}
                />

                <Input
                  label="Qualification"
                  type="text"
                  name="qualification"
                  placeholder="e.g., Master's in Computer Science"
                  value={formData.qualification}
                  onChange={handleChange}
                  icon={Award}
                />

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all text-text-primary"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading} icon={ArrowRight}>
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login?type=tutor")}
                className="text-secondary font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-text-muted text-sm mt-6">© 2025 SkillUp. All rights reserved.</p>
      </motion.div>
    </div>
  )
}

export default TutorSignupPage
