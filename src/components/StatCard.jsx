import React from 'react';
import { motion } from 'framer-motion';
export default function StatCard({ title, value, icon: Icon, colorClass }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex items-center border border-gray-100 dark:border-gray-700">
      <div className={`p-4 rounded-full ${colorClass} mr-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );
}