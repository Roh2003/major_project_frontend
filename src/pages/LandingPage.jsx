"use client"

import { motion } from "framer-motion"
import { BookOpen, GraduationCap, Shield, UserCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const LandingPage = () => {
  const navigate = useNavigate()

  const loginOptions = [
    {
      type: "admin",
      title: "Admin Login",
      description: "Manage platform and content",
      icon: Shield,
      color: "from-primary to-primary-dark",
      route: "/login?type=admin"
    },
    {
      type: "tutor",
      title: "Tutor Portal",
      description: "Upload courses & earn",
      icon: GraduationCap,
      color: "from-secondary to-secondary-dark",
      route: "/login?type=tutor"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-white flex items-center justify-center overflow-hidden p-4">
      {/* Animated Background Elements */}
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
        className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
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
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
      />

      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl"
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent">
            SkillUp
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary mb-4">
            Empowering Learning, Transforming Lives
          </p>
          <p className="text-sm md:text-base text-text-muted">
            Choose your portal to get started
          </p>
        </motion.div>

        {/* Login Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {loginOptions.map((option, index) => (
            <motion.div
              key={option.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate(option.route)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl p-8 border-2 border-border hover:border-primary transition-all duration-300 shadow-lg hover:shadow-2xl">
                <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                  {option.title}
                </h3>
                
                <p className="text-text-secondary mb-4">
                  {option.description}
                </p>

                <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-4 transition-all">
                  <span>Get Started</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* New Tutor Signup CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-text-secondary mb-4">
            Want to teach and earn money?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/tutor/signup")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <UserCircle className="w-5 h-5" />
            Join as a Tutor
          </motion.button>
        </motion.div>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center justify-center gap-8 mt-16"
        >
          {[
            { icon: BookOpen, label: "Quality Courses" },
            { icon: GraduationCap, label: "Expert Tutors" },
            { icon: Shield, label: "Secure Platform" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-border shadow">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-text-muted">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage
