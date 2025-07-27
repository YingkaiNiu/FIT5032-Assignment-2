<template>
  <div class="dashboard">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h3 mb-0">Dashboard</h1>
              <p class="text-muted mb-0">Welcome back, {{ user?.firstName }}!</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary" @click="refreshData">
                <i class="bi bi-arrow-clockwise"></i> Refresh
              </button>
              <button class="btn btn-primary" @click="exportData">
                <i class="bi bi-download"></i> Export
              </button>
              <button class="btn btn-outline-danger" @click="logout">
                <i class="bi bi-box-arrow-right"></i> Logout
              </button>
              <button class="btn btn-warning" @click="testLogout">
                <i class="bi bi-exclamation-triangle"></i> Test Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-primary shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Products
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ stats.totalProducts }}</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-box h2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-success shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Active Users
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ stats.activeUsers }}</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-people h2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-info shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Recent Orders
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">{{ stats.recentOrders }}</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-cart h2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="card border-left-warning shadow h-100 py-2">
            <div class="card-body">
              <div class="row no-gutters align-items-center">
                <div class="col mr-2">
                  <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Revenue
                  </div>
                  <div class="h5 mb-0 font-weight-bold text-gray-800">${{ stats.revenue.toLocaleString() }}</div>
                </div>
                <div class="col-auto">
                  <i class="bi bi-currency-dollar h2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Row -->
      <div class="row">
        <!-- Recent Activities -->
        <div class="col-lg-8 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-primary">Recent Activities</h6>
              <div class="dropdown no-arrow">
                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
                  <i class="bi bi-three-dots-vertical text-gray-400"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in">
                  <a class="dropdown-item" href="#" @click="viewAllActivities">View All</a>
                  <a class="dropdown-item" href="#" @click="exportActivities">Export</a>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="activity-list">
                <div v-for="activity in recentActivities" :key="activity.id" class="activity-item d-flex align-items-center py-3 border-bottom">
                  <div class="activity-icon me-3">
                    <i :class="getActivityIcon(activity.type)" class="h4 mb-0"></i>
                  </div>
                  <div class="activity-content flex-grow-1">
                    <h6 class="mb-1">{{ activity.title }}</h6>
                    <p class="text-muted mb-0 small">{{ activity.description }}</p>
                    <small class="text-muted">{{ formatDate(activity.timestamp) }}</small>
                  </div>
                  <div class="activity-status">
                    <span :class="getStatusBadgeClass(activity.status)" class="badge">
                      {{ activity.status }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="col-lg-4 mb-4">
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Quick Actions</h6>
            </div>
            <div class="card-body">
              <div class="d-grid gap-2">
                <router-link to="/products" class="btn btn-outline-primary">
                  <i class="bi bi-box me-2"></i>Manage Products
                </router-link>
                <router-link to="/users" v-if="isAdmin" class="btn btn-outline-success">
                  <i class="bi bi-people me-2"></i>Manage Users
                </router-link>
                <button class="btn btn-outline-info" @click="generateReport">
                  <i class="bi bi-file-earmark-text me-2"></i>Generate Report
                </button>
                <button class="btn btn-outline-warning" @click="showSettings">
                  <i class="bi bi-gear me-2"></i>Settings
                </button>
              </div>
            </div>
          </div>

          <!-- System Status -->
          <div class="card shadow mb-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">System Status</h6>
            </div>
            <div class="card-body">
              <div class="status-item d-flex justify-content-between align-items-center mb-3">
                <span>Database</span>
                <span class="badge bg-success">Online</span>
              </div>
              <div class="status-item d-flex justify-content-between align-items-center mb-3">
                <span>API Services</span>
                <span class="badge bg-success">Online</span>
              </div>
              <div class="status-item d-flex justify-content-between align-items-center mb-3">
                <span>File Storage</span>
                <span class="badge bg-warning">Warning</span>
              </div>
              <div class="status-item d-flex justify-content-between align-items-center">
                <span>Email Service</span>
                <span class="badge bg-success">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const loading = ref(false)
    
    const user = computed(() => authStore.user)
    const isAdmin = computed(() => user.value?.role === 'admin')
    
    const stats = reactive({
      totalProducts: 0,
      activeUsers: 0,
      recentOrders: 0,
      revenue: 0
    })
    
    const recentActivities = ref([])

    const loadDashboardData = async () => {
      loading.value = true
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data
        stats.totalProducts = 156
        stats.activeUsers = 89
        stats.recentOrders = 23
        stats.revenue = 45678
        
        recentActivities.value = [
          {
            id: 1,
            type: 'product',
            title: 'New product added',
            description: 'Product "Vue.js Development Guide" was added to the catalog',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: 'completed'
          },
          {
            id: 2,
            type: 'user',
            title: 'User registration',
            description: 'New user "john.doe@example.com" registered',
            timestamp: new Date(Date.now() - 1000 * 60 * 60),
            status: 'pending'
          },
          {
            id: 3,
            type: 'order',
            title: 'Order processed',
            description: 'Order #12345 was successfully processed',
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
            status: 'completed'
          },
          {
            id: 4,
            type: 'system',
            title: 'System backup',
            description: 'Daily system backup completed successfully',
            timestamp: new Date(Date.now() - 1000 * 60 * 180),
            status: 'completed'
          }
        ]
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        loading.value = false
      }
    }

    const getActivityIcon = (type) => {
      const icons = {
        product: 'bi bi-box text-primary',
        user: 'bi bi-person text-success',
        order: 'bi bi-cart text-info',
        system: 'bi bi-gear text-warning'
      }
      return icons[type] || 'bi bi-info-circle text-secondary'
    }

    const getStatusBadgeClass = (status) => {
      const classes = {
        completed: 'bg-success',
        pending: 'bg-warning',
        failed: 'bg-danger'
      }
      return classes[status] || 'bg-secondary'
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }

    const refreshData = () => {
      loadDashboardData()
    }

    const exportData = () => {
      // Implementation for data export
      console.log('Exporting dashboard data...')
    }

    const viewAllActivities = () => {
      // Implementation for viewing all activities
      console.log('Viewing all activities...')
    }

    const exportActivities = () => {
      // Implementation for exporting activities
      console.log('Exporting activities...')
    }

    const generateReport = () => {
      // Implementation for generating reports
      console.log('Generating report...')
    }

    const showSettings = () => {
      // Implementation for showing settings
      console.log('Showing settings...')
    }

    const logout = () => {
      console.log('Logout function called from Dashboard')
      alert('Logout function is working!')
      authStore.logout()
      console.log('Auth store logout completed')
      // Redirect to logout success page
      router.push('/logout-success')
      console.log('Router push completed')
    }

    const testLogout = () => {
      console.log('Test Logout function called')
      alert('Test Logout function is working!')
      authStore.logout()
      console.log('Auth store logout completed for test')
      // Redirect to logout success page
      router.push('/logout-success')
      console.log('Router push completed for test')
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      user,
      isAdmin,
      stats,
      recentActivities,
      loading,
      getActivityIcon,
      getStatusBadgeClass,
      formatDate,
      refreshData,
      exportData,
      viewAllActivities,
      exportActivities,
      generateReport,
      showSettings,
      logout,
      testLogout
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 2rem 0;
  background-color: #f8f9fc;
  min-height: 100vh;
}

.border-left-primary {
  border-left: 0.25rem solid #4e73df !important;
}

.border-left-success {
  border-left: 0.25rem solid #1cc88a !important;
}

.border-left-info {
  border-left: 0.25rem solid #36b9cc !important;
}

.border-left-warning {
  border-left: 0.25rem solid #f6c23e !important;
}

.text-xs {
  font-size: 0.7rem;
}

.text-gray-800 {
  color: #5a5c69 !important;
}

.text-gray-300 {
  color: #dddfeb !important;
}

.text-gray-400 {
  color: #858796 !important;
}

.activity-item:last-child {
  border-bottom: none !important;
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f8f9fc;
}

.status-item {
  padding: 0.5rem 0;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .card-body {
    padding: 1rem;
  }
}
</style> 