<template>
  <div class="timetable-container" :class="{'dark-mode': currentTheme === 'dark'}" :style="themeStyles">
    <!-- 课表标题 -->
    <div class="text-center mb-6">
      <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        {{ config.title }}
      </h2>
    </div>

    <!-- 课表网格 -->
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border-2 rounded-xl overflow-hidden" :style="{ borderColor: currentThemeColors.border }">
        <!-- 表头 -->
        <thead>
          <tr>
            <th class="px-4 py-3 text-center font-semibold border-2 table-header min-w-[120px]" :style="{ borderColor: currentThemeColors.border }">
              <div class="flex items-center justify-center space-x-1">
                <i class="ri-time-line"></i>
                <span>时间</span>
              </div>
            </th>
            <th 
              v-for="(day, index) in weekDays" 
              :key="day" 
              class="px-4 py-3 text-center font-semibold border-2 table-header min-w-[120px]"
              :style="{ borderColor: currentThemeColors.border }"
            >
              <div class="flex items-center justify-center space-x-1">
                <i class="ri-calendar-2-line"></i>
                <span>{{ day }}</span>
              </div>
            </th>
          </tr>
        </thead>
        
        <!-- 表体 -->
        <tbody>
          <tr v-for="period in totalPeriods" :key="period">
            <!-- 时间列 -->
            <td class="px-4 py-3 text-center border-2 min-w-[120px]" 
                :class="{'bg-gray-50': currentTheme !== 'dark', 'bg-gray-800': currentTheme === 'dark'}"
                :style="{ borderColor: currentThemeColors.border }">
              <div class="text-sm font-medium">第{{ period }}节</div>
              <div class="text-xs text-gray-500">{{ getTimeRange(period) }}</div>
            </td>
            
            <!-- 课程单元格 -->
            <td 
              v-for="day in 5" 
              :key="`${day}-${period}`"
              class="p-2 border-2 h-16 min-w-[120px] relative"
              :style="{ borderColor: currentThemeColors.border }"
              @drop="onDrop($event, day, period)"
              @dragover.prevent="(e) => (e.currentTarget as HTMLElement).classList.add('drag-over')"
              @dragenter.prevent
              @dragleave="(e) => (e.currentTarget as HTMLElement).classList.remove('drag-over')"
            >
              <div
                v-if="getCourse(day, period)"
                class="course-item w-full h-full flex items-center justify-center text-sm font-medium border-2 cursor-move"
                :style="{ 
                  backgroundColor: getCourse(day, period)?.color + '20',
                  borderColor: getCourse(day, period)?.color,
                  color: getCourse(day, period)?.color
                }"
                draggable="true"
                @dragstart="onDragStart($event, day, period)"
              >
                <div class="flex items-center space-x-1.5">
                  <i class="ri-book-2-line"></i>
                  <span>{{ getCourse(day, period)?.name }}</span>
                </div>
              </div>
              <div
                v-else
                class="empty-cell w-full h-full flex items-center justify-center text-xs"
                :class="{'text-gray-400': currentTheme !== 'dark', 'text-gray-500': currentTheme === 'dark'}"
              >
                <div class="flex flex-col items-center opacity-60">
                  <i class="ri-drag-move-line mb-1"></i>
                  <span>拖拽课程到此处</span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 课程拖拽区域 -->
    <div class="mt-8">
      <div class="flex items-center space-x-2 mb-4">
        <i class="ri-drag-drop-line text-xl text-indigo-600"></i>
        <h4 class="text-lg font-semibold text-gray-800">可用课程（拖拽到课表中）</h4>
      </div>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="course in courses"
          :key="course.id"
          class="course-item px-4 py-2.5 text-sm font-medium border-2 cursor-move shadow-sm"
          :style="{ 
            backgroundColor: course.color + '20',
            borderColor: course.color,
            color: course.color
          }"
          draggable="true"
          @dragstart="onDragStartFromPool($event, course)"
        >
          <div class="flex items-center space-x-1.5">
            <i class="ri-book-2-line"></i>
            <span>{{ course.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTimetableStore } from '@/stores/timetable'
import type { Course } from '@/types'

const timetableStore = useTimetableStore()
const { 
  courses, 
  config, 
  timetable, 
  totalPeriods, 
  weekDays, 
  currentTheme,
  currentThemeColors 
} = storeToRefs(timetableStore)

const themeStyles = computed(() => ({
  backgroundColor: currentThemeColors.value.background,
  color: currentThemeColors.value.text
}))

const getCourse = (day: number, period: number) => {
  const cell = timetable.value.find(c => c.day === day && c.period === period)
  return cell?.course
}

const getTimeRange = (period: number) => {
  const timeSlot = config.value.timeSlots.find(slot => slot.period === period)
  return timeSlot?.timeRange || ''
}

let draggedCourse: Course | null = null
let draggedFromCell: { day: number; period: number } | null = null

const onDragStart = (event: DragEvent, day: number, period: number) => {
  const course = getCourse(day, period)
  if (course) {
    draggedCourse = course
    draggedFromCell = { day, period }
    event.dataTransfer!.effectAllowed = 'move'
  }
}

const onDragStartFromPool = (event: DragEvent, course: Course) => {
  draggedCourse = course
  draggedFromCell = null
  event.dataTransfer!.effectAllowed = 'copy'
}

const onDrop = (event: DragEvent, day: number, period: number) => {
  event.preventDefault()
  if (event.currentTarget) {
    (event.currentTarget as HTMLElement).classList.remove('drag-over')
  }
  
  if (draggedCourse) {
    // 如果是从课表中拖拽，先清空原位置
    if (draggedFromCell) {
      timetableStore.setCourse(draggedFromCell.day, draggedFromCell.period, null)
    }
    
    // 设置新位置的课程
    timetableStore.setCourse(day, period, draggedCourse)
    
    // 重置拖拽状态
    draggedCourse = null
    draggedFromCell = null
  }
}
</script>

<style scoped>
/* 这些样式已经在全局样式文件中定义，这里只需要添加特定于组件的样式 */
.timetable-container {
  @apply p-6 rounded-lg;
}
</style>
