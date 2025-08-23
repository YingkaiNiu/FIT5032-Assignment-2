<template>
  <div class="card">
    <div class="card-header">
      <h4>User Management Table</h4>
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
            Showing {{ paginatedData.length }} of {{ filteredData.length }} users
          </span>
        </div>
      </div>

      <!-- Column Filters -->
      <div class="row mb-3">
        <div class="col-md-3">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Filter by name..." 
            v-model="columnFilters.name"
          />
        </div>
        <div class="col-md-3">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Filter by email..." 
            v-model="columnFilters.email"
          />
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="columnFilters.role">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" v-model="columnFilters.status">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
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
              <th @click="sort('name')" style="cursor: pointer;">
                Name 
                <span v-if="sortKey === 'name'">
                  {{ sortOrders.name === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('email')" style="cursor: pointer;">
                Email 
                <span v-if="sortKey === 'email'">
                  {{ sortOrders.email === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('role')" style="cursor: pointer;">
                Role 
                <span v-if="sortKey === 'role'">
                  {{ sortOrders.role === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('status')" style="cursor: pointer;">
                Status 
                <span v-if="sortKey === 'status'">
                  {{ sortOrders.status === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th @click="sort('createdAt')" style="cursor: pointer;">
                Created Date 
                <span v-if="sortKey === 'createdAt'">
                  {{ sortOrders.createdAt === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in paginatedData" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span :class="getRoleBadgeClass(user.role)">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <span :class="getStatusBadgeClass(user.status)">
                  {{ user.status }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
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
import { ref, computed, onMounted } from 'vue'

// Sample data
const users = ref([
  { id: 1, name: 'John Smith', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2024-01-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'moderator', status: 'inactive', createdAt: '2024-02-01' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'pending', createdAt: '2024-02-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'user', status: 'active', createdAt: '2024-02-10' },
  { id: 6, name: 'Diana Davis', email: 'diana@example.com', role: 'admin', status: 'active', createdAt: '2024-02-15' },
  { id: 7, name: 'Edward Miller', email: 'edward@example.com', role: 'user', status: 'inactive', createdAt: '2024-02-20' },
  { id: 8, name: 'Fiona Garcia', email: 'fiona@example.com', role: 'moderator', status: 'active', createdAt: '2024-02-25' },
  { id: 9, name: 'George Martinez', email: 'george@example.com', role: 'user', status: 'pending', createdAt: '2024-03-01' },
  { id: 10, name: 'Helen Taylor', email: 'helen@example.com', role: 'user', status: 'active', createdAt: '2024-03-05' },
  { id: 11, name: 'Ian Anderson', email: 'ian@example.com', role: 'admin', status: 'active', createdAt: '2024-03-10' },
  { id: 12, name: 'Julia Thomas', email: 'julia@example.com', role: 'user', status: 'inactive', createdAt: '2024-03-15' },
  { id: 13, name: 'Kevin Jackson', email: 'kevin@example.com', role: 'moderator', status: 'active', createdAt: '2024-03-20' },
  { id: 14, name: 'Laura White', email: 'laura@example.com', role: 'user', status: 'pending', createdAt: '2024-03-25' },
  { id: 15, name: 'Michael Harris', email: 'michael@example.com', role: 'user', status: 'active', createdAt: '2024-03-30' }
])

// Reactive data
const globalSearch = ref('')
const columnFilters = ref({
  name: '',
  email: '',
  role: '',
  status: ''
})
const currentPage = ref(1)
const itemsPerPage = 10
const sortKey = ref('id')
const sortOrders = ref({
  id: 'asc',
  name: 'asc',
  email: 'asc',
  role: 'asc',
  status: 'asc',
  createdAt: 'asc'
})

// Computed properties
const filteredData = computed(() => {
  let filtered = users.value

  // Global search
  if (globalSearch.value) {
    const searchTerm = globalSearch.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm) ||
      user.status.toLowerCase().includes(searchTerm)
    )
  }

  // Column filters
  if (columnFilters.value.name) {
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(columnFilters.value.name.toLowerCase())
    )
  }
  if (columnFilters.value.email) {
    filtered = filtered.filter(user => 
      user.email.toLowerCase().includes(columnFilters.value.email.toLowerCase())
    )
  }
  if (columnFilters.value.role) {
    filtered = filtered.filter(user => user.role === columnFilters.value.role)
  }
  if (columnFilters.value.status) {
    filtered = filtered.filter(user => user.status === columnFilters.value.status)
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

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'badge bg-danger',
    moderator: 'badge bg-warning',
    user: 'badge bg-primary'
  }
  return classes[role] || 'badge bg-secondary'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    active: 'badge bg-success',
    inactive: 'badge bg-secondary',
    pending: 'badge bg-warning'
  }
  return classes[status] || 'badge bg-secondary'
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
