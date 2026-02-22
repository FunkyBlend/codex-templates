'use client';

import Link from 'next/link';
import { companies } from '@/lib/data';
import { motion } from 'framer-motion';

export default function CompaniesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-dark-text mb-2">Companies</h1>
      <p className="text-dark-muted text-sm mb-8">Browse all {companies.length} companies with Codex integrations</p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Link
              href={`/companies/${company.slug}`}
              className="card p-6 min-h-[160px] flex flex-col justify-center hover:border-accent-green/50 group bg-[#0d1117] shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-accent-green/0 to-emerald-500/0 group-hover:from-accent-green/5 group-hover:to-emerald-500/5 transition-all duration-500 blur-xl"></div>
              <span className="text-4xl mb-4 block relative z-10">{company.icon}</span>
              <h3 className="font-bold text-white text-sm mb-2 group-hover:text-accent-green transition-colors relative z-10">
                {company.name}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed relative z-10">{company.description}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
