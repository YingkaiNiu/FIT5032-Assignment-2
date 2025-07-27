<template>
  <div class="register-page">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-custom">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="text-gradient">Create Account</h2>
              <p class="text-muted">Join our community today</p>
            </div>

            <form @submit.prevent="handleRegister" novalidate>
              <!-- Name Fields -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="firstName" class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.firstName }"
                    id="firstName"
                    v-model="form.firstName"
                    required
                  />
                  <div class="invalid-feedback" v-if="errors.firstName">
                    {{ errors.firstName }}
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': errors.lastName }"
                    id="lastName"
                    v-model="form.lastName"
                    required
                  />
                  <div class="invalid-feedback" v-if="errors.lastName">
                    {{ errors.lastName }}
                  </div>
                </div>
              </div>

              <!-- Email Field -->
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  id="email"
                  v-model="form.email"
                  required
                />
                <div class="invalid-feedback" v-if="errors.email">
                  {{ errors.email }}
                </div>
              </div>

              <!-- Password Fields -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  id="password"
                  v-model="form.password"
                  required
                />
                <div class="invalid-feedback" v-if="errors.password">
                  {{ errors.password }}
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  required
                />
                <div class="invalid-feedback" v-if="errors.confirmPassword">
                  {{ errors.confirmPassword }}
                </div>
              </div>

              <!-- Role Selection -->
              <div class="mb-3">
                <label for="role" class="form-label">Account Type</label>
                <select
                  class="form-select"
                  :class="{ 'is-invalid': errors.role }"
                  id="role"
                  v-model="form.role"
                  required
                >
                  <option value="">Select account type</option>
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
                <div class="invalid-feedback" v-if="errors.role">
                  {{ errors.role }}
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Creating Account...' : 'Create Account' }}
              </button>

              <!-- Login Link -->
              <div class="text-center">
                <p class="mb-0">
                  Already have an account?
                  <router-link to="/login" class="text-decoration-none">Sign in</router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const loading = ref(false)
    const errors = reactive({})
    
    const form = reactive({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    })

    const validateForm = () => {
      errors.value = {}
      
      // First Name validation
      if (!form.firstName.trim()) {
        errors.firstName = 'First name is required'
      } else if (form.firstName.length < 2) {
        errors.firstName = 'First name must be at least 2 characters'
      }
      
      // Last Name validation
      if (!form.lastName.trim()) {
        errors.lastName = 'Last name is required'
      } else if (form.lastName.length < 2) {
        errors.lastName = 'Last name must be at least 2 characters'
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = 'Email is required'
      } else if (!emailRegex.test(form.email)) {
        errors.email = 'Please enter a valid email address'
      }
      
      // Password validation
      if (!form.password) {
        errors.password = 'Password is required'
      } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      }
      
      // Confirm Password validation
      if (!form.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
      
      // Role validation
      if (!form.role) {
        errors.role = 'Please select an account type'
      }
      
      return Object.keys(errors).length === 0
    }

    const handleRegister = async () => {
      if (!validateForm()) return
      
      loading.value = true
      
      try {
        const userData = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          role: form.role
        }
        
        await authStore.register(userData)
        router.push('/dashboard')
      } catch (error) {
        console.error('Registration error:', error)
        // Handle specific error cases
        if (error.message.includes('email')) {
          errors.email = 'This email is already registered'
        }
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      loading,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.shadow-custom {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 15px;
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .register-page {
    padding: 1rem;
  }
  
  .card-body {
    padding: 2rem !important;
  }
}
</style> 