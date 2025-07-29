<template>
  <div id="app" class="min-h-screen bg-slate-50">
    <header class="bg-white shadow-md border-b sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-3">
            <i class="ri-calendar-schedule-fill text-3xl text-indigo-600"></i>
            <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              课表小工具
            </h1>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="exportToExcel" class="btn-export-excel">
              <i class="ri-file-excel-2-line"></i>
              <span>导出Excel</span>
            </button>
            <button @click="exportToImage" class="btn-export-image">
              <i class="ri-image-line"></i>
              <span>导出图片</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTimetableStore } from '@/stores/timetable'

const timetableStore = useTimetableStore()

const exportToExcel = () => {
  timetableStore.exportToExcel()
}

const exportToImage = () => {
  timetableStore.exportToImage()
}
</script>