<template>
  <div class="admin-dashboard-container" role="region" aria-labelledby="dashboard-heading">
    <h3 id="dashboard-heading">管理员仪表板</h3>
    
    <!-- Dashboard Stats -->
    <div class="stats-row mb-4">
      <div class="row">
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon bg-primary">
              <span aria-hidden="true">👥</span>
            </div>
            <div class="stat-content">
              <h4 class="stat-number">{{ stats.totalUsers }}</h4>
              <p class="stat-label">总用户数</p>
              <small class="stat-change" :class="stats.userGrowth >= 0 ? 'text-success' : 'text-danger'">
                <span aria-hidden="true">{{ stats.userGrowth >= 0 ? '↗' : '↘' }}</span>
                {{ Math.abs(stats.userGrowth) }}% 本月
              </small>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon bg-success">
              <span aria-hidden="true">📅</span>
            </div>
            <div class="stat-content">
              <h4 class="stat-number">{{ stats.totalAppointments }}</h4>
              <p class="stat-label">总预约数</p>
              <small class="stat-change" :class="stats.appointmentGrowth >= 0 ? 'text-success' : 'text-danger'">
                <span aria-hidden="true">{{ stats.appointmentGrowth >= 0 ? '↗' : '↘' }}</span>
                {{ Math.abs(stats.appointmentGrowth) }}% 本月
              </small>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon bg-warning">
              <span aria-hidden="true">🏥</span>
            </div>
            <div class="stat-content">
              <h4 class="stat-number">{{ stats.activeServices }}</h4>
              <p class="stat-label">活跃服务</p>
              <small class="stat-change text-info">
                <span aria-hidden="true">●</span>
                实时更新
              </small>
            </div>
          </div>
        </div>
        
        <div class="col-md-3 mb-3">
          <div class="stat-card">
            <div class="stat-icon bg-info">
              <span aria-hidden="true">⭐</span>
            </div>
            <div class="stat-content">
              <h4 class="stat-number">{{ stats.avgRating }}</h4>
              <p class="stat-label">平均评分</p>
              <small class="stat-change text-warning">
                <span aria-hidden="true">★</span>
                5分制
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row mb-4">
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="chart-card">
            <h5 class="chart-title">用户注册趋势</h5>
            <div class="chart-container">
              <Line 
                :data="userTrendData" 
                :options="lineChartOptions"
                aria-label="用户注册趋势图表"
              />
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="chart-card">
            <h5 class="chart-title">服务类型分布</h5>
            <div class="chart-container">
              <Doughnut 
                :data="serviceTypeData" 
                :options="doughnutChartOptions"
                aria-label="服务类型分布图表"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Charts -->
    <div class="charts-row mb-4">
      <div class="row">
        <div class="col-md-8 mb-4">
          <div class="chart-card">
            <h5 class="chart-title">预约时间分布</h5>
            <div class="chart-container">
              <Bar 
                :data="appointmentTimeData" 
                :options="barChartOptions"
                aria-label="预约时间分布图表"
              />
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-4">
          <div class="chart-card">
            <h5 class="chart-title">用户满意度</h5>
            <div class="chart-container">
              <Pie 
                :data="satisfactionData" 
                :options="pieChartOptions"
                aria-label="用户满意度图表"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time Activity -->
    <div class="activity-row">
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="activity-card">
            <h5 class="activity-title">实时活动</h5>
            <div class="activity-list" role="list" aria-label="实时活动列表">
              <div 
                v-for="activity in recentActivities" 
                :key="activity.id"
                class="activity-item"
                role="listitem"
              >
                <div class="activity-icon" :class="getActivityIconClass(activity.type)">
                  <span aria-hidden="true">{{ getActivityIcon(activity.type) }}</span>
                </div>
                <div class="activity-content">
                  <p class="activity-text">{{ activity.text }}</p>
                  <small class="activity-time">{{ formatTime(activity.timestamp) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="activity-card">
            <h5 class="activity-title">系统状态</h5>
            <div class="system-status">
              <div class="status-item">
                <span class="status-label">服务器状态</span>
                <span class="status-indicator online" aria-label="服务器在线"></span>
                <span class="status-text">在线</span>
              </div>
              <div class="status-item">
                <span class="status-label">数据库连接</span>
                <span class="status-indicator online" aria-label="数据库连接正常"></span>
                <span class="status-text">正常</span>
              </div>
              <div class="status-item">
                <span class="status-label">API服务</span>
                <span class="status-indicator online" aria-label="API服务正常"></span>
                <span class="status-text">正常</span>
              </div>
              <div class="status-item">
                <span class="status-label">邮件服务</span>
                <span class="status-indicator online" aria-label="邮件服务正常"></span>
                <span class="status-text">正常</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="text-center mt-4">
      <button 
        class="btn btn-primary"
        @click="refreshDashboard"
        @keydown.enter="refreshDashboard"
        @keydown.space="refreshDashboard"
        :disabled="isRefreshing"
        aria-label="刷新仪表板数据"
      >
        <span v-if="isRefreshing" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        <span v-else aria-hidden="true">🔄</span>
        <span class="ms-1">{{ isRefreshing ? '刷新中...' : '刷新数据' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Line, Doughnut, Bar, Pie } from 'vue-chartjs'
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
  BarElement
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
  BarElement
)

// Dashboard state
const isRefreshing = ref(false)

// Sample dashboard data
const stats = ref({
  totalUsers: 1247,
  userGrowth: 12.5,
  totalAppointments: 3421,
  appointmentGrowth: 8.3,
  activeServices: 15,
  avgRating: 4.6
})

const recentActivities = ref([
  {
    id: 1,
    type: 'user_register',
    text: '新用户 张三 注册了账户',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    type: 'appointment_book',
    text: '李四 预约了健康咨询服务',
    timestamp: new Date(Date.now() - 12 * 60 * 1000)
  },
  {
    id: 3,
    type: 'service_complete',
    text: '王五 完成了物理治疗服务',
    timestamp: new Date(Date.now() - 25 * 60 * 1000)
  },
  {
    id: 4,
    type: 'rating_submit',
    text: '赵六 提交了5星评价',
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: 5,
    type: 'system_alert',
    text: '系统备份完成',
    timestamp: new Date(Date.now() - 60 * 60 * 1000)
  }
])

// Chart data
const userTrendData = computed(() => ({
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [
    {
      label: '用户注册数',
      data: [120, 190, 300, 500, 800, 1247],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }
  ]
}))

const serviceTypeData = computed(() => ({
  labels: ['健康咨询', '物理治疗', '药物检查', '紧急护理', '康复训练'],
  datasets: [
    {
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }
  ]
}))

const appointmentTimeData = computed(() => ({
  labels: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
  datasets: [
    {
      label: '预约数量',
      data: [12, 19, 8, 25, 22, 15],
      backgroundColor: 'rgba(54, 162, 235, 0.8)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    }
  ]
}))

const satisfactionData = computed(() => ({
  labels: ['非常满意', '满意', '一般', '不满意'],
  datasets: [
    {
      data: [45, 35, 15, 5],
      backgroundColor: [
        '#4CAF50',
        '#8BC34A',
        '#FFC107',
        '#F44336'
      ]
    }
  ]
}))

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

// Methods
const getActivityIcon = (type) => {
  const icons = {
    user_register: '👤',
    appointment_book: '📅',
    service_complete: '✅',
    rating_submit: '⭐',
    system_alert: '🔔'
  }
  return icons[type] || '📝'
}

const getActivityIconClass = (type) => {
  const classes = {
    user_register: 'bg-primary',
    appointment_book: 'bg-success',
    service_complete: 'bg-info',
    rating_submit: 'bg-warning',
    system_alert: 'bg-secondary'
  }
  return classes[type] || 'bg-secondary'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  
  const days = Math.floor(hours / 24)
  return `${days}天前`
}

const refreshDashboard = async () => {
  isRefreshing.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Update stats with random variations
  stats.value = {
    totalUsers: stats.value.totalUsers + Math.floor(Math.random() * 10),
    userGrowth: (Math.random() * 20 - 10).toFixed(1),
    totalAppointments: stats.value.totalAppointments + Math.floor(Math.random() * 20),
    appointmentGrowth: (Math.random() * 15 - 5).toFixed(1),
    activeServices: 15 + Math.floor(Math.random() * 5),
    avgRating: (4 + Math.random()).toFixed(1)
  }
  
  // Add new activity
  const newActivity = {
    id: Date.now(),
    type: 'system_alert',
    text: '仪表板数据已更新',
    timestamp: new Date()
  }
  
  recentActivities.value.unshift(newActivity)
  if (recentActivities.value.length > 10) {
    recentActivities.value.pop()
  }
  
  isRefreshing.value = false
}

// Auto-refresh every 30 seconds
let refreshInterval = null

onMounted(() => {
  refreshInterval = setInterval(() => {
    if (!isRefreshing.value) {
      refreshDashboard()
    }
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped>
.admin-dashboard-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 15px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.stat-label {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.stat-change {
  font-size: 0.8rem;
  font-weight: 500;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.chart-title {
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

.chart-container {
  height: 300px;
  position: relative;
}

.activity-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.activity-title {
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 12px;
  color: white;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 5px 0;
  font-size: 0.9rem;
  color: #333;
}

.activity-time {
  color: #666;
  font-size: 0.8rem;
}

.system-status {
  padding: 10px 0;
}

.status-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  flex: 1;
  font-size: 0.9rem;
  color: #333;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 10px;
}

.status-indicator.online {
  background-color: #28a745;
}

.status-indicator.offline {
  background-color: #dc3545;
}

.status-text {
  font-size: 0.8rem;
  color: #666;
  min-width: 40px;
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
.btn:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .admin-dashboard-container {
    padding: 15px;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
  
  .stat-number {
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

.high-contrast .chart-card,
.high-contrast .activity-card {
  border: 2px solid #000;
}

.high-contrast .activity-item {
  border-bottom-color: #000;
}

.high-contrast .status-item {
  border-bottom-color: #000;
}
</style>
