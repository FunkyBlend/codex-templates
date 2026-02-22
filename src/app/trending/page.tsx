'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateTrendingData, topCountries, components } from '@/lib/data';
import { CATEGORIES, getCategoryInfo } from '@/lib/types';
import { TrendingUp, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

type TimeRange = 'today' | 'week' | 'month';

export default function TrendingPage() {
  const [range, setRange] = useState<TimeRange>('week');

  const chartData = useMemo(() => generateTrendingData(range), [range]);

  const trendingByCategory = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catComponents = components
        .filter(c => c.category === cat.slug)
        .sort((a, b) => b.downloads - a.downloads)
        .slice(0, 3);
      return { category: cat, components: catComponents };
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <TrendingUp className="w-6 h-6 text-accent-green" />
        <h1 className="text-2xl font-bold text-dark-text">Trending</h1>
      </div>
      <p className="text-dark-muted text-sm mb-8">Download trends and popular templates across the ecosystem</p>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6 mb-8 bg-[#0d1117] border-gray-800 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-green/5 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h2 className="font-semibold text-dark-text">Cumulative Downloads</h2>
          <div className="flex gap-1 bg-dark-bg rounded-lg p-1">
            {(['today', 'week', 'month'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${range === r
                  ? 'bg-accent-green text-white'
                  : 'text-dark-muted hover:text-dark-text'
                  }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10a37f" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10a37f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="date" stroke="#8b949e" fontSize={12} />
              <YAxis stroke="#8b949e" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: '8px',
                  color: '#e6edf3',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="downloads"
                stroke="#10a37f"
                fillOpacity={1}
                fill="url(#colorDownloads)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <h2 className="font-semibold text-dark-text mb-4">Trending by Category</h2>
          <div className="space-y-6">
            {trendingByCategory.map(({ category, components: comps }) => (
              <div key={category.slug} className="card p-4">
                <h3 className="font-medium text-dark-text text-sm mb-3 flex items-center gap-2">
                  <span>{category.emoji}</span> {category.name}
                </h3>
                <div className="space-y-2">
                  {comps.map((comp, i) => (
                    <div key={comp.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-3">
                        <span className="text-dark-muted text-xs font-mono w-4">#{i + 1}</span>
                        <span className="text-dark-text text-sm">{comp.name}</span>
                      </div>
                      <span className="text-dark-muted text-xs font-mono">
                        {(comp.downloads / 1000).toFixed(1)}k
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Countries */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="font-semibold text-dark-text mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" /> Top Countries
          </h2>
          <div className="card p-4">
            <div className="space-y-3">
              {topCountries.map((country, i) => (
                <div key={country.code} className="flex items-center gap-3">
                  <span className="text-dark-muted text-xs font-mono w-4">#{i + 1}</span>
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-dark-text text-sm">{country.country}</span>
                      <span className="text-dark-muted text-xs font-mono">
                        {(country.downloads / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <div className="h-1.5 bg-dark-bg rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-green rounded-full"
                        style={{ width: `${(country.downloads / topCountries[0].downloads) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
