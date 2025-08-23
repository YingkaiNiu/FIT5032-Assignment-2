<template>
  <div class="table-container" role="region" aria-labelledby="service-table-heading">
    <h3 id="service-table-heading">Service Management Table</h3>
    
    <!-- Search and Controls -->
    <div class="table-controls mb-3">
      <div class="row">
        <div class="col-md-6">
          <label for="service-global-search" class="form-label">Global Search</label>
          <input
            id="service-global-search"
            type="text"
            class="form-control"
            v-model="globalSearch"
            placeholder="Search all columns..."
            aria-describedby="service-global-search-help"
          />
          <div id="service-global-search-help" class="form-text">
            Type to search across all service data
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-3">
              <label for="service-name-filter" class="form-label">Service Filter</label>
              <input
                id="service-name-filter"
                type="text"
                class="form-control"
                v-model="filters.serviceName"
                placeholder="Filter by service..."
                aria-describedby="service-name-filter-help"
              />
              <div id="service-name-filter-help" class="form-text">Filter by service name</div>
            </div>
            <div class="col-md-3">
              <label for="category-filter" class="form-label">Category Filter</label>
              <select
                id="category-filter"
                class="form-select"
                v-model="filters.category"
                aria-describedby="category-filter-help"
              >
                <option value="">All Categories</option>
                <option value="consultation">Consultation</option>
                <option value="treatment">Treatment</option>
                <option value="support">Support</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div id="category-filter-help" class="form-text">Filter by service category</div>
            </div>
            <div class="col-md-3">
              <label for="status-filter" class="form-label">Status Filter</label>
              <select
                id="status-filter"
                class="form-select"
                v-model="filters.status"
                aria-describedby="status-filter-help"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div id="status-filter-help" class="form-text">Filter by service status</div>
            </div>
            <div class="col-md-3">
              <label for="priority-filter" class="form-label">Priority Filter</label>
              <select
                id="priority-filter"
                class="form-select"
                v-model="filters.priority"
                aria-describedby="priority-filter-help"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <div id="priority-filter-help" class="form-text">Filter by priority level</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Export Controls -->
      <div class="row mt-3">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div class="export-info">
              <span class="text-muted">
                找到 {{ filteredServices.length }} 条记录
              </span>
            </div>
            <div class="export-buttons">
              <div class="btn-group" role="group" aria-label="Export options">
                <button
                  type="button"
                  class="btn btn-outline-success"
                  @click="exportData('csv')"
                  @keydown.enter="exportData('csv')"
                  @keydown.space="exportData('csv')"
                  :disabled="isExporting"
                  aria-label="Export to CSV format"
                >
                  <span aria-hidden="true">📊</span>
                  <span class="ms-1">CSV</span>
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  @click="exportData('pdf')"
                  @keydown.enter="exportData('pdf')"
                  @keydown.space="exportData('pdf')"
                  :disabled="isExporting"
                  aria-label="Export to PDF format"
                >
                  <span aria-hidden="true">📄</span>
                  <span class="ms-1">PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-responsive">
      <table 
        class="table table-striped table-hover"
        role="table"
        aria-describedby="service-table-description"
      >
        <caption id="service-table-description" class="sr-only">
          Service management table with sorting and filtering capabilities
        </caption>
        <thead>
          <tr>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('id')"
              @click="sort('id')"
              @keydown.enter="sort('id')"
              @keydown.space="sort('id')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by ID"
            >
              ID
              <span v-if="sortKey === 'id'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('serviceName')"
              @click="sort('serviceName')"
              @keydown.enter="sort('serviceName')"
              @keydown.space="sort('serviceName')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by service name"
            >
              Service Name
              <span v-if="sortKey === 'serviceName'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('category')"
              @click="sort('category')"
              @keydown.enter="sort('category')"
              @keydown.space="sort('category')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by category"
            >
              Category
              <span v-if="sortKey === 'category'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('clientName')"
              @click="sort('clientName')"
              @keydown.enter="sort('clientName')"
              @keydown.space="sort('clientName')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by client name"
            >
              Client Name
              <span v-if="sortKey === 'clientName'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('status')"
              @click="sort('status')"
              @keydown.enter="sort('status')"
              @keydown.space="sort('status')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by status"
            >
              Status
              <span v-if="sortKey === 'status'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('priority')"
              @click="sort('priority')"
              @keydown.enter="sort('priority')"
              @keydown.space="sort('priority')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by priority"
            >
              Priority
              <span v-if="sortKey === 'priority'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('duration')"
              @click="sort('duration')"
              @keydown.enter="sort('duration')"
              @keydown.space="sort('duration')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by duration"
            >
              Duration
              <span v-if="sortKey === 'duration'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('date')"
              @click="sort('date')"
              @keydown.enter="sort('date')"
              @keydown.space="sort('date')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by date"
            >
              Date
              <span v-if="sortKey === 'date'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th scope="col" role="columnheader">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(service, index) in paginatedServices" 
            :key="service.id"
            :aria-rowindex="currentPage * itemsPerPage + index + 1"
            role="row"
          >
            <td 
              role="cell"
              :aria-label="`Service ID: ${service.id}`"
            >
              {{ service.id }}
            </td>
            <td 
              role="cell"
              :aria-label="`Service name: ${service.serviceName}`"
            >
              {{ service.serviceName }}
            </td>
            <td 
              role="cell"
              :aria-label="`Service category: ${service.category}`"
            >
              <span class="badge" :class="getCategoryBadgeClass(service.category)">
                {{ service.category }}
              </span>
            </td>
            <td 
              role="cell"
              :aria-label="`Client name: ${service.clientName}`"
            >
              {{ service.clientName }}
            </td>
            <td 
              role="cell"
              :aria-label="`Service status: ${service.status}`"
            >
              <span class="badge" :class="getStatusBadgeClass(service.status)">
                {{ service.status }}
              </span>
            </td>
            <td 
              role="cell"
              :aria-label="`Service priority: ${service.priority}`"
            >
              <span class="badge" :class="getPriorityBadgeClass(service.priority)">
                {{ service.priority }}
              </span>
            </td>
            <td 
              role="cell"
              :aria-label="`Service duration: ${service.duration} hours`"
            >
              {{ service.duration }}h
            </td>
            <td 
              role="cell"
              :aria-label="`Service date: ${formatDate(service.date)}`"
            >
              {{ formatDate(service.date) }}
            </td>
            <td 
              role="cell"
              :aria-label="`Actions for service ${service.serviceName}`"
            >
              <div class="btn-group" role="group" :aria-label="`Actions for ${service.serviceName}`">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="editService(service)"
                  @keydown.enter="editService(service)"
                  @keydown.space="editService(service)"
                  :aria-label="`Edit service ${service.serviceName}`"
                >
                  <span aria-hidden="true">✏️</span>
                  <span class="sr-only">Edit</span>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteService(service)"
                  @keydown.enter="deleteService(service)"
                  @keydown.space="deleteService(service)"
                  :aria-label="`Delete service ${service.serviceName}`"
                >
                  <span aria-hidden="true">🗑️</span>
                  <span class="sr-only">Delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-container d-flex justify-content-between align-items-center">
      <div class="pagination-info">
        <span class="text-muted">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredServices.length }} services
        </span>
      </div>
      
      <nav aria-label="Service table pagination">
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 0 }">
            <button
              class="page-link"
              @click="goToPage(currentPage - 1)"
              @keydown.enter="goToPage(currentPage - 1)"
              @keydown.space="goToPage(currentPage - 1)"
              :disabled="currentPage === 0"
              aria-label="Go to previous page"
            >
              Previous
            </button>
          </li>
          
          <li 
            v-for="page in visiblePages" 
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage + 1 }"
          >
            <button
              class="page-link"
              @click="goToPage(page - 1)"
              @keydown.enter="goToPage(page - 1)"
              @keydown.space="goToPage(page - 1)"
              :aria-label="`Go to page ${page}`"
              :aria-current="page === currentPage + 1 ? 'page' : undefined"
            >
              {{ page }}
            </button>
          </li>
          
          <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
            <button
              class="page-link"
              @click="goToPage(currentPage + 1)"
              @keydown.enter="goToPage(currentPage + 1)"
              @keydown.space="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages - 1"
              aria-label="Go to next page"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Status announcement for screen readers -->
    <div class="sr-only" aria-live="polite" aria-atomic="true">
      {{ filteredServices.length }} services found. Page {{ currentPage + 1 }} of {{ totalPages }}.
    </div>

    <!-- Export Status Messages -->
    <div v-if="exportStatus" class="alert mt-3" :class="exportStatusClass" role="alert" aria-live="polite">
      <span v-if="exportStatus.type === 'success'" class="me-2" aria-hidden="true">✅</span>
      <span v-else-if="exportStatus.type === 'error'" class="me-2" aria-hidden="true">⚠️</span>
      {{ exportStatus.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { exportServiceData } from '../utils/exportUtils'

// Sample service data
const services = ref([
  { id: 1, serviceName: 'Health Consultation', category: 'consultation', clientName: 'John Smith', status: 'active', priority: 'high', duration: 2, date: '2024-01-15' },
  { id: 2, serviceName: 'Physical Therapy', category: 'treatment', clientName: 'Jane Doe', status: 'completed', priority: 'medium', duration: 1.5, date: '2024-01-20' },
  { id: 3, serviceName: 'Home Care Support', category: 'support', clientName: 'Bob Johnson', status: 'pending', priority: 'low', duration: 4, date: '2024-01-25' },
  { id: 4, serviceName: 'Equipment Maintenance', category: 'maintenance', clientName: 'Alice Brown', status: 'active', priority: 'medium', duration: 1, date: '2024-02-01' },
  { id: 5, serviceName: 'Medical Assessment', category: 'consultation', clientName: 'Charlie Wilson', status: 'cancelled', priority: 'high', duration: 3, date: '2024-02-05' },
  { id: 6, serviceName: 'Rehabilitation Program', category: 'treatment', clientName: 'Diana Davis', status: 'active', priority: 'high', duration: 2.5, date: '2024-02-10' },
  { id: 7, serviceName: 'Emergency Response', category: 'support', clientName: 'Edward Miller', status: 'completed', priority: 'high', duration: 1, date: '2024-02-15' },
  { id: 8, serviceName: 'System Check', category: 'maintenance', clientName: 'Fiona Garcia', status: 'pending', priority: 'low', duration: 0.5, date: '2024-02-20' },
  { id: 9, serviceName: 'Nutrition Counseling', category: 'consultation', clientName: 'George Martinez', status: 'active', priority: 'medium', duration: 1.5, date: '2024-02-25' },
  { id: 10, serviceName: 'Medication Review', category: 'treatment', clientName: 'Helen Taylor', status: 'completed', priority: 'high', duration: 1, date: '2024-03-01' },
  { id: 11, serviceName: 'Family Support', category: 'support', clientName: 'Ian Anderson', status: 'active', priority: 'medium', duration: 2, date: '2024-03-05' },
  { id: 12, serviceName: 'Device Calibration', category: 'maintenance', clientName: 'Julia Thomas', status: 'pending', priority: 'low', duration: 0.5, date: '2024-03-10' }
])

// Table state
const globalSearch = ref('')
const filters = ref({
  serviceName: '',
  category: '',
  status: '',
  priority: ''
})
const sortKey = ref('id')
const sortOrder = ref('asc')
const currentPage = ref(0)
const itemsPerPage = 10

// Export state
const isExporting = ref(false)
const exportStatus = ref(null)

// Computed properties
const filteredServices = computed(() => {
  let filtered = services.value

  // Global search
  if (globalSearch.value) {
    const search = globalSearch.value.toLowerCase()
    filtered = filtered.filter(service =>
      service.serviceName.toLowerCase().includes(search) ||
      service.category.toLowerCase().includes(search) ||
      service.clientName.toLowerCase().includes(search) ||
      service.status.toLowerCase().includes(search) ||
      service.priority.toLowerCase().includes(search)
    )
  }

  // Column filters
  if (filters.value.serviceName) {
    filtered = filtered.filter(service =>
      service.serviceName.toLowerCase().includes(filters.value.serviceName.toLowerCase())
    )
  }

  if (filters.value.category) {
    filtered = filtered.filter(service => service.category === filters.value.category)
  }

  if (filters.value.status) {
    filtered = filtered.filter(service => service.status === filters.value.status)
  }

  if (filters.value.priority) {
    filtered = filtered.filter(service => service.priority === filters.value.priority)
  }

  return filtered
})

const sortedServices = computed(() => {
  const sorted = [...filteredServices.value]
  sorted.sort((a, b) => {
    let aVal = a[sortKey.value]
    let bVal = b[sortKey.value]

    // Handle date sorting
    if (sortKey.value === 'date') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return sorted
})

const totalPages = computed(() => Math.ceil(sortedServices.value.length / itemsPerPage))

const paginatedServices = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return sortedServices.value.slice(start, end)
})

const startIndex = computed(() => currentPage.value * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, sortedServices.value.length))

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value + 1

  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i)
      }
    }
  }

  return pages
})

const exportStatusClass = computed(() => {
  if (!exportStatus.value) return ''
  return exportStatus.value.type === 'success' ? 'alert-success' : 'alert-danger'
})

// Methods
const sort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  currentPage.value = 0
}

const getSortDirection = (key) => {
  if (sortKey.value !== key) return 'none'
  return sortOrder.value === 'asc' ? 'ascending' : 'descending'
}

const goToPage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const getCategoryBadgeClass = (category) => {
  switch (category) {
    case 'consultation': return 'bg-primary'
    case 'treatment': return 'bg-success'
    case 'support': return 'bg-info'
    case 'maintenance': return 'bg-warning'
    default: return 'bg-secondary'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active': return 'bg-success'
    case 'pending': return 'bg-warning'
    case 'completed': return 'bg-info'
    case 'cancelled': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case 'high': return 'bg-danger'
    case 'medium': return 'bg-warning'
    case 'low': return 'bg-success'
    default: return 'bg-secondary'
  }
}

const editService = (service) => {
  console.log('Edit service:', service)
  // Implement edit functionality
}

const deleteService = (service) => {
  console.log('Delete service:', service)
  // Implement delete functionality
}

const exportData = async (format) => {
  if (isExporting.value) return
  
  isExporting.value = true
  exportStatus.value = null
  
  try {
    // 导出当前筛选后的数据
    const result = exportServiceData(filteredServices.value, format)
    
    if (result.success) {
      exportStatus.value = {
        type: 'success',
        message: `${format.toUpperCase()} 文件导出成功！`
      }
      
      // 3秒后清除成功消息
      setTimeout(() => {
        exportStatus.value = null
      }, 3000)
    } else {
      throw new Error(result.message)
    }
  } catch (error) {
    console.error('Export error:', error)
    exportStatus.value = {
      type: 'error',
      message: `导出失败: ${error.message}`
    }
    
    // 5秒后清除错误消息
    setTimeout(() => {
      exportStatus.value = null
    }, 5000)
  } finally {
    isExporting.value = false
  }
}

// Watch for filter changes to reset pagination
watch([globalSearch, filters], () => {
  currentPage.value = 0
})
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.sortable-header:hover {
  background-color: #f8f9fa;
}

.sortable-header:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

.sort-indicator {
  margin-left: 5px;
  font-weight: bold;
}

.table th {
  background-color: #f8f9fa;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  vertical-align: middle;
}

.badge {
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
}

.btn-group .btn {
  min-width: 44px;
  min-height: 32px;
}

.pagination .page-link {
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination .page-link:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Screen reader only text */
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

/* High contrast support */
.high-contrast .table th {
  background-color: #000;
  color: #fff;
  border-color: #fff;
}

.high-contrast .table td {
  border-color: #000;
}

.high-contrast .badge {
  border: 1px solid #000;
}

/* Responsive accessibility */
@media (max-width: 768px) {
  .table-container {
    padding: 15px;
  }
  
  .sortable-header:focus {
    outline: 2px solid #007bff;
    outline-offset: 1px;
  }
  
  .pagination .page-link {
    min-width: 40px;
    min-height: 40px;
  }
}

/* Focus indicators */
.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Improved table accessibility */
.table-responsive {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.table {
  margin-bottom: 0;
}

.table tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

/* Pagination info */
.pagination-info {
  font-size: 0.875rem;
}

/* Button accessibility */
.btn {
  min-height: 44px;
  min-width: 44px;
}

.btn-sm {
  min-height: 32px;
  min-width: 32px;
}
</style>
