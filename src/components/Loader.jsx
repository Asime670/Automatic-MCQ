import React from 'react';
import { motion } from 'framer-motion';
export default function Loader() {
  return (
    <div className="flex items-center justify-center h-full w-full p-8">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );
}