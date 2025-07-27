<template>
  <div class="login-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5 col-xl-4">
          <div class="card shadow-custom">
            <div class="card-body p-4">
              <!-- Success Message -->
              <div v-if="showSuccess" class="alert alert-success text-center mb-4">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Login Successful!</strong> Redirecting to dashboard...
              </div>

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
                    class="form-control login-input"
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
                      class="form-control login-input"
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
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
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
                  :disabled="isLoading || showSuccess"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Signing In...' : showSuccess ? 'Success!' : 'Sign In' }}
                </button>

                <!-- Demo Accounts -->
                <div class="text-center mb-3">
                  <small class="text-muted">Demo Accounts:</small>
                  <div class="mt-2">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary me-2"
                      @click="useDemoAccount('user')"
                      :disabled="isLoading || showSuccess"
                    >
                      User Account
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary me-2"
                      @click="useDemoAccount('admin')"
                      :disabled="isLoading || showSuccess"
                    >
                      Admin Account
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-info"
                      @click="testInput"
                      :disabled="isLoading || showSuccess"
                    >
                      Test Input
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
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const isLoading = ref(false)
    const showPassword = ref(false)
    const showSuccess = ref(false)

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

    // Debug function to test input functionality
    const testInput = () => {
      console.log('Form data:', form)
      console.log('Email:', form.email)
      console.log('Password:', form.password)
    }

    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }

      isLoading.value = true
      showSuccess.value = false

      try {
        const credentials = {
          email: form.email,
          password: form.password
        }

        await authStore.login(credentials)

        // Only save remember me if user explicitly checked it
        if (form.remember) {
          localStorage.setItem('rememberMe', 'true')
        } else {
          // Clear remember me if not checked
          localStorage.removeItem('rememberMe')
        }

        // Show success message
        showSuccess.value = true
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)

      } catch (error) {
        console.error('Login error:', error)
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
      showSuccess,
      validateEmail,
      validatePassword,
      togglePassword,
      useDemoAccount,
      testInput,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.shadow-custom {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 15px;
}

.card {
  border: none;
  border-radius: 15px;
  background: white;
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}

.login-input {
  border: 2px solid #e9ecef !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
  font-size: 16px !important;
  transition: all 0.3s ease !important;
  background-color: white !important;
  color: #495057 !important;
  width: 100% !important;
  display: block !important;
  pointer-events: auto !important;
  user-select: text !important;
}

.login-input:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
  outline: none !important;
}

.login-input.is-invalid {
  border-color: #dc3545 !important;
}

.login-input.is-invalid:focus {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
}

.form-control {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  outline: none;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.btn {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.input-group .btn {
  border-radius: 0 8px 8px 0;
  border-left: none;
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }
  
  .card-body {
    padding: 2rem !important;
  }
  
  .col-md-6 {
    padding: 0 1rem;
  }
}
</style> 