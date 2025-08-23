<template>
  <div id="app">
    <!-- Skip to main content link for screen readers -->
    <a href="#main-content" class="skip-link" @click="skipToMainContent">
      Skip to main content
    </a>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary" role="navigation" aria-label="Main navigation">
      <div class="container">
        <router-link class="navbar-brand" to="/" aria-label="Home page">
          <span role="img" aria-label="Health icon">🏥</span> Elder Health Support
        </router-link>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation menu"
          @keydown.enter="toggleNav"
          @keydown.space="toggleNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto" role="menubar">
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/" 
                role="menuitem"
                aria-label="Home page"
                @keydown.enter="navigateTo('/')"
                @keydown.space="navigateTo('/')"
              >
                Home
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/services" 
                role="menuitem"
                aria-label="Services page"
                @keydown.enter="navigateTo('/services')"
                @keydown.space="navigateTo('/services')"
              >
                Services
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/products" 
                role="menuitem"
                aria-label="Products page"
                @keydown.enter="navigateTo('/products')"
                @keydown.space="navigateTo('/products')"
              >
                Products
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/resources" 
                role="menuitem"
                aria-label="Resources page"
                @keydown.enter="navigateTo('/resources')"
                @keydown.space="navigateTo('/resources')"
              >
                Resources
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/reviews" 
                role="menuitem"
                aria-label="Reviews page"
                @keydown.enter="navigateTo('/reviews')"
                @keydown.space="navigateTo('/reviews')"
              >
                Reviews
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/about" 
                role="menuitem"
                aria-label="About page"
                @keydown.enter="navigateTo('/about')"
                @keydown.space="navigateTo('/about')"
              >
                About
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/contact" 
                role="menuitem"
                aria-label="Contact page"
                @keydown.enter="navigateTo('/contact')"
                @keydown.space="navigateTo('/contact')"
              >
                Contact
              </router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated" role="none">
              <router-link 
                class="nav-link" 
                to="/FireLogin" 
                role="menuitem"
                aria-label="Firebase login page"
                @keydown.enter="navigateTo('/FireLogin')"
                @keydown.space="navigateTo('/FireLogin')"
              >
                Firebase Login
              </router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated" role="none">
              <router-link 
                class="nav-link" 
                to="/FireRegister" 
                role="menuitem"
                aria-label="Firebase registration page"
                @keydown.enter="navigateTo('/FireRegister')"
                @keydown.space="navigateTo('/FireRegister')"
              >
                Firebase Register
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/email" 
                role="menuitem"
                aria-label="Email service page"
                @keydown.enter="navigateTo('/email')"
                @keydown.space="navigateTo('/email')"
              >
                Email Service
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/tables" 
                role="menuitem"
                aria-label="Interactive tables page"
                @keydown.enter="navigateTo('/tables')"
                @keydown.space="navigateTo('/tables')"
              >
                Interactive Tables
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/map" 
                role="menuitem"
                aria-label="Health map page"
                @keydown.enter="navigateTo('/map')"
                @keydown.space="navigateTo('/map')"
              >
                Health Map
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/innovation" 
                role="menuitem"
                aria-label="Innovation features page"
                @keydown.enter="navigateTo('/innovation')"
                @keydown.space="navigateTo('/innovation')"
              >
                Innovation Features
              </router-link>
            </li>
          </ul>
          
          <ul class="navbar-nav" role="menubar">
            <li class="nav-item" v-if="isAuthenticated" role="none">
              <router-link 
                class="nav-link" 
                to="/dashboard" 
                role="menuitem"
                aria-label="Dashboard page"
                @keydown.enter="navigateTo('/dashboard')"
                @keydown.space="navigateTo('/dashboard')"
              >
                Dashboard
              </router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated && userRole === 'admin'" role="none">
              <router-link 
                class="nav-link" 
                to="/admin" 
                role="menuitem"
                aria-label="Admin panel page"
                @keydown.enter="navigateTo('/admin')"
                @keydown.space="navigateTo('/admin')"
              >
                Admin Panel
              </router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated" role="none">
              <button 
                class="nav-link btn btn-link" 
                @click="logout"
                @keydown.enter="logout"
                @keydown.space="logout"
                role="menuitem"
                aria-label="Logout from account"
              >
                Logout
              </button>
            </li>
            <li class="nav-item" v-if="!isAuthenticated" role="none">
              <router-link 
                class="nav-link" 
                to="/login" 
                role="menuitem"
                aria-label="Login page"
                @keydown.enter="navigateTo('/login')"
                @keydown.space="navigateTo('/login')"
              >
                Login
              </router-link>
            </li>
            <li class="nav-item" v-if="!isAuthenticated" role="none">
              <router-link 
                class="nav-link" 
                to="/register" 
                role="menuitem"
                aria-label="Registration page"
                @keydown.enter="navigateTo('/register')"
                @keydown.space="navigateTo('/register')"
              >
                Register
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main content area -->
    <main id="main-content" role="main" tabindex="-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5" role="contentinfo">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h5>Elder Health Support</h5>
            <p>Supporting the health and well-being of elderly individuals through accessible technology.</p>
          </div>
          <div class="col-md-6">
            <h5>Accessibility</h5>
            <p>This website is designed to meet WCAG 2.1 AA accessibility standards.</p>
            <button 
              class="btn btn-outline-light btn-sm"
              @click="toggleHighContrast"
              @keydown.enter="toggleHighContrast"
              @keydown.space="toggleHighContrast"
              aria-label="Toggle high contrast mode"
            >
              {{ highContrast ? 'Normal Contrast' : 'High Contrast' }}
            </button>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12">
            <p class="text-center mb-0">
              &copy; 2024 Elder Health Support. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAuthenticated = ref(false)
const userRole = ref('user')
const highContrast = ref(false)

// Check authentication status
const checkAuth = () => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const firebaseUser = localStorage.getItem('firebaseUser')
  isAuthenticated.value = (!!token && !!user) || !!firebaseUser
  
  if (user) {
    try {
      const userData = JSON.parse(user)
      userRole.value = userData.role || 'user'
    } catch (e) {
      console.error('Error parsing user data:', e)
    }
  } else if (firebaseUser) {
    try {
      const userData = JSON.parse(firebaseUser)
      userRole.value = userData.role || 'user'
    } catch (e) {
      console.error('Error parsing Firebase user data:', e)
    }
  }
}

// Logout function
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('firebaseUser')
  isAuthenticated.value = false
  userRole.value = 'user'
  router.push('/logout-success')
}

// Navigation functions
const navigateTo = (path) => {
  router.push(path)
}

const toggleNav = () => {
  const navbarToggler = document.querySelector('.navbar-toggler')
  if (navbarToggler) {
    navbarToggler.click()
  }
}

// Accessibility functions
const skipToMainContent = (event) => {
  event.preventDefault()
  const mainContent = document.getElementById('main-content')
  if (mainContent) {
    mainContent.focus()
    mainContent.scrollIntoView({ behavior: 'smooth' })
  }
}

const toggleHighContrast = () => {
  highContrast.value = !highContrast.value
  document.body.classList.toggle('high-contrast', highContrast.value)
  localStorage.setItem('highContrast', highContrast.value.toString())
}

// Lifecycle
onMounted(() => {
  checkAuth()
  
  // Load high contrast preference
  const savedHighContrast = localStorage.getItem('highContrast')
  if (savedHighContrast === 'true') {
    highContrast.value = true
    document.body.classList.add('high-contrast')
  }
  
  // Add keyboard navigation support
  document.addEventListener('keydown', handleKeyboardNavigation)
})

// Keyboard navigation
const handleKeyboardNavigation = (event) => {
  // Tab navigation is handled by browser
  // Enter and Space for buttons and links
  if (event.key === 'Enter' || event.key === ' ') {
    const target = event.target
    if (target.tagName === 'BUTTON' || target.tagName === 'A') {
      event.preventDefault()
      target.click()
    }
  }
  
  // Escape key to close modals or dropdowns
  if (event.key === 'Escape') {
    const openDropdowns = document.querySelectorAll('.dropdown-menu.show')
    openDropdowns.forEach(dropdown => {
      dropdown.classList.remove('show')
    })
  }
}

// Watch for authentication changes
watch(isAuthenticated, () => {
  checkAuth()
})
</script>

<style>
/* Skip link for screen readers */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
  border-radius: 4px;
}

.skip-link:focus {
  top: 6px;
}

/* High contrast mode */
.high-contrast {
  --bs-primary: #000000 !important;
  --bs-secondary: #ffffff !important;
  --bs-success: #00ff00 !important;
  --bs-danger: #ff0000 !important;
  --bs-warning: #ffff00 !important;
  --bs-info: #00ffff !important;
  --bs-light: #ffffff !important;
  --bs-dark: #000000 !important;
}

.high-contrast .navbar {
  background-color: #000000 !important;
  color: #ffffff !important;
}

.high-contrast .navbar-nav .nav-link {
  color: #ffffff !important;
}

.high-contrast .navbar-nav .nav-link:hover {
  color: #ffff00 !important;
}

.high-contrast .btn-primary {
  background-color: #000000 !important;
  border-color: #ffffff !important;
  color: #ffffff !important;
}

.high-contrast .btn-primary:hover {
  background-color: #ffffff !important;
  color: #000000 !important;
}

/* Focus indicators */
*:focus {
  outline: 3px solid #007bff !important;
  outline-offset: 2px !important;
}

/* Improved text contrast */
.text-muted {
  color: #6c757d !important;
}

/* Responsive focus indicators */
@media (max-width: 768px) {
  *:focus {
    outline: 2px solid #007bff !important;
    outline-offset: 1px !important;
  }
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

/* Improved button accessibility */
.btn {
  min-height: 44px;
  min-width: 44px;
}

.btn-sm {
  min-height: 32px;
  min-width: 32px;
}

/* Improved form accessibility */
.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Improved table accessibility */
.table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* Improved card accessibility */
.card {
  border: 1px solid #dee2e6;
}

.card:hover {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

/* Improved navigation accessibility */
.navbar-nav .nav-link {
  padding: 0.5rem 1rem;
  min-height: 44px;
  display: flex;
  align-items: center;
}

/* Improved dropdown accessibility */
.dropdown-menu {
  border: 1px solid #dee2e6;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.dropdown-item {
  padding: 0.5rem 1rem;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

/* Improved modal accessibility */
.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.modal-footer {
  border-top: 1px solid #dee2e6;
}

/* Improved alert accessibility */
.alert {
  border: 1px solid transparent;
  border-radius: 0.375rem;
}

.alert-success {
  background-color: #d1e7dd;
  border-color: #badbcc;
  color: #0f5132;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
}

.alert-warning {
  background-color: #fff3cd;
  border-color: #ffecb5;
  color: #664d03;
}

.alert-info {
  background-color: #cff4fc;
  border-color: #b6effb;
  color: #055160;
}
</style> 