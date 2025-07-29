<template>
  <div class="card">
    <div class="flex items-center space-x-2 mb-4">
      <i class="ri-settings-3-line text-xl text-indigo-600"></i>
      <h3 class="text-lg font-semibold text-gray-800">课表配置</h3>
    </div>
    
    <div class="space-y-4">
      <!-- 课表标题 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <i class="ri-text text-indigo-500 mr-1"></i> 课表标题
        </label>
        <input
          v-model="localConfig.title"
          type="text"
          class="input-field"
          @blur="updateConfig"
        />
      </div>

      <!-- 上午课程数 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <i class="ri-sun-line text-amber-500 mr-1"></i> 上午课程数
        </label>
        <input
          v-model.number="localConfig.morningPeriods"
          type="number"
          min="1"
          max="6"
          class="input-field"
          @change="updateConfig"
        />
      </div>

      <!-- 下午课程数 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <i class="ri-sun-foggy-line text-orange-500 mr-1"></i> 下午课程数
        </label>
        <input
          v-model.number="localConfig.afternoonPeriods"
          type="number"
          min="1"
          max="6"
          class="input-field"
          @change="updateConfig"
        />
      </div>

      <!-- 晚自习课程数 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          <i class="ri-moon-line text-blue-500 mr-1"></i> 晚自习课程数
        </label>
        <input
          v-model.number="localConfig.eveningPeriods"
          type="number"
          min="0"
          max="4"
          class="input-field"
          @change="updateConfig"
        />
      </div>

      <div class="text-sm font-medium bg-indigo-50 p-3 rounded-xl flex items-center justify-center space-x-2 text-indigo-700">
        <i class="ri-time-line"></i>
        <span>总计：{{ totalPeriods }} 节课</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTimetableStore } from '@/stores/timetable'

const timetableStore = useTimetableStore()
const { config, totalPeriods } = storeToRefs(timetableStore)

const localConfig = ref({
  title: config.value.title,
  morningPeriods: config.value.morningPeriods,
  afternoonPeriods: config.value.afternoonPeriods,
  eveningPeriods: config.value.eveningPeriods
})

const updateConfig = () => {
  timetableStore.updateConfig(localConfig.value)
}

// 监听配置变化
watch(config, (newConfig) => {
  localConfig.value = {
    title: newConfig.title,
    morningPeriods: newConfig.morningPeriods,
    afternoonPeriods: newConfig.afternoonPeriods,
    eveningPeriods: newConfig.eveningPeriods
  }
}, { deep: true })
</script>
