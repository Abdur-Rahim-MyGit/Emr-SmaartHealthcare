import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const Chart = ({ data, type = 'line', height = 200, color = '#004d99' }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    if (type === 'line') {
      drawLineChart(ctx, data, width, height, color)
    } else if (type === 'bar') {
      drawBarChart(ctx, data, width, height, color)
    } else if (type === 'doughnut') {
      drawDoughnutChart(ctx, data, width, height)
    }
  }, [data, type, color])

  const drawLineChart = (ctx, data, width, height, color) => {
    if (!data || data.length === 0) return

    const padding = 40
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    const maxValue = Math.max(...data.map(d => d.value))
    const minValue = Math.min(...data.map(d => d.value))
    const valueRange = maxValue - minValue

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw line
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    ctx.fillStyle = color
    data.forEach((point, index) => {
      const x = padding + (chartWidth / (data.length - 1)) * index
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const drawBarChart = (ctx, data, width, height, color) => {
    if (!data || data.length === 0) return

    const padding = 40
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    const maxValue = Math.max(...data.map(d => d.value))
    const barWidth = chartWidth / data.length * 0.8
    const barSpacing = chartWidth / data.length

    data.forEach((point, index) => {
      const barHeight = (point.value / maxValue) * chartHeight
      const x = padding + barSpacing * index + (barSpacing - barWidth) / 2
      const y = padding + chartHeight - barHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, color + '80')

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)
    })
  }

  const drawDoughnutChart = (ctx, data, width, height) => {
    if (!data || data.length === 0) return

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20
    const innerRadius = radius * 0.6

    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -Math.PI / 2

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI

      // Draw slice
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
      ctx.closePath()

      ctx.fillStyle = item.color || `hsl(${index * 60}, 70%, 50%)`
      ctx.fill()

      currentAngle += sliceAngle
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={height}
        className="w-full h-full"
      />
    </motion.div>
  )
}

export default Chart
