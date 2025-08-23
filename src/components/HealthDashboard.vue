<template>
  <div class="health-dashboard-container" role="region" aria-labelledby="dashboard-heading">
    <h3 id="dashboard-heading">Health Analytics Dashboard</h3>
    
    <!-- Dashboard Overview -->
    <div class="dashboard-overview mb-4">
      <div class="row">
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h4>{{ totalUsers }}</h4>
              <p>Total Users</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">🏥</div>
            <div class="stat-content">
              <h4>{{ activeServices }}</h4>
              <p>Active Services</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <h4>{{ appointmentsToday }}</h4>
              <p>Today's Appointments</p>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <h4>{{ averageRating }}/5</h4>
              <p>Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="charts-section">
      <div class="row">
        <!-- User Growth Chart -->
        <div class="col-lg-6 mb-4">
          <div class="chart-card">
            <h5>User Growth Trend</h5>
            <div class="chart-container">
              <Line
                :data="userGrowthData"
                :options="chartOptions"
                aria-label="User growth chart showing monthly user registrations"
              />
            </div>
          </div>
        </div>
        
        <!-- Service Distribution Chart -->
        <div class="col-lg-6 mb-4">
          <div class="chart-card">
            <h5>Service Category Distribution</h5>
            <div class="chart-container">
              <Doughnut
                :data="serviceDistributionData"
                :options="doughnutOptions"
                aria-label="Service distribution chart showing different service categories"
              />
            </div>
          </div>
        </div>
        
        <!-- Monthly Appointments Chart -->
        <div class="col-lg-8 mb-4">
          <div class="chart-card">
            <h5>Monthly Appointment Trends</h5>
            <div class="chart-container">
              <Bar
                :data="appointmentData"
                :options="barChartOptions"
                aria-label="Monthly appointment trends chart"
              />
            </div>
          </div>
        </div>
        
        <!-- Health Metrics Chart -->
        <div class="col-lg-4 mb-4">
          <div class="chart-card">
            <h5>Health Metrics Overview</h5>
            <div class="chart-container">
              <Radar
                :data="healthMetricsData"
                :options="radarOptions"
                aria-label="Health metrics radar chart"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Real-time Updates -->
    <div class="real-time-updates mt-4">
      <h5>Real-time Activity</h5>
      <div class="activity-feed">
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon">{{ activity.icon }}</div>
          <div class="activity-content">
            <div class="activity-text">{{ activity.text }}</div>
            <div class="activity-time">{{ formatTime(activity.timestamp) }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Export Options -->
    <div class="export-section mt-4">
      <div class="d-flex justify-content-between align-items-center">
        <h5>Export Dashboard Data</h5>
        <div class="btn-group">
          <button
            @click="exportDashboard('csv')"
            class="btn btn-outline-success"
            aria-label="Export dashboard data as CSV"
          >
            📊 CSV Export
          </button>
          <button
            @click="exportDashboard('pdf')"
            class="btn btn-outline-danger"
            aria-label="Export dashboard data as PDF"
          >
            📄 PDF Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Line, Doughnut, Bar, Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  RadialLinearScale
)

// Dashboard data
const totalUsers = ref(1247)
const activeServices = ref(23)
const appointmentsToday = ref(45)
const averageRating = ref(4.6)

// Sample data for charts
const userGrowthData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'New Users',
      data: [120, 190, 300, 500, 200, 300],
      borderColor: '#007bff',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      tension: 0.4
    }
  ]
})

const serviceDistributionData = ref({
  labels: ['Hospitals', 'Pharmacies', 'Clinics', 'Support Services'],
  datasets: [
    {
      data: [35, 25, 25, 15],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0'
      ]
    }
  ]
})

const appointmentData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Appointments',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(54, 162, 235, 0.8)'
    }
  ]
})

const healthMetricsData = ref({
  labels: ['Physical Health', 'Mental Health', 'Nutrition', 'Exercise', 'Sleep', 'Social'],
  datasets: [
    {
      label: 'Current Month',
      data: [85, 75, 90, 70, 80, 85],
      borderColor: '#FF6384',
      backgroundColor: 'rgba(255, 99, 132, 0.2)'
    },
    {
      label: 'Previous Month',
      data: [80, 70, 85, 65, 75, 80],
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.2)'
    }
  ]
})

// Recent activities
const recentActivities = ref([
  {
    id: 1,
    icon: '👤',
    text: 'New user registration: John Smith',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    icon: '📅',
    text: 'Appointment scheduled: Dr. Johnson - 2:30 PM',
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 3,
    icon: '⭐',
    text: 'New review posted: 5 stars for Melbourne Health',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 4,
    icon: '🏥',
    text: 'Service updated: New clinic location added',
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  }
])

// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
})

const doughnutOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
})

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
})

const radarOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    r: {
      beginAtZero: true,
      max: 100
    }
  }
})

// Methods
const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minutes ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  
  return timestamp.toLocaleDateString()
}

const exportDashboard = (format) => {
  // Implementation for exporting dashboard data
  console.log(`Exporting dashboard data as ${format}`)
  alert(`Dashboard data exported as ${format.toUpperCase()}`)
}

// Simulate real-time updates
onMounted(() => {
  setInterval(() => {
    // Update some metrics randomly
    appointmentsToday.value += Math.floor(Math.random() * 3) - 1
    if (appointmentsToday.value < 0) appointmentsToday.value = 0
    
    // Add new activity
    const activities = [
      { icon: '👤', text: 'New user registration' },
      { icon: '📅', text: 'Appointment scheduled' },
      { icon: '⭐', text: 'New review posted' },
      { icon: '🏥', text: 'Service updated' }
    ]
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)]
    recentActivities.value.unshift({
      id: Date.now(),
      icon: randomActivity.icon,
      text: randomActivity.text,
      timestamp: new Date()
    })
    
    // Keep only last 10 activities
    if (recentActivities.value.length > 10) {
      recentActivities.value = recentActivities.value.slice(0, 10)
    }
  }, 30000) // Update every 30 seconds
})
</script>

<style scoped>
.health-dashboard-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.dashboard-overview {
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.9;
}

.stat-content h4 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.stat-content p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.chart-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-card h5 {
  margin-bottom: 15px;
  color: #333;
  font-weight: 600;
}

.chart-container {
  height: 300px;
  position: relative;
}

.real-time-updates {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.real-time-updates h5 {
  margin-bottom: 15px;
  color: #333;
}

.activity-feed {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.2rem;
  width: 30px;
  text-align: center;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.activity-time {
  font-size: 0.8rem;
  color: #6c757d;
}

.export-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.export-section h5 {
  margin: 0;
  color: #333;
}

/* Accessibility improvements */
.stat-card:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

.chart-card:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

.btn:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .health-dashboard-container {
    padding: 15px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-content h4 {
    font-size: 1.5rem;
  }
  
  .chart-container {
    height: 250px;
  }
}

/* High contrast support */
.high-contrast .stat-card {
  border: 2px solid #000;
}

.high-contrast .chart-card {
  border: 2px solid #000;
}

.high-contrast .activity-item {
  border-bottom-color: #000;
}
</style>
