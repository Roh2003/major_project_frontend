"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, color = "primary" }) => {
  const isPositive = trend >= 0

  const colorClasses = {
    primary: "from-primary/20 to-primary/5 border-primary/30",
    success: "from-success/20 to-success/5 border-success/30",
    info: "from-info/20 to-info/5 border-info/30",
    accent: "from-accent/20 to-accent/5 border-accent/30",
  }

  const iconColorClasses = {
    primary: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    info: "bg-info/20 text-info",
    accent: "bg-accent/20 text-accent",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${iconColorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>

        {trend !== undefined && (
          <div className={`flex items-center gap-1 ${isPositive ? "text-success" : "text-error"}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-text-muted text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-text-primary mb-1">{value}</h3>
        {trendLabel && <p className="text-xs text-text-muted">{trendLabel}</p>}
      </div>
    </motion.div>
  )
}

export default StatCard
