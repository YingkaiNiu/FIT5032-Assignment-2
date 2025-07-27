<template>
  <div class="login-page">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-custom">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="text-gradient">Welcome Back</h2>
              <p class="text-muted">Sign in to your account</p>
            </div>

            <form @submit.prevent="handleLogin" novalidate>
              <!-- Email Field -->
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  id="email"
                  v-model="form.email"
                  @blur="validateEmail"
                  placeholder="Enter your email"
                  required
                >
                <div class="invalid-feedback" v-if="errors.email">
                  {{ errors.email }}
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control"
                    :class="{ 'is-invalid': errors.password }"
                    id="password"
                    v-model="form.password"
                    @blur="validatePassword"
                    placeholder="Enter your password"
                    required
                  >
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="togglePassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div class="invalid-feedback" v-if="errors.password">
                  {{ errors.password }}
                </div>
              </div>

              <!-- Remember Me -->
              <div class="mb-3 form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="remember"
                  v-model="form.remember"
                >
                <label class="form-check-label" for="remember">
                  Remember me
                </label>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-primary w-100 mb-3"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Signing In...' : 'Sign In' }}
              </button>

              <!-- Demo Accounts -->
              <div class="text-center mb-3">
                <small class="text-muted">Demo Accounts:</small>
                <div class="mt-2">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary me-2"
                    @click="useDemoAccount('user')"
                  >
                    User Account
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="useDemoAccount('admin')"
                  >
                    Admin Account
                  </button>
                </div>
              </div>

              <!-- Links -->
              <div class="text-center">
                <p class="mb-0">
                  Don't have an account?
                  <router-link to="/register" class="text-decoration-none">Sign up</router-link>
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

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const isLoading = ref(false)
    const showPassword = ref(false)

    const form = reactive({
      email: '',
      password: '',
      remember: false
    })

    const errors = reactive({
      email: '',
      password: ''
    })

    // Validation functions
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = 'Email is required'
      } else if (!emailRegex.test(form.email)) {
        errors.email = 'Please enter a valid email address'
      } else {
        errors.email = ''
      }
    }

    const validatePassword = () => {
      if (!form.password) {
        errors.password = 'Password is required'
      } else if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long'
      } else {
        errors.password = ''
      }
    }

    const validateForm = () => {
      validateEmail()
      validatePassword()
      return !errors.email && !errors.password
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const useDemoAccount = (type) => {
      if (type === 'user') {
        form.email = 'user@example.com'
        form.password = 'user123'
      } else if (type === 'admin') {
        form.email = 'admin@example.com'
        form.password = 'admin123'
      }
      validateForm()
    }

    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }

      isLoading.value = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Demo authentication logic
        let userData = null
        let userRole = ''

        if (form.email === 'admin@example.com' && form.password === 'admin123') {
          userData = {
            id: 1,
            email: form.email,
            name: 'Admin User',
            role: 'admin'
          }
          userRole = 'admin'
        } else if (form.email === 'user@example.com' && form.password === 'user123') {
          userData = {
            id: 2,
            email: form.email,
            name: 'Regular User',
            role: 'user'
          }
          userRole = 'user'
        } else {
          throw new Error('Invalid credentials')
        }

        // Store authentication data
        localStorage.setItem('authToken', 'demo-token-' + Date.now())
        localStorage.setItem('userRole', userRole)
        localStorage.setItem('userData', JSON.stringify(userData))

        if (form.remember) {
          localStorage.setItem('rememberMe', 'true')
        }

        // Redirect to dashboard
        router.push('/dashboard')

      } catch (error) {
        alert('Login failed: ' + error.message)
      } finally {
        isLoading.value = false
      }
    }

    return {
      form,
      errors,
      isLoading,
      showPassword,
      validateEmail,
      validatePassword,
      togglePassword,
      useDemoAccount,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.card {
  border: none;
  border-radius: 15px;
}

.text-gradient {
  background: linear-gradient(135deg, var(--primary-color), #0056b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn {
  border-radius: 25px;
  padding: 12px 30px;
  font-weight: 500;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.input-group .btn {
  border-radius: 0 8px 8px 0;
}

.form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .login-page {
    padding: 2rem 0;
  }
  
  .card-body {
    padding: 2rem !important;
  }
}
</style> 