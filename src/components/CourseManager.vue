<template>
  <div class="card">
    <div class="flex items-center space-x-2 mb-4">
      <i class="ri-book-open-line text-xl text-indigo-600"></i>
      <h3 class="text-lg font-semibold text-gray-800">课程管理</h3>
    </div>
    
    <!-- 添加课程 -->
    <div class="mb-4">
      <div class="flex space-x-2 mb-2">
        <input
          v-model="newCourseName"
          type="text"
          placeholder="输入课程名称"
          class="input-field flex-1"
          @keyup.enter="addCourse"
        />
        <input
          v-model="newCourseColor"
          type="color"
          class="w-12 h-11 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>
      <button @click="addCourse" class="btn-primary w-full">
        <i class="ri-add-line"></i>
        <span>添加课程</span>
      </button>
    </div>

    <!-- 课程列表 -->
    <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
      <div
        v-for="course in courses"
        :key="course.id"
        class="flex items-center justify-between p-3 rounded-xl border-2"
        :style="{ borderColor: course.color + '40', backgroundColor: course.color + '10' }"
      >
        <div class="flex items-center space-x-2">
          <div
            class="w-5 h-5 rounded-full"
            :style="{ backgroundColor: course.color }"
          ></div>
          <span class="font-medium">{{ course.name }}</span>
        </div>
        <button
          @click="removeCourse(course.id)"
          class="text-red-500 hover:text-red-700 text-sm p-1.5 rounded-full hover:bg-red-50 transition-colors"
        >
          <i class="ri-delete-bin-6-line"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTimetableStore } from '@/stores/timetable'

const timetableStore = useTimetableStore()
const { courses } = storeToRefs(timetableStore)

const newCourseName = ref('')
const newCourseColor = ref('#3b82f6')

const addCourse = () => {
  if (newCourseName.value.trim()) {
    timetableStore.addCourse(newCourseName.value.trim(), newCourseColor.value)
    newCourseName.value = ''
    newCourseColor.value = '#3b82f6'
  }
}

const removeCourse = (courseId: string) => {
  timetableStore.removeCourse(courseId)
}
</script>
