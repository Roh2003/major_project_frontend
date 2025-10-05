"use client"

import { motion } from "framer-motion"
import { BookOpen, GraduationCap, Target, Users } from "lucide-react"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative"
      >
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl"
        />

        {/* Logo and Brand */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl"
            >
              <GraduationCap className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-primary-light via-primary to-accent bg-clip-text text-transparent">
            SkillUp
          </h1>

          <p className="text-2xl text-text-secondary mb-8">Empowering Learning, Transforming Lives</p>
        </motion.div>

        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-8 mt-12 relative z-10"
        >
          {[
            { icon: BookOpen, label: "Courses" },
            { icon: Users, label: "Community" },
            { icon: Target, label: "Goals" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 bg-surface rounded-xl flex items-center justify-center border border-border shadow-lg">
                <item.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="text-sm text-text-muted">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 relative z-10"
        >
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-primary rounded-full"
              />
            ))}
          </div>
          <p className="text-text-muted mt-4 text-sm">Loading your dashboard...</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LandingPage
