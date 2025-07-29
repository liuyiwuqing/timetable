<template>
  <div class="card">
    <div class="flex items-center space-x-2 mb-4">
      <i class="ri-palette-line text-xl text-indigo-600"></i>
      <h3 class="text-lg font-semibold text-gray-800">主题选择</h3>
    </div>
    
    <div class="space-y-3">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all"
        :class="{
          'border-indigo-500 bg-indigo-50': currentTheme === theme.id,
          'border-gray-200 hover:border-gray-300': currentTheme !== theme.id
        }"
        @click="selectTheme(theme.id)"
      >
        <div class="flex items-center space-x-3">
          <div class="flex space-x-1.5">
            <div
              class="w-5 h-5 rounded-full"
              :style="{ backgroundColor: theme.colors.primary }"
            ></div>
            <div
              class="w-5 h-5 rounded-full"
              :style="{ backgroundColor: theme.colors.secondary }"
            ></div>
          </div>
          <span class="font-medium">{{ theme.name }}</span>
        </div>
        <div
          v-if="currentTheme === theme.id"
          class="text-indigo-500 text-xl"
        >
          <i class="ri-check-line"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTimetableStore } from '@/stores/timetable'

const timetableStore = useTimetableStore()
const { themes, currentTheme } = storeToRefs(timetableStore)

const selectTheme = (themeId: string) => {
  currentTheme.value = themeId
}
</script>
