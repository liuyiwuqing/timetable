<template>
  <div class="space-y-6">
    <!-- 控制面板 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 课程管理 -->
      <CourseManager />
      
      <!-- 配置设置 -->
      <ConfigPanel />
      
      <!-- 主题选择 -->
      <ThemeSelector />
    </div>

    <!-- 课程表 -->
    <div id="timetable-container" class="card mb-8">
      <TimetableGrid />
    </div>

    <!-- 操作按钮 -->
    <div class="flex justify-center space-x-4">
      <button @click="randomAssign" class="btn-primary">
        <i class="ri-shuffle-line"></i>
        <span>随机排课</span>
      </button>
      <button @click="clearAll" class="btn-secondary">
        <i class="ri-delete-bin-line"></i>
        <span>清空课表</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimetableStore } from '@/stores/timetable'
import CourseManager from '@/components/CourseManager.vue'
import ConfigPanel from '@/components/ConfigPanel.vue'
import ThemeSelector from '@/components/ThemeSelector.vue'
import TimetableGrid from '@/components/TimetableGrid.vue'

const timetableStore = useTimetableStore()

const randomAssign = () => {
  timetableStore.randomAssignCourses()
}

const clearAll = () => {
  timetableStore.initializeTimetable()
}
</script>
