import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChartLine, FaChartBar, FaChartPie, FaDownload, FaFilter, FaCalendarAlt } from 'react-icons/fa'
import Chart from './Chart'

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')

  const healthData = [
    { label: 'Jan', value: 85 },
    { label: 'Feb', value: 88 },
    { label: 'Mar', value: 92 },
    { label: 'Apr', value: 89 },
    { label: 'May', value: 95 },
    { label: 'Jun', value: 98 }
  ]

  const appointmentData = [
    { label: 'Mon', value: 3 },
    { label: 'Tue', value: 5 },
    { label: 'Wed', value: 2 },
    { label: 'Thu', value: 7 },
    { label: 'Fri', value: 4 },
    { label: 'Sat', value: 1 },
    { label: 'Sun', value: 0 }
  ]

  const healthDistribution = [
    { label: 'Excellent', value: 45, color: '#10b981' },
    { label: 'Good', value: 35, color: '#3b82f6' },
    { label: 'Fair', value: 15, color: '#f59e0b' },
    { label: 'Poor', value: 5, color: '#ef4444' }
  ]

  const metrics = [
    {
      title: 'Health Score Trend',
      value: '98%',
      change: '+5%',
      changeType: 'positive',
      chart: <Chart data={healthData} type="line" color="#004d99" height={120} />
    },
    {
      title: 'Weekly Appointments',
      value: '22',
      change: '+12%',
      changeType: 'positive',
      chart: <Chart data={appointmentData} type="bar" color="#42a89b" height={120} />
    },
    {
      title: 'Health Distribution',
      value: '85%',
      change: '+3%',
      changeType: 'positive',
      chart: <Chart data={healthDistribution} type="doughnut" height={120} />
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { id: 'health', label: 'Health Metrics', icon: <FaChartBar /> },
    { id: 'appointments', label: 'Appointments', icon: <FaChartPie /> }
  ]

  const timeRanges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
    { id: '1y', label: '1 Year' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Health Analytics
            </h1>
            <p className="text-gray-600 mt-1">Track your health progress and insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2"
            >
              <FaFilter className="w-4 h-4" />
              <span>Filter</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center space-x-2"
            >
              <FaDownload className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaCalendarAlt />
            <span>Time Range:</span>
          </div>
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <motion.button
                key={range.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                  timeRange === range.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white/50 text-gray-600 hover:bg-white/70'
                }`}
              >
                {range.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-xl p-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white shadow-lg text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="dashboard-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{metric.title}</h3>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{metric.change}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">{metric.value}</div>
            <div className="h-32">
              {metric.chart}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="dashboard-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Health Score Trend</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Health Score</span>
            </div>
          </div>
          <div className="h-64">
            <Chart data={healthData} type="line" color="#004d99" height={256} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-gray-500">Current</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">+5%</div>
              <div className="text-sm text-gray-500">This Month</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <div className="text-sm text-gray-500">Average</div>
            </div>
          </div>
        </motion.div>

        {/* Appointment Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="dashboard-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Appointment Distribution</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span>Appointments</span>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center">
            <Chart data={healthDistribution} type="doughnut" height={256} />
          </div>
          <div className="mt-4 space-y-2">
            {healthDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="dashboard-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Health Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Consistent Improvement',
              description: 'Your health score has been steadily improving over the past 6 months.',
              icon: '📈',
              color: 'text-green-600'
            },
            {
              title: 'Regular Checkups',
              description: 'You\'ve maintained regular appointments with your healthcare providers.',
              icon: '🏥',
              color: 'text-blue-600'
            },
            {
              title: 'Active Lifestyle',
              description: 'Your activity levels are contributing positively to your overall health.',
              icon: '💪',
              color: 'text-purple-600'
            }
          ].map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30"
            >
              <div className="text-2xl mb-2">{insight.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Analytics
