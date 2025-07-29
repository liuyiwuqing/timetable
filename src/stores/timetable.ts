import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Course, TimetableCell, TimetableConfig, Theme, TimeSlot } from '@/types'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'

export const useTimetableStore = defineStore('timetable', () => {
  // 状态
  const courses = ref<Course[]>([
    { id: '1', name: '语文', color: '#ef4444' },
    { id: '2', name: '数学', color: '#3b82f6' },
    { id: '3', name: '英语', color: '#10b981' },
    { id: '4', name: '物理', color: '#f59e0b' },
    { id: '5', name: '化学', color: '#8b5cf6' },
    { id: '6', name: '生物', color: '#06b6d4' },
    { id: '7', name: '历史', color: '#f97316' },
    { id: '8', name: '地理', color: '#84cc16' }
  ])

  const config = ref<TimetableConfig>({
    title: '课程表',
    morningPeriods: 4,
    afternoonPeriods: 4,
    eveningPeriods: 2,
    timeSlots: [
      { id: '1', period: 1, timeRange: '08:00-08:45', type: 'morning' },
      { id: '2', period: 2, timeRange: '08:55-09:40', type: 'morning' },
      { id: '3', period: 3, timeRange: '10:00-10:45', type: 'morning' },
      { id: '4', period: 4, timeRange: '10:55-11:40', type: 'morning' },
      { id: '5', period: 5, timeRange: '14:30-15:15', type: 'afternoon' },
      { id: '6', period: 6, timeRange: '15:25-16:10', type: 'afternoon' },
      { id: '7', period: 7, timeRange: '16:30-17:15', type: 'afternoon' },
      { id: '8', period: 8, timeRange: '17:25-18:10', type: 'afternoon' },
      { id: '9', period: 9, timeRange: '19:00-19:45', type: 'evening' },
      { id: '10', period: 10, timeRange: '19:55-20:40', type: 'evening' }
    ]
  })

  const timetable = ref<TimetableCell[]>([])
  const currentTheme = ref<string>('default')

  const themes = ref<Theme[]>([
    {
      id: 'default',
      name: '默认蓝色',
      colors: {
        primary: '#4f46e5',
        secondary: '#e5e7eb',
        background: '#ffffff',
        text: '#1f2937',
        border: '#d1d5db'
      }
    },
    {
      id: 'green',
      name: '清新绿色',
      colors: {
        primary: '#059669',
        secondary: '#d1fae5',
        background: '#f0fdf4',
        text: '#065f46',
        border: '#a7f3d0'
      }
    },
    {
      id: 'purple',
      name: '优雅紫色',
      colors: {
        primary: '#7c3aed',
        secondary: '#e9d5ff',
        background: '#faf5ff',
        text: '#581c87',
        border: '#c4b5fd'
      }
    },
    {
      id: 'orange',
      name: '活力橙色',
      colors: {
        primary: '#ea580c',
        secondary: '#ffedd5',
        background: '#fff7ed',
        text: '#7c2d12',
        border: '#fed7aa'
      }
    },
    {
      id: 'dark',
      name: '深色模式',
      colors: {
        primary: '#8b5cf6',
        secondary: '#4b5563',
        background: '#111827',
        text: '#f9fafb',
        border: '#6b7280'
      }
    }
  ])

  // 计算属性
  const totalPeriods = computed(() => 
    config.value.morningPeriods + config.value.afternoonPeriods + config.value.eveningPeriods
  )

  const weekDays = computed(() => ['周一', '周二', '周三', '周四', '周五'])

  const currentThemeColors = computed(() => 
    themes.value.find(theme => theme.id === currentTheme.value)?.colors || themes.value[0].colors
  )

  // 方法
  const initializeTimetable = () => {
    timetable.value = []
    for (let day = 1; day <= 5; day++) {
      for (let period = 1; period <= totalPeriods.value; period++) {
        timetable.value.push({
          id: `${day}-${period}`,
          day,
          period,
          course: null
        })
      }
    }
  }

  const addCourse = (name: string, color: string) => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name,
      color
    }
    courses.value.push(newCourse)
  }

  const removeCourse = (courseId: string) => {
    courses.value = courses.value.filter(course => course.id !== courseId)
    // 同时从课表中移除该课程
    timetable.value.forEach(cell => {
      if (cell.course?.id === courseId) {
        cell.course = null
      }
    })
  }

  const setCourse = (day: number, period: number, course: Course | null) => {
    const cell = timetable.value.find(c => c.day === day && c.period === period)
    if (cell) {
      cell.course = course
    }
  }

  const randomAssignCourses = () => {
    // 清空当前课表
    timetable.value.forEach(cell => {
      cell.course = null
    })

    // 随机分配课程
    const availableCourses = [...courses.value]
    timetable.value.forEach(cell => {
      if (Math.random() > 0.3 && availableCourses.length > 0) { // 70%概率分配课程
        const randomIndex = Math.floor(Math.random() * availableCourses.length)
        cell.course = availableCourses[randomIndex]
      }
    })
  }

  const exportToExcel = () => {
    const data: any[][] = []
    
    // 表头
    const header = ['时间', ...weekDays.value]
    data.push(header)

    // 数据行
    for (let period = 1; period <= totalPeriods.value; period++) {
      const timeSlot = config.value.timeSlots.find(slot => slot.period === period)
      const row = [timeSlot?.timeRange || `第${period}节`]
      
      for (let day = 1; day <= 5; day++) {
        const cell = timetable.value.find(c => c.day === day && c.period === period)
        row.push(cell?.course?.name || '')
      }
      data.push(row)
    }

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '课程表')
    XLSX.writeFile(wb, `${config.value.title}.xlsx`)
  }

  const exportToImage = async () => {
    const element = document.getElementById('timetable-container')
    if (element) {
      const canvas = await html2canvas(element)
      const link = document.createElement('a')
      link.download = `${config.value.title}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const updateConfig = (newConfig: Partial<TimetableConfig>) => {
    config.value = { ...config.value, ...newConfig }
    // 重新生成时间段
    generateTimeSlots()
    // 重新初始化课表
    initializeTimetable()
  }

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = []
    let period = 1

    // 上午时间段
    for (let i = 0; i < config.value.morningPeriods; i++) {
      slots.push({
        id: period.toString(),
        period,
        timeRange: `${8 + Math.floor(i * 0.75)}:${(i % 2) * 50 + (i < 2 ? 0 : 10)}0-${8 + Math.floor(i * 0.75)}:${(i % 2) * 50 + 45 + (i < 2 ? 0 : 10)}`,
        type: 'morning'
      })
      period++
    }

    // 下午时间段
    for (let i = 0; i < config.value.afternoonPeriods; i++) {
      slots.push({
        id: period.toString(),
        period,
        timeRange: `${14 + Math.floor(i * 0.75)}:${30 + (i % 2) * 50 + (i < 2 ? 0 : 10)}-${14 + Math.floor(i * 0.75)}:${15 + (i % 2) * 50 + (i < 2 ? 0 : 10)}`,
        type: 'afternoon'
      })
      period++
    }

    // 晚自习时间段
    for (let i = 0; i < config.value.eveningPeriods; i++) {
      slots.push({
        id: period.toString(),
        period,
        timeRange: `${19 + Math.floor(i * 0.75)}:${(i % 2) * 50}0-${19 + Math.floor(i * 0.75)}:${45 + (i % 2) * 50}`,
        type: 'evening'
      })
      period++
    }

    config.value.timeSlots = slots
  }

  // 初始化
  initializeTimetable()

  return {
    courses,
    config,
    timetable,
    currentTheme,
    themes,
    totalPeriods,
    weekDays,
    currentThemeColors,
    addCourse,
    removeCourse,
    setCourse,
    randomAssignCourses,
    exportToExcel,
    exportToImage,
    updateConfig,
    initializeTimetable
  }
})