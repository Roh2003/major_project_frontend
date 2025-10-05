"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "right",
  onClick,
  type = "button",
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-primary-dark text-white hover:from-primary-dark hover:to-primary shadow-lg hover:shadow-xl focus:ring-primary",
    secondary: "bg-surface-light text-text-primary hover:bg-border border border-border focus:ring-border",
    success: "bg-success text-white hover:bg-accent-dark shadow-lg hover:shadow-xl focus:ring-success",
    danger: "bg-error text-white hover:bg-red-600 shadow-lg hover:shadow-xl focus:ring-error",
    ghost: "text-text-secondary hover:bg-surface-light hover:text-text-primary focus:ring-border",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  const widthClass = fullWidth ? "w-full" : ""

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
    </motion.button>
  )
}

export default Button
