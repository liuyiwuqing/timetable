export interface Course {
  id: string
  name: string
  color: string
}

export interface TimeSlot {
  id: string
  period: number
  timeRange: string
  type: 'morning' | 'afternoon' | 'evening'
}

export interface TimetableCell {
  id: string
  day: number
  period: number
  course: Course | null
}

export interface TimetableConfig {
  title: string
  morningPeriods: number
  afternoonPeriods: number
  eveningPeriods: number
  timeSlots: TimeSlot[]
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    border: string
  }
}