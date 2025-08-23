<template>
  <div class="innovation-view-container">
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="page-header mb-4">
        <h1>Innovation Features</h1>
        <p class="lead">Advanced healthcare technology features to enhance your experience</p>
      </div>
      
      <!-- Debug Info -->
      <div v-if="debugInfo" class="alert alert-info mb-4">
        <h5>Debug Information</h5>
        <p>Active Feature: {{ activeFeature }}</p>
        <p>Components Loaded: {{ componentsLoaded }}</p>
        <p>Error: {{ componentError || 'None' }}</p>
      </div>
      
      <!-- Feature Navigation -->
      <div class="feature-navigation mb-4">
        <div class="row">
          <div class="col-12">
            <div class="nav nav-pills justify-content-center" role="tablist">
              <button
                v-for="feature in features"
                :key="feature.id"
                @click="activeFeature = feature.id"
                class="nav-link"
                :class="{ active: activeFeature === feature.id }"
                :aria-selected="activeFeature === feature.id"
                :aria-controls="`${feature.id}-tab`"
                role="tab"
              >
                <span class="feature-icon me-2" aria-hidden="true">{{ feature.icon }}</span>
                {{ feature.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Feature Content -->
      <div class="feature-content">
        <div class="tab-content">
          <!-- Health Goal Tracker -->
          <div
            v-show="activeFeature === 'goal-tracker'"
            class="tab-pane fade"
            :class="{ 'show active': activeFeature === 'goal-tracker' }"
            role="tabpanel"
            aria-labelledby="goal-tracker-tab"
          >
            <div class="row">
              <div class="col-12">
                <div v-if="componentError" class="alert alert-danger">
                  <h4>Component Error</h4>
                  <p>{{ componentError }}</p>
                </div>
                <div v-else-if="!componentsLoaded" class="alert alert-warning">
                  <h4>Loading Components...</h4>
                  <p>Please wait while components are being loaded.</p>
                </div>
                <div v-else>
                  <HealthGoalTracker />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Health Reminder System -->
          <div
            v-show="activeFeature === 'reminder'"
            class="tab-pane fade"
            :class="{ 'show active': activeFeature === 'reminder' }"
            role="tabpanel"
            aria-labelledby="reminder-tab"
          >
            <div class="row">
              <div class="col-12">
                <div v-if="componentError" class="alert alert-danger">
                  <h4>Component Error</h4>
                  <p>{{ componentError }}</p>
                </div>
                <div v-else-if="!componentsLoaded" class="alert alert-warning">
                  <h4>Loading Components...</h4>
                  <p>Please wait while components are being loaded.</p>
                </div>
                <div v-else>
                  <HealthReminder />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Health Dashboard -->
          <div
            v-show="activeFeature === 'dashboard'"
            class="tab-pane fade"
            :class="{ 'show active': activeFeature === 'dashboard' }"
            role="tabpanel"
            aria-labelledby="dashboard-tab"
          >
            <div class="row">
              <div class="col-12">
                <div v-if="componentError" class="alert alert-danger">
                  <h4>Component Error</h4>
                  <p>{{ componentError }}</p>
                </div>
                <div v-else-if="!componentsLoaded" class="alert alert-warning">
                  <h4>Loading Components...</h4>
                  <p>Please wait while components are being loaded.</p>
                </div>
                <div v-else>
                  <HealthDashboard />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Appointment Scheduler -->
          <div
            v-show="activeFeature === 'scheduler'"
            class="tab-pane fade"
            :class="{ 'show active': activeFeature === 'scheduler' }"
            role="tabpanel"
            aria-labelledby="scheduler-tab"
          >
            <div class="row">
              <div class="col-12">
                <div v-if="componentError" class="alert alert-danger">
                  <h4>Component Error</h4>
                  <p>{{ componentError }}</p>
                </div>
                <div v-else-if="!componentsLoaded" class="alert alert-warning">
                  <h4>Loading Components...</h4>
                  <p>Please wait while components are being loaded.</p>
                </div>
                <div v-else>
                  <AppointmentScheduler />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Offline Records -->
          <div
            v-show="activeFeature === 'records'"
            class="tab-pane fade"
            :class="{ 'show active': activeFeature === 'records' }"
            role="tabpanel"
            aria-labelledby="records-tab"
          >
            <div class="row">
              <div class="col-12">
                <div v-if="componentError" class="alert alert-danger">
                  <h4>Component Error</h4>
                  <p>{{ componentError }}</p>
                </div>
                <div v-else-if="!componentsLoaded" class="alert alert-warning">
                  <h4>Loading Components...</h4>
                  <p>Please wait while components are being loaded.</p>
                </div>
                <div v-else>
                  <OfflineHealthRecords />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Feature Information -->
      <div class="feature-info mt-5">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3>About These Innovation Features</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div 
                    v-for="feature in features" 
                    :key="feature.id"
                    class="col-md-6 col-lg-3 mb-4"
                  >
                    <div class="feature-card">
                      <div class="feature-icon-large mb-3">{{ feature.icon }}</div>
                      <h5>{{ feature.name }}</h5>
                      <p class="feature-description">{{ feature.description }}</p>
                      <div class="feature-benefits">
                        <h6>Benefits:</h6>
                        <ul>
                          <li v-for="benefit in feature.benefits" :key="benefit">{{ benefit }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
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
import { ref, onMounted, onErrorCaptured } from 'vue'

// Static imports
import HealthGoalTracker from '../components/HealthGoalTracker.vue'
import HealthReminder from '../components/HealthReminder.vue'
import HealthDashboard from '../components/HealthDashboard.vue'
import AppointmentScheduler from '../components/AppointmentScheduler.vue'
import OfflineHealthRecords from '../components/OfflineHealthRecords.vue'

const componentError = ref(null)
const componentsLoaded = ref(false)
const debugInfo = ref(false) // Set to false to hide debug info

// Check if Bootstrap is available
const checkBootstrap = () => {
  if (typeof bootstrap === 'undefined') {
    console.warn('Bootstrap is not available. Some components may not work properly.')
    return false
  }
  return true
}

// Error capture
onErrorCaptured((error) => {
  console.error('Component error captured:', error)
  componentError.value = error.message
  return false
})

onMounted(() => {
  console.log('InnovationView mounted')
  console.log('HealthGoalTracker:', HealthGoalTracker)
  console.log('HealthReminder:', HealthReminder)
  console.log('HealthDashboard:', HealthDashboard)
  console.log('AppointmentScheduler:', AppointmentScheduler)
  console.log('OfflineHealthRecords:', OfflineHealthRecords)
  
  // Check Bootstrap availability
  checkBootstrap()
  
  // Simulate loading delay
  setTimeout(() => {
    componentsLoaded.value = true
    console.log('Components loaded successfully')
  }, 100)
})

// Active feature state
const activeFeature = ref('goal-tracker')

// Features data
const features = ref([
  {
    id: 'goal-tracker',
    name: 'Health Goal Tracker',
    icon: '🎯',
    description: 'Set and track personal health goals with progress monitoring',
    benefits: [
      'Personalized goal setting',
      'Progress tracking and visualization',
      'Category-based organization',
      'Local data storage for privacy'
    ]
  },
  {
    id: 'reminder',
    name: 'Health Reminder System',
    icon: '⏰',
    description: 'Comprehensive health reminder and notification system',
    benefits: [
      'Customizable reminder scheduling',
      'Category-based organization',
      'Daily reminder tracking',
      'Local storage for privacy'
    ]
  },
  {
    id: 'dashboard',
    name: 'Health Analytics Dashboard',
    icon: '📊',
    description: 'Comprehensive health data visualization and analytics platform',
    benefits: [
      'Real-time health metrics tracking',
      'Interactive data visualization',
      'Trend analysis and insights',
      'Export capabilities for reports'
    ]
  },
  {
    id: 'scheduler',
    name: 'Smart Appointment Scheduler',
    icon: '📅',
    description: 'Intelligent calendar-based appointment management system',
    benefits: [
      'Conflict detection and prevention',
      'Drag-and-drop appointment management',
      'Multiple calendar views',
      'Automated reminders and notifications'
    ]
  },
  {
    id: 'records',
    name: 'Offline Health Records',
    icon: '📱',
    description: 'Offline-capable health record management with automatic synchronization',
    benefits: [
      'Works without internet connection',
      'Automatic data synchronization',
      'Local data storage and security',
      'Cross-device data access'
    ]
  }
])
</script>

<style scoped>
.innovation-view-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.page-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.page-header .lead {
  font-size: 1.2rem;
  opacity: 0.9;
}

.feature-navigation {
  margin-bottom: 30px;
}

.nav-pills .nav-link {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 0 5px;
  border-radius: 25px;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.nav-pills .nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-pills .nav-link.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.feature-icon {
  font-size: 1.2rem;
}

.feature-content {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
}

.tab-content {
  padding: 30px;
}

.feature-info {
  margin-top: 40px;
}

.feature-card {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  background: #f8f9fa;
  height: 100%;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon-large {
  font-size: 3rem;
}

.feature-card h5 {
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.feature-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.4;
}

.feature-benefits h6 {
  color: #007bff;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-benefits li {
  color: #555;
  font-size: 0.85rem;
  margin-bottom: 5px;
  padding-left: 15px;
  position: relative;
}

.feature-benefits li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

/* Accessibility improvements */
.nav-link:focus {
  outline: 3px solid #fff;
  outline-offset: 2px;
}

.feature-card:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .innovation-view-container {
    padding: 10px 0;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .page-header .lead {
    font-size: 1rem;
  }
  
  .nav-pills .nav-link {
    margin: 2px;
    padding: 8px 15px;
    font-size: 0.9rem;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .feature-icon-large {
    font-size: 2.5rem;
  }
}

/* High contrast support */
.high-contrast .nav-pills .nav-link {
  border: 2px solid #000;
}

.high-contrast .nav-pills .nav-link.active {
  background: #000;
  color: #fff;
}

.high-contrast .feature-card {
  border: 2px solid #000;
}
</style>
