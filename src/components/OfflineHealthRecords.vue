<template>
  <div class="offline-health-records-container" role="region" aria-labelledby="records-heading">
    <h3 id="records-heading">Offline Health Records Manager</h3>
    
    <!-- Network Status -->
    <div class="network-status mb-4">
      <div class="alert" :class="networkStatusClass" role="alert" aria-live="polite">
        <div class="d-flex align-items-center">
          <span class="status-icon me-2" aria-hidden="true">
            {{ isOnline ? '🌐' : '📱' }}
          </span>
          <div>
            <strong>{{ isOnline ? 'Online' : 'Offline' }} Mode</strong>
            <div class="status-details">
              {{ isOnline ? 'All features available' : 'Working offline - data will sync when connection is restored' }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Health Records Form -->
    <div class="records-form-section mb-4">
      <div class="card">
        <div class="card-header">
          <h5>Add Health Record</h5>
        </div>
        <div class="card-body">
          <form @submit.prevent="addHealthRecord" class="row g-3">
            <div class="col-md-6">
              <label for="record-date" class="form-label">Date *</label>
              <input
                id="record-date"
                type="date"
                v-model="recordForm.date"
                class="form-control"
                required
                :max="today"
                aria-describedby="date-help"
              />
              <div id="date-help" class="form-text">Select the date of the health record</div>
            </div>
            
            <div class="col-md-6">
              <label for="record-type" class="form-label">Record Type *</label>
              <select
                id="record-type"
                v-model="recordForm.type"
                class="form-select"
                required
                aria-describedby="type-help"
              >
                <option value="">Select record type</option>
                <option value="vitals">Vital Signs</option>
                <option value="medication">Medication</option>
                <option value="symptoms">Symptoms</option>
                <option value="appointment">Appointment Notes</option>
                <option value="lab">Lab Results</option>
                <option value="exercise">Exercise Log</option>
                <option value="diet">Diet Log</option>
              </select>
              <div id="type-help" class="form-text">Choose the type of health record</div>
            </div>
            
            <div class="col-12">
              <label for="record-title" class="form-label">Title *</label>
              <input
                id="record-title"
                type="text"
                v-model="recordForm.title"
                class="form-control"
                required
                placeholder="e.g., Blood pressure reading, Medication taken"
                aria-describedby="title-help"
              />
              <div id="title-help" class="form-text">Enter a descriptive title for the record</div>
            </div>
            
            <div class="col-12">
              <label for="record-description" class="form-label">Description</label>
              <textarea
                id="record-description"
                v-model="recordForm.description"
                class="form-control"
                rows="3"
                placeholder="Detailed description of the health record..."
                aria-describedby="description-help"
              ></textarea>
              <div id="description-help" class="form-text">Optional detailed description</div>
            </div>
            
            <div class="col-md-6">
              <label for="record-value" class="form-label">Value (if applicable)</label>
              <input
                id="record-value"
                type="text"
                v-model="recordForm.value"
                class="form-control"
                placeholder="e.g., 120/80, 98.6°F, 150 mg"
                aria-describedby="value-help"
              />
              <div id="value-help" class="form-text">Enter numerical value or measurement</div>
            </div>
            
            <div class="col-md-6">
              <label for="record-unit" class="form-label">Unit</label>
              <input
                id="record-unit"
                type="text"
                v-model="recordForm.unit"
                class="form-control"
                placeholder="e.g., mmHg, °F, mg"
                aria-describedby="unit-help"
              />
              <div id="unit-help" class="form-text">Unit of measurement</div>
            </div>
            
            <div class="col-12">
              <button type="submit" class="btn btn-primary" :disabled="isAdding">
                <span v-if="!isAdding">📝 Add Record</span>
                <span v-else class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                <span v-if="isAdding">Adding...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Records List -->
    <div class="records-list-section">
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5>Health Records ({{ filteredRecords.length }})</h5>
          <div class="records-controls">
            <div class="btn-group" role="group">
              <button
                @click="filterByType('all')"
                class="btn btn-outline-secondary btn-sm"
                :class="{ active: currentFilter === 'all' }"
                aria-label="Show all records"
              >
                All
              </button>
              <button
                @click="filterByType('vitals')"
                class="btn btn-outline-secondary btn-sm"
                :class="{ active: currentFilter === 'vitals' }"
                aria-label="Show vital signs records"
              >
                Vitals
              </button>
              <button
                @click="filterByType('medication')"
                class="btn btn-outline-secondary btn-sm"
                :class="{ active: currentFilter === 'medication' }"
                aria-label="Show medication records"
              >
                Medication
              </button>
              <button
                @click="filterByType('symptoms')"
                class="btn btn-outline-secondary btn-sm"
                :class="{ active: currentFilter === 'symptoms' }"
                aria-label="Show symptoms records"
              >
                Symptoms
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="records-list">
            <div 
              v-for="record in filteredRecords" 
              :key="record.id"
              class="record-item"
              :class="{ 'pending-sync': !record.synced }"
            >
              <div class="record-header">
                <div class="record-type-icon">{{ getTypeIcon(record.type) }}</div>
                <div class="record-info">
                  <h6 class="record-title">{{ record.title }}</h6>
                  <div class="record-meta">
                    <span class="record-date">{{ formatDate(record.date) }}</span>
                    <span class="record-type">{{ record.type }}</span>
                    <span v-if="record.value" class="record-value">
                      {{ record.value }}{{ record.unit ? ` ${record.unit}` : '' }}
                    </span>
                  </div>
                </div>
                <div class="record-actions">
                  <button
                    @click="editRecord(record)"
                    class="btn btn-sm btn-outline-primary"
                    aria-label="Edit record"
                  >
                    ✏️
                  </button>
                  <button
                    @click="deleteRecord(record.id)"
                    class="btn btn-sm btn-outline-danger"
                    aria-label="Delete record"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div v-if="record.description" class="record-description">
                {{ record.description }}
              </div>
              <div v-if="!record.synced" class="sync-status">
                <span class="sync-indicator">⏳ Pending sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sync Status -->
    <div class="sync-section mt-4">
      <div class="card">
        <div class="card-header">
          <h5>Data Synchronization</h5>
        </div>
        <div class="card-body">
          <div class="sync-stats">
            <div class="row">
              <div class="col-md-3">
                <div class="stat-item">
                  <div class="stat-number">{{ totalRecords }}</div>
                  <div class="stat-label">Total Records</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-item">
                  <div class="stat-number">{{ syncedRecords }}</div>
                  <div class="stat-label">Synced</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-item">
                  <div class="stat-number">{{ pendingRecords }}</div>
                  <div class="stat-label">Pending Sync</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="stat-item">
                  <div class="stat-number">{{ storageUsed }}</div>
                  <div class="stat-label">Storage Used</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="sync-actions mt-3">
            <button
              @click="syncRecords"
              class="btn btn-primary"
              :disabled="!isOnline || pendingRecords === 0"
              aria-label="Sync pending records"
            >
              🔄 Sync Records ({{ pendingRecords }})
            </button>
            <button
              @click="exportRecords"
              class="btn btn-outline-secondary"
              aria-label="Export all records"
            >
              📤 Export Records
            </button>
            <button
              @click="clearAllRecords"
              class="btn btn-outline-danger"
              aria-label="Clear all records"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Status Messages -->
    <div v-if="statusMessage" class="alert mt-3" :class="statusClass" role="alert" aria-live="polite">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Component state
const isOnline = ref(navigator.onLine)
const isAdding = ref(false)
const statusMessage = ref('')
const currentFilter = ref('all')

// Health record form
const recordForm = ref({
  date: '',
  type: '',
  title: '',
  description: '',
  value: '',
  unit: ''
})

// Health records data
const healthRecords = ref([])

// Computed properties
const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

const filteredRecords = computed(() => {
  if (currentFilter.value === 'all') {
    return healthRecords.value
  }
  return healthRecords.value.filter(record => record.type === currentFilter.value)
})

const totalRecords = computed(() => healthRecords.value.length)
const syncedRecords = computed(() => healthRecords.value.filter(r => r.synced).length)
const pendingRecords = computed(() => healthRecords.value.filter(r => !r.synced).length)
const storageUsed = computed(() => {
  const dataSize = JSON.stringify(healthRecords.value).length
  return `${(dataSize / 1024).toFixed(1)} KB`
})

const networkStatusClass = computed(() => {
  return isOnline.value ? 'alert-success' : 'alert-warning'
})

const statusClass = computed(() => {
  if (statusMessage.value.includes('success')) return 'alert-success'
  if (statusMessage.value.includes('error')) return 'alert-danger'
  if (statusMessage.value.includes('warning')) return 'alert-warning'
  return 'alert-info'
})

// Methods
const getTypeIcon = (type) => {
  const icons = {
    vitals: '❤️',
    medication: '💊',
    symptoms: '🤒',
    appointment: '📅',
    lab: '🔬',
    exercise: '🏃',
    diet: '🍎'
  }
  return icons[type] || '📋'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const addHealthRecord = async () => {
  if (!recordForm.value.date || !recordForm.value.type || !recordForm.value.title) {
    statusMessage.value = 'Please fill in all required fields'
    return
  }
  
  isAdding.value = true
  
  try {
    const newRecord = {
      id: Date.now(),
      date: recordForm.value.date,
      type: recordForm.value.type,
      title: recordForm.value.title,
      description: recordForm.value.description,
      value: recordForm.value.value,
      unit: recordForm.value.unit,
      synced: isOnline.value,
      createdAt: new Date().toISOString()
    }
    
    // Add to local storage
    healthRecords.value.unshift(newRecord)
    saveToLocalStorage()
    
    // Reset form
    recordForm.value = {
      date: '',
      type: '',
      title: '',
      description: '',
      value: '',
      unit: ''
    }
    
    statusMessage.value = isOnline.value ? 'Record added and synced successfully!' : 'Record added offline - will sync when connection is restored'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Error adding record:', error)
    statusMessage.value = 'Error adding record. Please try again.'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  } finally {
    isAdding.value = false
  }
}

const editRecord = (record) => {
  // Implementation for editing records
  console.log('Editing record:', record)
  alert('Edit functionality would be implemented here')
}

const deleteRecord = (recordId) => {
  if (confirm('Are you sure you want to delete this record?')) {
    healthRecords.value = healthRecords.value.filter(r => r.id !== recordId)
    saveToLocalStorage()
    statusMessage.value = 'Record deleted successfully'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  }
}

const filterByType = (type) => {
  currentFilter.value = type
}

const syncRecords = async () => {
  if (!isOnline.value) {
    statusMessage.value = 'Cannot sync while offline'
    return
  }
  
  const pendingRecords = healthRecords.value.filter(r => !r.synced)
  
  if (pendingRecords.length === 0) {
    statusMessage.value = 'No records to sync'
    return
  }
  
  try {
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mark all records as synced
    healthRecords.value.forEach(record => {
      record.synced = true
    })
    
    saveToLocalStorage()
    statusMessage.value = `Successfully synced ${pendingRecords.length} records`
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Sync error:', error)
    statusMessage.value = 'Error syncing records. Please try again.'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  }
}

const exportRecords = () => {
  const dataStr = JSON.stringify(healthRecords.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `health-records-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  URL.revokeObjectURL(url)
  statusMessage.value = 'Records exported successfully'
  
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

const clearAllRecords = () => {
  if (confirm('Are you sure you want to clear all records? This action cannot be undone.')) {
    healthRecords.value = []
    localStorage.removeItem('healthRecords')
    statusMessage.value = 'All records cleared successfully'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  }
}

const saveToLocalStorage = () => {
  try {
    localStorage.setItem('healthRecords', JSON.stringify(healthRecords.value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

const loadFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('healthRecords')
    if (saved) {
      healthRecords.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
}

// Network status handlers
const handleOnline = () => {
  isOnline.value = true
  statusMessage.value = 'Connection restored - pending records will sync automatically'
  
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

const handleOffline = () => {
  isOnline.value = false
  statusMessage.value = 'Connection lost - working in offline mode'
  
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}

// Auto-sync when coming back online
watch(isOnline, (newValue) => {
  if (newValue && pendingRecords.value > 0) {
    setTimeout(() => {
      syncRecords()
    }, 1000)
  }
})

// Lifecycle
onMounted(() => {
  loadFromLocalStorage()
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<style scoped>
.offline-health-records-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.network-status {
  margin-bottom: 20px;
}

.status-icon {
  font-size: 1.2rem;
}

.status-details {
  font-size: 0.9rem;
  opacity: 0.8;
}

.records-form-section {
  margin-bottom: 30px;
}

.records-list-section {
  margin-bottom: 20px;
}

.records-controls {
  display: flex;
  gap: 8px;
}

.records-list {
  max-height: 500px;
  overflow-y: auto;
}

.record-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  background: white;
  transition: all 0.3s ease;
}

.record-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.record-item.pending-sync {
  border-left: 4px solid #ffc107;
  background: #fffbf0;
}

.record-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.record-type-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.record-info {
  flex: 1;
}

.record-title {
  margin: 0 0 5px 0;
  font-weight: 600;
  color: #333;
}

.record-meta {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: #6c757d;
}

.record-value {
  font-weight: 500;
  color: #007bff;
}

.record-actions {
  display: flex;
  gap: 5px;
}

.record-description {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e9ecef;
  color: #666;
  font-size: 0.9rem;
}

.sync-status {
  margin-top: 10px;
  text-align: right;
}

.sync-indicator {
  font-size: 0.8rem;
  color: #ffc107;
  font-weight: 500;
}

.sync-section {
  margin-top: 30px;
}

.sync-stats {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 5px;
}

.sync-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
  .offline-health-records-container {
    padding: 15px;
  }
  
  .record-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .record-meta {
    flex-direction: column;
    gap: 5px;
  }
  
  .sync-actions {
    flex-direction: column;
  }
  
  .sync-actions .btn {
    width: 100%;
  }
}

/* High contrast support */
.high-contrast .record-item {
  border: 2px solid #000;
}

.high-contrast .record-item.pending-sync {
  border-left: 4px solid #000;
  background: #fff;
}

.high-contrast .stat-item {
  border: 2px solid #000;
}
</style>
