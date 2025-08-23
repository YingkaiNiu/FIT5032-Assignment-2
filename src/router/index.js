import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import AdminPanel from '../views/AdminPanel.vue'
import Services from '../views/Services.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Resources from '../views/Resources.vue'
import Products from '../views/Products.vue'
import Reviews from '../views/Reviews.vue'
import LogoutSuccess from '../views/LogoutSuccess.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import EmailView from '../views/EmailView.vue'
import TablesView from '../views/TablesView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView,
    meta: { requiresGuest: true }
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/email',
    name: 'Email',
    component: EmailView
  },
  {
    path: '/tables',
    name: 'Tables',
    component: TablesView
  },
  {
    path: '/logout-success',
    name: 'LogoutSuccess',
    component: LogoutSuccess
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/services',
    name: 'Services',
    component: Services
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/resources',
    name: 'Resources',
    component: Resources
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/reviews',
    name: 'Reviews',
    component: Reviews
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Allow access to logout-success page regardless of auth status
  if (to.path === '/logout-success') {
    next()
    return
  }

  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const firebaseUser = localStorage.getItem('firebaseUser')
  const isAuthenticated = (!!token && !!user) || !!firebaseUser
  
  let userRole = null
  if (user) {
    try {
      const userData = JSON.parse(user)
      userRole = userData.role
    } catch (e) {
      console.error('Error parsing user data:', e)
    }
  } else if (firebaseUser) {
    try {
      const userData = JSON.parse(firebaseUser)
      userRole = userData.role || 'user'
    } catch (e) {
      console.error('Error parsing Firebase user data:', e)
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    next('/dashboard')
    return
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router 