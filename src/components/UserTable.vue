<template>
  <div class="table-container" role="region" aria-labelledby="user-table-heading">
    <h3 id="user-table-heading">User Management Table</h3>
    
    <!-- Search and Controls -->
    <div class="table-controls mb-3">
      <div class="row">
        <div class="col-md-6">
          <label for="global-search" class="form-label">Global Search</label>
          <input
            id="global-search"
            type="text"
            class="form-control"
            v-model="globalSearch"
            placeholder="Search all columns..."
            aria-describedby="global-search-help"
          />
          <div id="global-search-help" class="form-text">
            Type to search across all user data
          </div>
        </div>
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-4">
              <label for="name-filter" class="form-label">Name Filter</label>
              <input
                id="name-filter"
                type="text"
                class="form-control"
                v-model="filters.name"
                placeholder="Filter by name..."
                aria-describedby="name-filter-help"
              />
              <div id="name-filter-help" class="form-text">Filter by user name</div>
            </div>
            <div class="col-md-4">
              <label for="email-filter" class="form-label">Email Filter</label>
              <input
                id="email-filter"
                type="text"
                class="form-control"
                v-model="filters.email"
                placeholder="Filter by email..."
                aria-describedby="email-filter-help"
              />
              <div id="email-filter-help" class="form-text">Filter by email address</div>
            </div>
            <div class="col-md-4">
              <label for="role-filter" class="form-label">Role Filter</label>
              <select
                id="role-filter"
                class="form-select"
                v-model="filters.role"
                aria-describedby="role-filter-help"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
              </select>
              <div id="role-filter-help" class="form-text">Filter by user role</div>
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
                找到 {{ filteredUsers.length }} 条记录
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
        aria-describedby="table-description"
      >
        <caption id="table-description" class="sr-only">
          User management table with sorting and filtering capabilities
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
              :aria-sort="getSortDirection('name')"
              @click="sort('name')"
              @keydown.enter="sort('name')"
              @keydown.space="sort('name')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by name"
            >
              Name
              <span v-if="sortKey === 'name'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('email')"
              @click="sort('email')"
              @keydown.enter="sort('email')"
              @keydown.space="sort('email')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by email"
            >
              Email
              <span v-if="sortKey === 'email'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th 
              scope="col"
              role="columnheader"
              :aria-sort="getSortDirection('role')"
              @click="sort('role')"
              @keydown.enter="sort('role')"
              @keydown.space="sort('role')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by role"
            >
              Role
              <span v-if="sortKey === 'role'" class="sort-indicator" aria-hidden="true">
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
              :aria-sort="getSortDirection('createdAt')"
              @click="sort('createdAt')"
              @keydown.enter="sort('createdAt')"
              @keydown.space="sort('createdAt')"
              tabindex="0"
              class="sortable-header"
              aria-label="Sort by creation date"
            >
              Created At
              <span v-if="sortKey === 'createdAt'" class="sort-indicator" aria-hidden="true">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th scope="col" role="columnheader">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(user, index) in paginatedUsers" 
            :key="user.id"
            :aria-rowindex="currentPage * itemsPerPage + index + 1"
            role="row"
          >
            <td 
              :headers="'col-id'"
              role="cell"
              :aria-label="`User ID: ${user.id}`"
            >
              {{ user.id }}
            </td>
            <td 
              :headers="'col-name'"
              role="cell"
              :aria-label="`User name: ${user.name}`"
            >
              {{ user.name }}
            </td>
            <td 
              :headers="'col-email'"
              role="cell"
              :aria-label="`User email: ${user.email}`"
            >
              {{ user.email }}
            </td>
            <td 
              :headers="'col-role'"
              role="cell"
              :aria-label="`User role: ${user.role}`"
            >
              <span class="badge" :class="getRoleBadgeClass(user.role)">
                {{ user.role }}
              </span>
            </td>
            <td 
              :headers="'col-status'"
              role="cell"
              :aria-label="`User status: ${user.status}`"
            >
              <span class="badge" :class="getStatusBadgeClass(user.status)">
                {{ user.status }}
              </span>
            </td>
            <td 
              :headers="'col-created'"
              role="cell"
              :aria-label="`User created: ${formatDate(user.createdAt)}`"
            >
              {{ formatDate(user.createdAt) }}
            </td>
            <td 
              headers="col-actions"
              role="cell"
              :aria-label="`Actions for user ${user.name}`"
            >
              <div class="btn-group" role="group" :aria-label="`Actions for ${user.name}`">
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="editUser(user)"
                  @keydown.enter="editUser(user)"
                  @keydown.space="editUser(user)"
                  :aria-label="`Edit user ${user.name}`"
                >
                  <span aria-hidden="true">✏️</span>
                  <span class="sr-only">Edit</span>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="deleteUser(user)"
                  @keydown.enter="deleteUser(user)"
                  @keydown.space="deleteUser(user)"
                  :aria-label="`Delete user ${user.name}`"
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
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredUsers.length }} users
        </span>
      </div>
      
      <nav aria-label="User table pagination">
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
      {{ filteredUsers.length }} users found. Page {{ currentPage + 1 }} of {{ totalPages }}.
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
import { exportUserData } from '../utils/exportUtils'

// Sample user data
const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2024-01-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'moderator', status: 'inactive', createdAt: '2024-01-25' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active', createdAt: '2024-02-01' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', status: 'pending', createdAt: '2024-02-05' },
  { id: 6, name: 'Diana Davis', email: 'diana@example.com', role: 'admin', status: 'active', createdAt: '2024-02-10' },
  { id: 7, name: 'Edward Miller', email: 'edward@example.com', role: 'user', status: 'inactive', createdAt: '2024-02-15' },
  { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', role: 'moderator', status: 'active', createdAt: '2024-02-20' },
  { id: 9, name: 'George Martinez', email: 'george@example.com', role: 'user', status: 'active', createdAt: '2024-02-25' },
  { id: 10, name: 'Helen Taylor', email: 'helen@example.com', role: 'user', status: 'pending', createdAt: '2024-03-01' },
  { id: 11, name: 'Ian Anderson', email: 'ian@example.com', role: 'admin', status: 'active', createdAt: '2024-03-05' },
  { id: 12, name: 'Julia Thomas', email: 'julia@example.com', role: 'user', status: 'active', createdAt: '2024-03-10' }
])

// Table state
const globalSearch = ref('')
const filters = ref({
  name: '',
  email: '',
  role: '',
  status: ''
})
const sortKey = ref('id')
const sortOrder = ref('asc')
const currentPage = ref(0)
const itemsPerPage = 10

// Export state
const isExporting = ref(false)
const exportStatus = ref(null)

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  // Global search
  if (globalSearch.value) {
    const search = globalSearch.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search) ||
      user.status.toLowerCase().includes(search)
    )
  }

  // Column filters
  if (filters.value.name) {
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(filters.value.name.toLowerCase())
    )
  }

  if (filters.value.email) {
    filtered = filtered.filter(user =>
      user.email.toLowerCase().includes(filters.value.email.toLowerCase())
    )
  }

  if (filters.value.role) {
    filtered = filtered.filter(user => user.role === filters.value.role)
  }

  if (filters.value.status) {
    filtered = filtered.filter(user => user.status === filters.value.status)
  }

  return filtered
})

const sortedUsers = computed(() => {
  const sorted = [...filteredUsers.value]
  sorted.sort((a, b) => {
    let aVal = a[sortKey.value]
    let bVal = b[sortKey.value]

    // Handle date sorting
    if (sortKey.value === 'createdAt') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return sorted
})

const totalPages = computed(() => Math.ceil(sortedUsers.value.length / itemsPerPage))

const paginatedUsers = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return sortedUsers.value.slice(start, end)
})

const startIndex = computed(() => currentPage.value * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, sortedUsers.value.length))

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

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'bg-danger'
    case 'moderator': return 'bg-warning'
    default: return 'bg-primary'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'active': return 'bg-success'
    case 'inactive': return 'bg-secondary'
    case 'pending': return 'bg-warning'
    default: return 'bg-primary'
  }
}

const editUser = (user) => {
  console.log('Edit user:', user)
  // Implement edit functionality
}

const deleteUser = (user) => {
  console.log('Delete user:', user)
  // Implement delete functionality
}

const exportData = async (format) => {
  if (isExporting.value) return
  
  isExporting.value = true
  exportStatus.value = null
  
  try {
    // 导出当前筛选后的数据
    const result = exportUserData(filteredUsers.value, format)
    
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
