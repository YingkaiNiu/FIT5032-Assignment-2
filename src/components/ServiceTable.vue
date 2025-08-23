<template>
  <div class="card">
    <div class="card-header">
      <h4>Service Records Table</h4>
    </div>
    <div class="card-body">
      <!-- Global Search -->
      <div class="row mb-3">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text">🔍</span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search all columns..." 
              v-model="globalSearch"
            />
          </div>
        </div>
        <div class="col-md-6 text-end">
          <span class="text-muted">
            Showing {{ paginatedData.length }} of {{ filteredData.length }} records
          </span>
        </div>
      </div>

      <!-- Column Filters -->
      <div class="row mb-3">
        <div class="col-md-3">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Filter by service name..." 
            v-model="columnFilters.serviceName"
          />
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="columnFilters.category">
            <option value="">All Categories</option>
            <option value="healthcare">Healthcare</option>
            <option value="transportation">Transportation</option>
            <option value="social">Social</option>
            <option value="education">Education</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="columnFilters.status">
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="scheduled">Scheduled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="columnFilters.priority">
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th @click="sort('id')" style="cursor: pointer;">
                ID 
                <span v-if="sortKey === 'id'">
                  {{ sortOrders.id === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('serviceName')" style="cursor: pointer;">
                Service Name 
                <span v-if="sortKey === 'serviceName'">
                  {{ sortOrders.serviceName === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('category')" style="cursor: pointer;">
                Category 
                <span v-if="sortKey === 'category'">
                  {{ sortOrders.category === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('clientName')" style="cursor: pointer;">
                Client Name 
                <span v-if="sortKey === 'clientName'">
                  {{ sortOrders.clientName === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('status')" style="cursor: pointer;">
                Status 
                <span v-if="sortKey === 'status'">
                  {{ sortOrders.status === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('priority')" style="cursor: pointer;">
                Priority 
                <span v-if="sortKey === 'priority'">
                  {{ sortOrders.priority === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('duration')" style="cursor: pointer;">
                Duration (hrs) 
                <span v-if="sortKey === 'duration'">
                  {{ sortOrders.duration === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('date')" style="cursor: pointer;">
                Date 
                <span v-if="sortKey === 'date'">
                  {{ sortOrders.date === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in paginatedData" :key="service.id">
              <td>{{ service.id }}</td>
              <td>{{ service.serviceName }}</td>
              <td>
                <span :class="getCategoryBadgeClass(service.category)">
                  {{ service.category }}
                </span>
              </td>
              <td>{{ service.clientName }}</td>
              <td>
                <span :class="getStatusBadgeClass(service.status)">
                  {{ service.status }}
                </span>
              </td>
              <td>
                <span :class="getPriorityBadgeClass(service.priority)">
                  {{ service.priority }}
                </span>
              </td>
              <td>{{ service.duration }}</td>
              <td>{{ formatDate(service.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <span class="text-muted">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
        </div>
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                Previous
              </a>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page" 
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">
                {{ page }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sample data
const services = ref([
  { id: 1, serviceName: 'Home Care Visit', category: 'healthcare', clientName: 'Mary Johnson', status: 'completed', priority: 'high', duration: 2, date: '2024-01-15' },
  { id: 2, serviceName: 'Medical Transport', category: 'transportation', clientName: 'Robert Smith', status: 'in-progress', priority: 'medium', duration: 1.5, date: '2024-01-20' },
  { id: 3, serviceName: 'Social Group Activity', category: 'social', clientName: 'Alice Brown', status: 'scheduled', priority: 'low', duration: 3, date: '2024-02-01' },
  { id: 4, serviceName: 'Medication Review', category: 'healthcare', clientName: 'David Wilson', status: 'completed', priority: 'high', duration: 1, date: '2024-02-05' },
  { id: 5, serviceName: 'Shopping Assistance', category: 'social', clientName: 'Eva Davis', status: 'cancelled', priority: 'medium', duration: 2, date: '2024-02-10' },
  { id: 6, serviceName: 'Physical Therapy', category: 'healthcare', clientName: 'Frank Miller', status: 'in-progress', priority: 'high', duration: 1.5, date: '2024-02-15' },
  { id: 7, serviceName: 'Library Visit', category: 'education', clientName: 'Grace Taylor', status: 'completed', priority: 'low', duration: 2, date: '2024-02-20' },
  { id: 8, serviceName: 'Doctor Appointment', category: 'healthcare', clientName: 'Henry Garcia', status: 'scheduled', priority: 'high', duration: 1, date: '2024-02-25' },
  { id: 9, serviceName: 'Community Center', category: 'social', clientName: 'Iris Martinez', status: 'completed', priority: 'medium', duration: 2.5, date: '2024-03-01' },
  { id: 10, serviceName: 'Pharmacy Pickup', category: 'transportation', clientName: 'Jack Thomas', status: 'in-progress', priority: 'medium', duration: 1, date: '2024-03-05' },
  { id: 11, serviceName: 'Computer Training', category: 'education', clientName: 'Kate Anderson', status: 'scheduled', priority: 'low', duration: 2, date: '2024-03-10' },
  { id: 12, serviceName: 'Emergency Care', category: 'healthcare', clientName: 'Liam Jackson', status: 'completed', priority: 'high', duration: 3, date: '2024-03-15' },
  { id: 13, serviceName: 'Grocery Shopping', category: 'social', clientName: 'Mia White', status: 'in-progress', priority: 'medium', duration: 2, date: '2024-03-20' },
  { id: 14, serviceName: 'Dental Checkup', category: 'healthcare', clientName: 'Noah Harris', status: 'scheduled', priority: 'medium', duration: 1.5, date: '2024-03-25' },
  { id: 15, serviceName: 'Book Club', category: 'education', clientName: 'Olivia Clark', status: 'completed', priority: 'low', duration: 2, date: '2024-03-30' }
])

// Reactive data
const globalSearch = ref('')
const columnFilters = ref({
  serviceName: '',
  category: '',
  status: '',
  priority: ''
})
const currentPage = ref(1)
const itemsPerPage = 10
const sortKey = ref('id')
const sortOrders = ref({
  id: 'asc',
  serviceName: 'asc',
  category: 'asc',
  clientName: 'asc',
  status: 'asc',
  priority: 'asc',
  duration: 'asc',
  date: 'asc'
})

// Computed properties
const filteredData = computed(() => {
  let filtered = services.value

  // Global search
  if (globalSearch.value) {
    const searchTerm = globalSearch.value.toLowerCase()
    filtered = filtered.filter(service => 
      service.serviceName.toLowerCase().includes(searchTerm) ||
      service.category.toLowerCase().includes(searchTerm) ||
      service.clientName.toLowerCase().includes(searchTerm) ||
      service.status.toLowerCase().includes(searchTerm) ||
      service.priority.toLowerCase().includes(searchTerm)
    )
  }

  // Column filters
  if (columnFilters.value.serviceName) {
    filtered = filtered.filter(service => 
      service.serviceName.toLowerCase().includes(columnFilters.value.serviceName.toLowerCase())
    )
  }
  if (columnFilters.value.category) {
    filtered = filtered.filter(service => service.category === columnFilters.value.category)
  }
  if (columnFilters.value.status) {
    filtered = filtered.filter(service => service.status === columnFilters.value.status)
  }
  if (columnFilters.value.priority) {
    filtered = filtered.filter(service => service.priority === columnFilters.value.priority)
  }

  // Sorting
  filtered.sort((a, b) => {
    const aVal = a[sortKey.value]
    const bVal = b[sortKey.value]
    const order = sortOrders.value[sortKey.value] === 'asc' ? 1 : -1
    
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal) * order
    }
    return (aVal - bVal) * order
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredData.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const sort = (key) => {
  if (sortKey.value === key) {
    sortOrders.value[key] = sortOrders.value[key] === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrders.value[key] = 'asc'
  }
  currentPage.value = 1
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getCategoryBadgeClass = (category) => {
  const classes = {
    healthcare: 'badge bg-danger',
    transportation: 'badge bg-primary',
    social: 'badge bg-success',
    education: 'badge bg-info'
  }
  return classes[category] || 'badge bg-secondary'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    completed: 'badge bg-success',
    'in-progress': 'badge bg-warning',
    scheduled: 'badge bg-info',
    cancelled: 'badge bg-secondary'
  }
  return classes[status] || 'badge bg-secondary'
}

const getPriorityBadgeClass = (priority) => {
  const classes = {
    high: 'badge bg-danger',
    medium: 'badge bg-warning',
    low: 'badge bg-success'
  }
  return classes[priority] || 'badge bg-secondary'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Watch for filter changes to reset pagination
const resetPagination = () => {
  currentPage.value = 1
}

// Watch for changes in filters
import { watch } from 'vue'
watch([globalSearch, columnFilters], resetPagination, { deep: true })
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table th {
  cursor: pointer;
  user-select: none;
}

.table th:hover {
  background-color: #495057;
}

.pagination .page-link {
  color: #0d6efd;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
}
</style>
