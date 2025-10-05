"use client"

import { motion } from "framer-motion"

const Table = ({ columns, data, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface border border-border rounded-xl shadow-lg overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface-light">
              {columns.map((column) => (
                <th key={column.key} className="text-left py-4 px-6 text-sm font-semibold text-text-secondary">
                  {column.label}
                </th>
              ))}
              {actions && <th className="text-right py-4 px-6 text-sm font-semibold text-text-secondary">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-12 text-text-muted">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-surface-light transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="py-4 px-6 text-sm text-text-primary">
                      {row[column.key]}
                    </td>
                  ))}
                  {actions && <td className="py-4 px-6 text-right">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default Table
