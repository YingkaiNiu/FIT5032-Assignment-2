<template>
  <div class="health-reminder-container" role="region" aria-labelledby="reminder-heading">
    <h3 id="reminder-heading" class="mb-4 text-center">Health Reminder System</h3>

    <div class="row">
      <!-- Add Reminder Form -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0">Add New Reminder</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="addReminder" aria-label="Add new health reminder form">
              <div class="mb-3">
                <label for="reminderTitle" class="form-label">Reminder Title <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  id="reminderTitle"
                  v-model="newReminder.title"
                  placeholder="e.g., Take medication"
                  required
                  aria-required="true"
                />
              </div>
              <div class="mb-3">
                <label for="reminderTime" class="form-label">Time <span class="text-danger">*</span></label>
                <input
                  type="time"
                  class="form-control"
                  id="reminderTime"
                  v-model="newReminder.time"
                  required
                  aria-required="true"
                />
              </div>
              <div class="mb-3">
                <label for="reminderDays" class="form-label">Repeat Days</label>
                <div class="form-check" v-for="day in daysOfWeek" :key="day.value">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`day-${day.value}`"
                    :value="day.value"
                    v-model="newReminder.days"
                  />
                  <label class="form-check-label" :for="`day-${day.value}`">
                    {{ day.label }}
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <label for="reminderCategory" class="form-label">Category</label>
                <select class="form-select" id="reminderCategory" v-model="newReminder.category">
                  <option value="Medication">Medication</option>
                  <option value="Exercise">Exercise</option>
                  <option value="Appointment">Appointment</option>
                  <option value="Health Check">Health Check</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="reminderNotes" class="form-label">Notes (Optional)</label>
                <textarea
                  class="form-control"
                  id="reminderNotes"
                  v-model="newReminder.notes"
                  rows="3"
                  placeholder="Additional notes..."
                ></textarea>
              </div>
              <button type="submit" class="btn btn-success w-100" aria-label="Add Reminder">Add Reminder</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Reminders List -->
      <div class="col-md-6 mb-4">
        <div class="card shadow-sm">
          <div class="card-header bg-info text-white">
            <h4 class="mb-0">Your Reminders</h4>
          </div>
          <div class="card-body">
            <div v-if="reminders.length === 0" class="alert alert-light text-center" role="status">
              No reminders set. Add your first reminder!
            </div>
            <div v-else class="reminders-list">
              <div
                v-for="(reminder, index) in reminders"
                :key="reminder.id"
                class="reminder-item mb-3 p-3 border rounded"
                :class="{ 'border-success': reminder.completed }"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1" :class="{ 'text-decoration-line-through': reminder.completed }">
                      {{ reminder.title }}
                    </h6>
                    <p class="text-muted mb-1">
                      <strong>Time:</strong> {{ formatTime(reminder.time) }}
                    </p>
                    <p class="text-muted mb-1" v-if="reminder.days.length > 0">
                      <strong>Days:</strong> {{ formatDays(reminder.days) }}
                    </p>
                    <p class="text-muted mb-1">
                      <strong>Category:</strong> 
                      <span class="badge" :class="getCategoryBadgeClass(reminder.category)">
                        {{ reminder.category }}
                      </span>
                    </p>
                    <p class="text-muted mb-2" v-if="reminder.notes">
                      <strong>Notes:</strong> {{ reminder.notes }}
                    </p>
                  </div>
                  <div class="d-flex flex-column">
                    <button
                      @click="toggleReminder(index)"
                      class="btn btn-sm mb-1"
                      :class="reminder.completed ? 'btn-outline-success' : 'btn-success'"
                      :aria-label="reminder.completed ? 'Mark as incomplete' : 'Mark as complete'"
                    >
                      {{ reminder.completed ? '✓' : '○' }}
                    </button>
                    <button
                      @click="removeReminder(index)"
                      class="btn btn-sm btn-outline-danger"
                      aria-label="Remove reminder"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer text-muted text-center">
            Total: {{ reminders.length }} reminders | Completed: {{ completedRemindersCount }}
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Reminders -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-warning text-dark">
            <h4 class="mb-0">Today's Reminders</h4>
          </div>
          <div class="card-body">
            <div v-if="todaysReminders.length === 0" class="alert alert-light text-center" role="status">
              No reminders scheduled for today.
            </div>
            <div v-else class="todays-reminders">
              <div
                v-for="reminder in todaysReminders"
                :key="reminder.id"
                class="reminder-item mb-2 p-2 border rounded"
                :class="{ 'border-success': reminder.completed }"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{{ reminder.title }}</strong> - {{ formatTime(reminder.time) }}
                    <span class="badge ms-2" :class="getCategoryBadgeClass(reminder.category)">
                      {{ reminder.category }}
                    </span>
                  </div>
                  <button
                    @click="toggleReminder(reminders.findIndex(r => r.id === reminder.id))"
                    class="btn btn-sm"
                    :class="reminder.completed ? 'btn-success' : 'btn-outline-success'"
                  >
                    {{ reminder.completed ? 'Completed' : 'Mark Complete' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const reminders = ref([])
const newReminder = ref({
  title: '',
  time: '',
  days: [],
  category: 'Medication',
  notes: '',
  completed: false
})

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
]

onMounted(() => {
  loadReminders()
})

const addReminder = () => {
  if (newReminder.value.title.trim() && newReminder.value.time) {
    reminders.value.push({
      id: Date.now(),
      ...newReminder.value
    })
    newReminder.value = {
      title: '',
      time: '',
      days: [],
      category: 'Medication',
      notes: '',
      completed: false
    }
    saveReminders()
  }
}

const removeReminder = (index) => {
  reminders.value.splice(index, 1)
  saveReminders()
}

const toggleReminder = (index) => {
  reminders.value[index].completed = !reminders.value[index].completed
  saveReminders()
}

const saveReminders = () => {
  localStorage.setItem('healthReminders', JSON.stringify(reminders.value))
}

const loadReminders = () => {
  const savedReminders = localStorage.getItem('healthReminders')
  if (savedReminders) {
    reminders.value = JSON.parse(savedReminders)
  }
}

const completedRemindersCount = computed(() => {
  return reminders.value.filter(reminder => reminder.completed).length
})

const todaysReminders = computed(() => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  return reminders.value.filter(reminder => 
    reminder.days.length === 0 || reminder.days.includes(today)
  ).sort((a, b) => a.time.localeCompare(b.time))
})

const formatTime = (time) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

const formatDays = (days) => {
  if (days.length === 0) return 'No repeat'
  return days.map(day => 
    day.charAt(0).toUpperCase() + day.slice(1)
  ).join(', ')
}

const getCategoryBadgeClass = (category) => {
  const classes = {
    'Medication': 'bg-danger',
    'Exercise': 'bg-success',
    'Appointment': 'bg-primary',
    'Health Check': 'bg-warning text-dark',
    'Other': 'bg-secondary'
  }
  return classes[category] || 'bg-secondary'
}
</script>

<style scoped>
.health-reminder-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  border: none;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 20px;
}

.card-header {
  background: linear-gradient(45deg, #28a745, #20c997);
  color: white;
  padding: 1rem 1.5rem;
  font-weight: bold;
  border-bottom: none;
}

.card-header h4 {
  font-size: 1.25rem;
}

.card-body {
  padding: 1.5rem;
}

.reminder-item {
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.reminder-item:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.reminder-item.border-success {
  background-color: #d4edda;
}

.form-check {
  margin-bottom: 0.5rem;
}

.form-check-input:checked {
  background-color: #28a745;
  border-color: #28a745;
}

.badge {
  font-size: 0.75rem;
}

/* Accessibility improvements */
.form-control:focus,
.form-select:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.btn:focus {
  outline: 3px solid #28a745;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .health-reminder-container {
    padding: 10px;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .reminder-item {
    padding: 0.75rem !important;
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
