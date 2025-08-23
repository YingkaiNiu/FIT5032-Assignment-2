<template>
  <div class="appointment-calendar-container" role="region" aria-labelledby="calendar-heading">
    <h3 id="calendar-heading">智能预约管理系统</h3>
    
    <!-- Calendar Controls -->
    <div class="calendar-controls mb-3">
      <div class="row">
        <div class="col-md-8">
          <div class="btn-group" role="group" aria-label="Calendar navigation">
            <button 
              class="btn btn-outline-primary"
              @click="calendarApi?.prev()"
              @keydown.enter="calendarApi?.prev()"
              @keydown.space="calendarApi?.prev()"
              aria-label="Previous month"
            >
              <span aria-hidden="true">←</span>
              <span class="sr-only">Previous</span>
            </button>
            <button 
              class="btn btn-outline-primary"
              @click="calendarApi?.today()"
              @keydown.enter="calendarApi?.today()"
              @keydown.space="calendarApi?.today()"
              aria-label="Go to today"
            >
              Today
            </button>
            <button 
              class="btn btn-outline-primary"
              @click="calendarApi?.next()"
              @keydown.enter="calendarApi?.next()"
              @keydown.space="calendarApi?.next()"
              aria-label="Next month"
            >
              <span aria-hidden="true">→</span>
              <span class="sr-only">Next</span>
            </button>
          </div>
        </div>
        <div class="col-md-4 text-end">
          <button 
            class="btn btn-success"
            @click="showBookingModal = true"
            @keydown.enter="showBookingModal = true"
            @keydown.space="showBookingModal = true"
            aria-label="Book new appointment"
          >
            <span aria-hidden="true">📅</span>
            <span class="ms-1">预约</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Calendar -->
    <div class="calendar-wrapper">
      <FullCalendar 
        ref="calendarRef"
        :options="calendarOptions"
        class="appointment-calendar"
      />
    </div>

    <!-- Booking Modal -->
    <div 
      v-if="showBookingModal" 
      class="modal fade show d-block" 
      tabindex="-1"
      role="dialog"
      aria-labelledby="booking-modal-title"
      aria-modal="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="booking-modal-title" class="modal-title">预约新服务</h5>
            <button 
              type="button" 
              class="btn-close"
              @click="closeBookingModal"
              @keydown.enter="closeBookingModal"
              @keydown.space="closeBookingModal"
              aria-label="Close modal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="bookAppointment" role="form" aria-describedby="booking-form-help">
              <div id="booking-form-help" class="sr-only">
                填写预约信息，系统会自动检测时间冲突
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <label for="appointment-title" class="form-label">服务类型 <span aria-label="required">*</span></label>
                  <select 
                    id="appointment-title"
                    v-model="newAppointment.title"
                    class="form-select"
                    required
                    aria-describedby="title-help"
                  >
                    <option value="">选择服务类型</option>
                    <option value="健康咨询">健康咨询</option>
                    <option value="物理治疗">物理治疗</option>
                    <option value="药物检查">药物检查</option>
                    <option value="紧急护理">紧急护理</option>
                    <option value="康复训练">康复训练</option>
                  </select>
                  <div id="title-help" class="form-text">选择您需要的服务类型</div>
                </div>
                
                <div class="col-md-6">
                  <label for="appointment-date" class="form-label">日期 <span aria-label="required">*</span></label>
                  <input 
                    id="appointment-date"
                    type="date" 
                    v-model="newAppointment.date"
                    class="form-control"
                    required
                    :min="today"
                    aria-describedby="date-help"
                  />
                  <div id="date-help" class="form-text">选择预约日期</div>
                </div>
              </div>

              <div class="row mt-3">
                <div class="col-md-6">
                  <label for="appointment-start-time" class="form-label">开始时间 <span aria-label="required">*</span></label>
                  <input 
                    id="appointment-start-time"
                    type="time" 
                    v-model="newAppointment.startTime"
                    class="form-control"
                    required
                    aria-describedby="start-time-help"
                  />
                  <div id="start-time-help" class="form-text">选择开始时间</div>
                </div>
                
                <div class="col-md-6">
                  <label for="appointment-duration" class="form-label">持续时间 <span aria-label="required">*</span></label>
                  <select 
                    id="appointment-duration"
                    v-model="newAppointment.duration"
                    class="form-select"
                    required
                    aria-describedby="duration-help"
                  >
                    <option value="">选择时长</option>
                    <option value="30">30分钟</option>
                    <option value="60">1小时</option>
                    <option value="90">1.5小时</option>
                    <option value="120">2小时</option>
                  </select>
                  <div id="duration-help" class="form-text">选择服务持续时间</div>
                </div>
              </div>

              <div class="row mt-3">
                <div class="col-12">
                  <label for="appointment-notes" class="form-label">备注</label>
                  <textarea 
                    id="appointment-notes"
                    v-model="newAppointment.notes"
                    class="form-control"
                    rows="3"
                    placeholder="请输入特殊需求或备注信息..."
                    aria-describedby="notes-help"
                  ></textarea>
                  <div id="notes-help" class="form-text">可选：添加特殊需求或备注</div>
                </div>
              </div>

              <!-- Conflict Warning -->
              <div v-if="conflictWarning" class="alert alert-warning mt-3" role="alert">
                <span aria-hidden="true">⚠️</span>
                <span class="ms-2">{{ conflictWarning }}</span>
              </div>

              <!-- Available Slots -->
              <div v-if="availableSlots.length > 0" class="mt-3">
                <label class="form-label">推荐时间段：</label>
                <div class="available-slots">
                  <button 
                    v-for="slot in availableSlots" 
                    :key="slot"
                    type="button"
                    class="btn btn-outline-success btn-sm me-2 mb-2"
                    @click="selectTimeSlot(slot)"
                    @keydown.enter="selectTimeSlot(slot)"
                    @keydown.space="selectTimeSlot(slot)"
                    :aria-label="`选择时间段 ${slot}`"
                  >
                    {{ slot }}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary"
              @click="closeBookingModal"
              @keydown.enter="closeBookingModal"
              @keydown.space="closeBookingModal"
            >
              取消
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="bookAppointment"
              @keydown.enter="bookAppointment"
              @keydown.space="bookAppointment"
              :disabled="!isFormValid || hasConflict"
            >
              确认预约
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div v-if="showBookingModal" class="modal-backdrop fade show"></div>

    <!-- Status Messages -->
    <div v-if="statusMessage" class="alert mt-3" :class="statusClass" role="alert" aria-live="polite">
      <span v-if="statusMessage.type === 'success'" class="me-2" aria-hidden="true">✅</span>
      <span v-else-if="statusMessage.type === 'error'" class="me-2" aria-hidden="true">⚠️</span>
      {{ statusMessage.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhCnLocale from '@fullcalendar/core/locales/zh-cn'

// Calendar state
const calendarRef = ref(null)
const calendarApi = ref(null)
const showBookingModal = ref(false)
const statusMessage = ref(null)

// Booking form state
const newAppointment = ref({
  title: '',
  date: '',
  startTime: '',
  duration: '',
  notes: ''
})

const conflictWarning = ref('')
const availableSlots = ref([])

// Sample appointments data
const appointments = ref([
  {
    id: 1,
    title: '健康咨询',
    start: '2024-01-15T09:00:00',
    end: '2024-01-15T10:00:00',
    backgroundColor: '#28a745',
    borderColor: '#28a745',
    extendedProps: {
      notes: '定期健康检查',
      patient: '张三'
    }
  },
  {
    id: 2,
    title: '物理治疗',
    start: '2024-01-15T14:00:00',
    end: '2024-01-15T15:30:00',
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    extendedProps: {
      notes: '康复训练',
      patient: '李四'
    }
  },
  {
    id: 3,
    title: '药物检查',
    start: '2024-01-16T10:00:00',
    end: '2024-01-16T11:00:00',
    backgroundColor: '#ffc107',
    borderColor: '#ffc107',
    extendedProps: {
      notes: '药物副作用检查',
      patient: '王五'
    }
  }
])

// Computed properties
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return newAppointment.value.title && 
         newAppointment.value.date && 
         newAppointment.value.startTime && 
         newAppointment.value.duration
})

const hasConflict = computed(() => {
  return conflictWarning.value !== ''
})

const statusClass = computed(() => {
  if (!statusMessage.value) return ''
  return statusMessage.value.type === 'success' ? 'alert-success' : 'alert-danger'
})

// Calendar options
const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: '',
    center: '',
    right: ''
  },
  locale: zhCnLocale,
  events: appointments.value,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
    startTime: '08:00',
    endTime: '18:00'
  },
  slotMinTime: '08:00:00',
  slotMaxTime: '18:00:00',
  allDaySlot: false,
  height: 'auto',
  eventClick: handleEventClick,
  select: handleDateSelect,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize
}

// Methods
const handleEventClick = (info) => {
  const event = info.event
  alert(`预约详情：\n服务：${event.title}\n时间：${event.start.toLocaleString()}\n备注：${event.extendedProps.notes || '无'}`)
}

const handleDateSelect = (selectInfo) => {
  const start = selectInfo.start
  const end = selectInfo.end
  
  newAppointment.value.date = start.toISOString().split('T')[0]
  newAppointment.value.startTime = start.toTimeString().slice(0, 5)
  
  const duration = Math.round((end - start) / (1000 * 60))
  newAppointment.value.duration = duration.toString()
  
  showBookingModal.value = true
  checkConflicts()
}

const handleEventDrop = (dropInfo) => {
  const event = dropInfo.event
  const newStart = event.start
  const newEnd = event.end
  
  // Update appointment in data
  const appointment = appointments.value.find(a => a.id === parseInt(event.id))
  if (appointment) {
    appointment.start = newStart.toISOString()
    appointment.end = newEnd.toISOString()
  }
  
  showStatus('预约时间已更新', 'success')
}

const handleEventResize = (resizeInfo) => {
  const event = resizeInfo.event
  const newStart = event.start
  const newEnd = event.end
  
  // Update appointment in data
  const appointment = appointments.value.find(a => a.id === parseInt(event.id))
  if (appointment) {
    appointment.start = newStart.toISOString()
    appointment.end = newEnd.toISOString()
  }
  
  showStatus('预约时长已更新', 'success')
}

const checkConflicts = () => {
  if (!isFormValid.value) return
  
  const selectedDate = newAppointment.value.date
  const selectedTime = newAppointment.value.startTime
  const duration = parseInt(newAppointment.value.duration)
  
  const selectedStart = new Date(`${selectedDate}T${selectedTime}`)
  const selectedEnd = new Date(selectedStart.getTime() + duration * 60 * 1000)
  
  // Check for conflicts
  const conflicts = appointments.value.filter(appointment => {
    const appointmentStart = new Date(appointment.start)
    const appointmentEnd = new Date(appointment.end)
    
    return appointmentStart.toDateString() === selectedStart.toDateString() &&
           ((selectedStart < appointmentEnd && selectedEnd > appointmentStart))
  })
  
  if (conflicts.length > 0) {
    conflictWarning.value = `时间冲突：与 "${conflicts[0].title}" 预约时间重叠`
    generateAvailableSlots(selectedDate, selectedTime, duration)
  } else {
    conflictWarning.value = ''
    availableSlots.value = []
  }
}

const generateAvailableSlots = (date, conflictTime, duration) => {
  const slots = []
  const startHour = 8
  const endHour = 18
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      
      if (timeString !== conflictTime) {
        const slotStart = new Date(`${date}T${timeString}`)
        const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000)
        
        // Check if this slot is available
        const hasConflict = appointments.value.some(appointment => {
          const appointmentStart = new Date(appointment.start)
          const appointmentEnd = new Date(appointment.end)
          
          return appointmentStart.toDateString() === date &&
                 ((slotStart < appointmentEnd && slotEnd > appointmentStart))
        })
        
        if (!hasConflict && slotEnd.getHours() <= endHour) {
          slots.push(timeString)
        }
      }
    }
  }
  
  availableSlots.value = slots.slice(0, 6) // Show max 6 suggestions
}

const selectTimeSlot = (time) => {
  newAppointment.value.startTime = time
  checkConflicts()
}

const bookAppointment = () => {
  if (!isFormValid.value || hasConflict.value) return
  
  const startTime = new Date(`${newAppointment.value.date}T${newAppointment.value.startTime}`)
  const endTime = new Date(startTime.getTime() + parseInt(newAppointment.value.duration) * 60 * 1000)
  
  const newAppointmentData = {
    id: appointments.value.length + 1,
    title: newAppointment.value.title,
    start: startTime.toISOString(),
    end: endTime.toISOString(),
    backgroundColor: getServiceColor(newAppointment.value.title),
    borderColor: getServiceColor(newAppointment.value.title),
    extendedProps: {
      notes: newAppointment.value.notes,
      patient: '当前用户'
    }
  }
  
  appointments.value.push(newAppointmentData)
  
  // Add event to calendar
  if (calendarApi.value) {
    calendarApi.value.addEvent(newAppointmentData)
  }
  
  closeBookingModal()
  showStatus('预约成功！', 'success')
  
  // Reset form
  newAppointment.value = {
    title: '',
    date: '',
    startTime: '',
    duration: '',
    notes: ''
  }
}

const getServiceColor = (serviceType) => {
  const colors = {
    '健康咨询': '#28a745',
    '物理治疗': '#007bff',
    '药物检查': '#ffc107',
    '紧急护理': '#dc3545',
    '康复训练': '#6f42c1'
  }
  return colors[serviceType] || '#6c757d'
}

const closeBookingModal = () => {
  showBookingModal.value = false
  conflictWarning.value = ''
  availableSlots.value = []
}

const showStatus = (message, type = 'success') => {
  statusMessage.value = { text: message, type }
  setTimeout(() => {
    statusMessage.value = null
  }, 3000)
}

// Watch for form changes
import { watch } from 'vue'
watch([() => newAppointment.value.date, () => newAppointment.value.startTime, () => newAppointment.value.duration], () => {
  if (isFormValid.value) {
    checkConflicts()
  }
})

// Lifecycle
onMounted(async () => {
  await nextTick()
  if (calendarRef.value) {
    calendarApi.value = calendarRef.value.getApi()
  }
})
</script>

<style scoped>
.appointment-calendar-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.calendar-wrapper {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.appointment-calendar {
  min-height: 600px;
}

.available-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.available-slots .btn {
  min-width: 80px;
  min-height: 36px;
}

/* Modal styles */
.modal.show {
  display: block;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  z-index: 1050;
}

/* Calendar customization */
:deep(.fc-toolbar) {
  display: none;
}

:deep(.fc-event) {
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  padding: 2px 4px;
}

:deep(.fc-event:hover) {
  opacity: 0.8;
}

:deep(.fc-daygrid-event) {
  white-space: nowrap;
  border-radius: 3px;
}

:deep(.fc-timegrid-event) {
  border-radius: 3px;
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus indicators */
.btn:focus,
.form-control:focus,
.form-select:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .appointment-calendar-container {
    padding: 15px;
  }
  
  .calendar-controls .btn-group {
    flex-wrap: wrap;
  }
  
  .available-slots {
    flex-direction: column;
  }
  
  .available-slots .btn {
    width: 100%;
  }
}
</style>
