<template>
  <div class="appointment-scheduler-container" role="region" aria-labelledby="scheduler-heading">
    <h3 id="scheduler-heading">Smart Appointment Scheduler</h3>
    
    <!-- Appointment Form -->
    <div class="appointment-form-section mb-4">
      <div class="card">
        <div class="card-header">
          <h5>Schedule New Appointment</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="scheduleAppointment" class="row g-3">
            <div class="col-md-6">
              <label for="patient-name" class="form-label">Patient Name *</label>
              <input
                id="patient-name"
                type="text"
                v-model="appointmentForm.patientName"
                class="form-control"
                required
                aria-describedby="patient-name-help"
              />
              <div id="patient-name-help" class="form-text">Enter the patient's full name</div>
            </div>
            
            <div class="col-md-6">
              <label for="service-type" class="form-label">Service Type *</label>
              <select
                id="service-type"
                v-model="appointmentForm.serviceType"
                class="form-select"
                required
                aria-describedby="service-type-help"
              >
                <option value="">Select a service</option>
                <option value="consultation">General Consultation</option>
                <option value="checkup">Health Checkup</option>
                <option value="therapy">Physical Therapy</option>
                <option value="emergency">Emergency Care</option>
                <option value="followup">Follow-up Visit</option>
              </select>
              <div id="service-type-help" class="form-text">Choose the type of service needed</div>
            </div>
            
            <div class="col-md-6">
              <label for="appointment-date" class="form-label">Preferred Date *</label>
              <input
                id="appointment-date"
                type="date"
                v-model="appointmentForm.date"
                class="form-control"
                required
                :min="today"
                aria-describedby="date-help"
              />
              <div id="date-help" class="form-text">Select your preferred appointment date</div>
            </div>
            
            <div class="col-md-6">
              <label for="appointment-time" class="form-label">Preferred Time *</label>
              <select
                id="appointment-time"
                v-model="appointmentForm.time"
                class="form-select"
                required
                aria-describedby="time-help"
              >
                <option value="">Select a time</option>
                <option v-for="time in availableTimes" :key="time" :value="time">
                  {{ time }}
                </option>
              </select>
              <div id="time-help" class="form-text">Choose from available time slots</div>
            </div>
            
            <div class="col-12">
              <label for="appointment-notes" class="form-label">Notes</label>
              <textarea
                id="appointment-notes"
                v-model="appointmentForm.notes"
                class="form-control"
                rows="3"
                placeholder="Any additional notes or special requirements..."
                aria-describedby="notes-help"
              ></textarea>
              <div id="notes-help" class="form-text">Optional notes for the healthcare provider</div>
            </div>
            
            <div class="col-12">
              <button type="submit" class="btn btn-primary" :disabled="isScheduling">
                <span v-if="!isScheduling">📅 Schedule Appointment</span>
                <span v-else class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                <span v-if="isScheduling">Scheduling...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Calendar View -->
    <div class="calendar-section">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5>Appointment Calendar</h5>
          <div class="calendar-controls">
            <button @click="today" class="btn btn-outline-secondary btn-sm">Today</button>
            <button @click="prev" class="btn btn-outline-secondary btn-sm">Previous</button>
            <button @click="next" class="btn btn-outline-secondary btn-sm">Next</button>
          </div>
        </div>
        <div class="card-body">
          <div id="calendar" ref="calendarRef"></div>
        </div>
      </div>
    </div>
    
    <!-- Conflict Detection -->
    <div v-if="conflicts.length > 0" class="conflicts-section mt-4">
      <div class="alert alert-warning" role="alert">
        <h6>⚠️ Scheduling Conflicts Detected</h6>
        <ul class="mb-0">
          <li v-for="conflict in conflicts" :key="conflict.id">
            {{ conflict.message }}
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Status Messages -->
    <div v-if="statusMessage" class="alert mt-3" :class="statusClass" role="alert" aria-live="polite">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// Appointment form data
const appointmentForm = ref({
  patientName: '',
  serviceType: '',
  date: '',
  time: '',
  notes: ''
})

// Calendar and scheduling state
const calendarRef = ref(null)
const calendar = ref(null)
const isScheduling = ref(false)
const statusMessage = ref('')
const conflicts = ref([])

// Sample appointments data
const appointments = ref([
  {
    id: 1,
    title: 'John Smith - Consultation',
    start: '2024-01-15T09:00:00',
    end: '2024-01-15T10:00:00',
    backgroundColor: '#007bff',
    borderColor: '#007bff'
  },
  {
    id: 2,
    title: 'Jane Doe - Checkup',
    start: '2024-01-15T14:00:00',
    end: '2024-01-15T15:00:00',
    backgroundColor: '#28a745',
    borderColor: '#28a745'
  },
  {
    id: 3,
    title: 'Bob Johnson - Therapy',
    start: '2024-01-16T11:00:00',
    end: '2024-01-16T12:00:00',
    backgroundColor: '#ffc107',
    borderColor: '#ffc107'
  }
])

// Available time slots
const availableTimes = ref([
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
])

// Computed properties
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const statusClass = computed(() => {
  if (statusMessage.value.includes('success')) return 'alert-success'
  if (statusMessage.value.includes('error')) return 'alert-danger'
  if (statusMessage.value.includes('warning')) return 'alert-warning'
  return 'alert-info'
})

// Methods
const initializeCalendar = () => {
  if (!calendarRef.value) return
  
  calendar.value = new Calendar(calendarRef.value, {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: appointments.value,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    select: (arg) => {
      // Handle date selection
      appointmentForm.value.date = arg.startStr
    },
    eventClick: (arg) => {
      // Handle event click
      showEventDetails(arg.event)
    },
    eventDrop: (arg) => {
      // Handle event drag and drop
      updateAppointment(arg.event)
    },
    eventResize: (arg) => {
      // Handle event resize
      updateAppointment(arg.event)
    }
  })
  
  calendar.value.render()
}

const showEventDetails = (event) => {
  const details = `
    Patient: ${event.title}
    Date: ${event.start.toLocaleDateString()}
    Time: ${event.start.toLocaleTimeString()} - ${event.end.toLocaleTimeString()}
  `
  alert(details)
}

const updateAppointment = (event) => {
  // Update appointment in backend
  console.log('Updating appointment:', event)
  statusMessage.value = 'Appointment updated successfully'
  
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

const checkConflicts = () => {
  conflicts.value = []
  
  if (!appointmentForm.value.date || !appointmentForm.value.time) return
  
  const selectedDateTime = new Date(`${appointmentForm.value.date}T${appointmentForm.value.time}`)
  const selectedEndTime = new Date(selectedDateTime.getTime() + 60 * 60 * 1000) // 1 hour duration
  
  // Check for conflicts with existing appointments
  appointments.value.forEach(appointment => {
    const appointmentStart = new Date(appointment.start)
    const appointmentEnd = new Date(appointment.end)
    
    if (
      (selectedDateTime >= appointmentStart && selectedDateTime < appointmentEnd) ||
      (selectedEndTime > appointmentStart && selectedEndTime <= appointmentEnd) ||
      (selectedDateTime <= appointmentStart && selectedEndTime >= appointmentEnd)
    ) {
      conflicts.value.push({
        id: appointment.id,
        message: `Conflict with ${appointment.title} at ${appointmentStart.toLocaleTimeString()}`
      })
    }
  })
}

const scheduleAppointment = async () => {
  if (!appointmentForm.value.patientName || !appointmentForm.value.serviceType || 
      !appointmentForm.value.date || !appointmentForm.value.time) {
    statusMessage.value = 'Please fill in all required fields'
    return
  }
  
  isScheduling.value = true
  
  try {
    // Check for conflicts
    checkConflicts()
    
    if (conflicts.value.length > 0) {
      statusMessage.value = 'Cannot schedule appointment due to conflicts'
      isScheduling.value = false
      return
    }
    
    // Create new appointment
    const newAppointment = {
      id: Date.now(),
      title: `${appointmentForm.value.patientName} - ${appointmentForm.value.serviceType}`,
      start: `${appointmentForm.value.date}T${appointmentForm.value.time}`,
      end: new Date(`${appointmentForm.value.date}T${appointmentForm.value.time}`).getTime() + 60 * 60 * 1000,
      backgroundColor: getServiceColor(appointmentForm.value.serviceType),
      borderColor: getServiceColor(appointmentForm.value.serviceType),
      notes: appointmentForm.value.notes
    }
    
    // Add to appointments array
    appointments.value.push(newAppointment)
    
    // Update calendar
    if (calendar.value) {
      calendar.value.addEvent(newAppointment)
    }
    
    // Reset form
    appointmentForm.value = {
      patientName: '',
      serviceType: '',
      date: '',
      time: '',
      notes: ''
    }
    
    statusMessage.value = 'Appointment scheduled successfully!'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Error scheduling appointment:', error)
    statusMessage.value = 'Error scheduling appointment. Please try again.'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  } finally {
    isScheduling.value = false
  }
}

const getServiceColor = (serviceType) => {
  const colors = {
    consultation: '#007bff',
    checkup: '#28a745',
    therapy: '#ffc107',
    emergency: '#dc3545',
    followup: '#6f42c1'
  }
  return colors[serviceType] || '#6c757d'
}

// Calendar navigation methods
const today = () => {
  calendar.value?.today()
}

const prev = () => {
  calendar.value?.prev()
}

const next = () => {
  calendar.value?.next()
}

// Watch for form changes to check conflicts
watch([() => appointmentForm.value.date, () => appointmentForm.value.time], () => {
  checkConflicts()
})

// Initialize calendar on mount
onMounted(() => {
  initializeCalendar()
})
</script>

<style scoped>
.appointment-scheduler-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.appointment-form-section {
  margin-bottom: 30px;
}

.calendar-section {
  margin-bottom: 20px;
}

.calendar-controls {
  display: flex;
  gap: 8px;
}

.calendar-controls .btn {
  font-size: 0.8rem;
  padding: 4px 8px;
}

#calendar {
  height: 600px;
}

.conflicts-section {
  margin-top: 20px;
}

.conflicts-section ul {
  padding-left: 20px;
}

.conflicts-section li {
  margin-bottom: 5px;
}

/* FullCalendar custom styles */
:deep(.fc-event) {
  cursor: pointer;
  border-radius: 4px;
}

:deep(.fc-event:hover) {
  opacity: 0.8;
}

:deep(.fc-toolbar-title) {
  font-size: 1.2rem;
  font-weight: 600;
}

:deep(.fc-button) {
  background-color: #007bff;
  border-color: #007bff;
}

:deep(.fc-button:hover) {
  background-color: #0056b3;
  border-color: #0056b3;
}

:deep(.fc-button:focus) {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

:deep(.fc-daygrid-day:hover) {
  background-color: #f8f9fa;
}

/* Accessibility improvements */
.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .appointment-scheduler-container {
    padding: 15px;
  }
  
  #calendar {
    height: 400px;
  }
  
  .calendar-controls {
    flex-direction: column;
    gap: 4px;
  }
  
  .calendar-controls .btn {
    font-size: 0.7rem;
    padding: 2px 6px;
  }
}

/* High contrast support */
.high-contrast .card {
  border: 2px solid #000;
}

.high-contrast .form-control,
.high-contrast .form-select {
  border: 2px solid #000;
}

.high-contrast .btn {
  border: 2px solid #000;
}
</style>
