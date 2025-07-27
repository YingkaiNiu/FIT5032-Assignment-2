<template>
  <div class="admin-panel">
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h3 mb-0">Admin Panel</h1>
              <p class="text-muted mb-0">System administration and management</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-success" @click="backupSystem">
                <i class="bi bi-cloud-upload"></i> Backup
              </button>
              <button class="btn btn-warning" @click="showLogs">
                <i class="bi bi-file-text"></i> View Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="row mb-4">
        <div class="col-12">
          <ul class="nav nav-tabs" id="adminTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link active" 
                id="users-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#users" 
                type="button" 
                role="tab"
              >
                <i class="bi bi-people me-2"></i>User Management
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                id="products-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#products" 
                type="button" 
                role="tab"
              >
                <i class="bi bi-box me-2"></i>Product Management
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                id="settings-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#settings" 
                type="button" 
                role="tab"
              >
                <i class="bi bi-gear me-2"></i>System Settings
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                id="analytics-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#analytics" 
                type="button" 
                role="tab"
              >
                <i class="bi bi-graph-up me-2"></i>Analytics
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="tab-content" id="adminTabContent">
        <!-- User Management Tab -->
        <div class="tab-pane fade show active" id="users" role="tabpanel">
          <div class="card shadow">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">User Management</h5>
              <button class="btn btn-primary btn-sm" @click="showAddUserModal">
                <i class="bi bi-plus"></i> Add User
              </button>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users" :key="user.id">
                      <td>{{ user.id }}</td>
                      <td>{{ user.firstName }} {{ user.lastName }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span :class="getRoleBadgeClass(user.role)" class="badge">
                          {{ user.role }}
                        </span>
                      </td>
                      <td>
                        <span :class="getStatusBadgeClass(user.status)" class="badge">
                          {{ user.status }}
                        </span>
                      </td>
                      <td>{{ formatDate(user.createdAt) }}</td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" @click="editUser(user)">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-outline-danger" @click="deleteUser(user.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Management Tab -->
        <div class="tab-pane fade" id="products" role="tabpanel">
          <div class="card shadow">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Product Management</h5>
              <button class="btn btn-primary btn-sm" @click="showAddProductModal">
                <i class="bi bi-plus"></i> Add Product
              </button>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in products" :key="product.id">
                      <td>{{ product.id }}</td>
                      <td>{{ product.name }}</td>
                      <td>{{ product.category }}</td>
                      <td>${{ product.price }}</td>
                      <td>{{ product.stock }}</td>
                      <td>
                        <span :class="getProductStatusBadgeClass(product.status)" class="badge">
                          {{ product.status }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary" @click="editProduct(product)">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-outline-danger" @click="deleteProduct(product.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- System Settings Tab -->
        <div class="tab-pane fade" id="settings" role="tabpanel">
          <div class="row">
            <div class="col-md-6">
              <div class="card shadow">
                <div class="card-header">
                  <h5 class="mb-0">General Settings</h5>
                </div>
                <div class="card-body">
                  <form @submit.prevent="saveGeneralSettings">
                    <div class="mb-3">
                      <label for="siteName" class="form-label">Site Name</label>
                      <input type="text" class="form-control" id="siteName" v-model="settings.siteName">
                    </div>
                    <div class="mb-3">
                      <label for="siteDescription" class="form-label">Site Description</label>
                      <textarea class="form-control" id="siteDescription" v-model="settings.siteDescription" rows="3"></textarea>
                    </div>
                    <div class="mb-3">
                      <label for="maintenanceMode" class="form-label">Maintenance Mode</label>
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="maintenanceMode" v-model="settings.maintenanceMode">
                        <label class="form-check-label" for="maintenanceMode">
                          Enable maintenance mode
                        </label>
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Settings</button>
                  </form>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card shadow">
                <div class="card-header">
                  <h5 class="mb-0">Security Settings</h5>
                </div>
                <div class="card-body">
                  <form @submit.prevent="saveSecuritySettings">
                    <div class="mb-3">
                      <label for="sessionTimeout" class="form-label">Session Timeout (minutes)</label>
                      <input type="number" class="form-control" id="sessionTimeout" v-model="settings.sessionTimeout">
                    </div>
                    <div class="mb-3">
                      <label for="maxLoginAttempts" class="form-label">Max Login Attempts</label>
                      <input type="number" class="form-control" id="maxLoginAttempts" v-model="settings.maxLoginAttempts">
                    </div>
                    <div class="mb-3">
                      <label for="enableTwoFactor" class="form-label">Two-Factor Authentication</label>
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="enableTwoFactor" v-model="settings.enableTwoFactor">
                        <label class="form-check-label" for="enableTwoFactor">
                          Enable 2FA for all users
                        </label>
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Security Settings</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Tab -->
        <div class="tab-pane fade" id="analytics" role="tabpanel">
          <div class="row">
            <div class="col-md-6">
              <div class="card shadow">
                <div class="card-header">
                  <h5 class="mb-0">User Analytics</h5>
                </div>
                <div class="card-body">
                  <canvas id="userChart" width="400" height="200"></canvas>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card shadow">
                <div class="card-header">
                  <h5 class="mb-0">Product Analytics</h5>
                </div>
                <div class="card-body">
                  <canvas id="productChart" width="400" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'AdminPanel',
  setup() {
    const users = ref([])
    const products = ref([])
    const settings = reactive({
      siteName: 'FIT5032 Web Application',
      siteDescription: 'A modern Vue.js application for FIT5032 Assignment 2',
      maintenanceMode: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enableTwoFactor: false
    })

    const loadUsers = async () => {
      // Mock data
      users.value = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          status: 'active',
          createdAt: new Date('2024-01-15')
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          role: 'user',
          status: 'active',
          createdAt: new Date('2024-01-20')
        },
        {
          id: 3,
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob.johnson@example.com',
          role: 'user',
          status: 'inactive',
          createdAt: new Date('2024-01-25')
        }
      ]
    }

    const loadProducts = async () => {
      // Mock data
      products.value = [
        {
          id: 1,
          name: 'Vue.js Development Guide',
          category: 'Books',
          price: 29.99,
          stock: 50,
          status: 'active'
        },
        {
          id: 2,
          name: 'Web Development Course',
          category: 'Courses',
          price: 99.99,
          stock: 25,
          status: 'active'
        },
        {
          id: 3,
          name: 'Premium Template',
          category: 'Templates',
          price: 19.99,
          stock: 0,
          status: 'out_of_stock'
        }
      ]
    }

    const getRoleBadgeClass = (role) => {
      return role === 'admin' ? 'bg-danger' : 'bg-primary'
    }

    const getStatusBadgeClass = (status) => {
      return status === 'active' ? 'bg-success' : 'bg-secondary'
    }

    const getProductStatusBadgeClass = (status) => {
      const classes = {
        active: 'bg-success',
        inactive: 'bg-secondary',
        out_of_stock: 'bg-warning'
      }
      return classes[status] || 'bg-secondary'
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    }

    const showAddUserModal = () => {
      console.log('Show add user modal')
    }

    const editUser = (user) => {
      console.log('Edit user:', user)
    }

    const deleteUser = (userId) => {
      if (confirm('Are you sure you want to delete this user?')) {
        console.log('Delete user:', userId)
      }
    }

    const showAddProductModal = () => {
      console.log('Show add product modal')
    }

    const editProduct = (product) => {
      console.log('Edit product:', product)
    }

    const deleteProduct = (productId) => {
      if (confirm('Are you sure you want to delete this product?')) {
        console.log('Delete product:', productId)
      }
    }

    const saveGeneralSettings = () => {
      console.log('Saving general settings:', settings)
    }

    const saveSecuritySettings = () => {
      console.log('Saving security settings:', settings)
    }

    const backupSystem = () => {
      console.log('Creating system backup...')
    }

    const showLogs = () => {
      console.log('Showing system logs...')
    }

    onMounted(() => {
      loadUsers()
      loadProducts()
    })

    return {
      users,
      products,
      settings,
      getRoleBadgeClass,
      getStatusBadgeClass,
      getProductStatusBadgeClass,
      formatDate,
      showAddUserModal,
      editUser,
      deleteUser,
      showAddProductModal,
      editProduct,
      deleteProduct,
      saveGeneralSettings,
      saveSecuritySettings,
      backupSystem,
      showLogs
    }
  }
}
</script>

<style scoped>
.admin-panel {
  padding: 2rem 0;
  background-color: #f8f9fc;
  min-height: 100vh;
}

.nav-tabs .nav-link {
  color: #6c757d;
  border: none;
  border-bottom: 2px solid transparent;
}

.nav-tabs .nav-link.active {
  color: #007bff;
  border-bottom-color: #007bff;
  background-color: transparent;
}

.card {
  border: none;
  border-radius: 0.5rem;
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid #e3e6f0;
  font-weight: 600;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #6c757d;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}

@media (max-width: 768px) {
  .admin-panel {
    padding: 1rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
}
</style> 