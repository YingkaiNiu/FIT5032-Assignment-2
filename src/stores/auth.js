import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)
  
  // Get registered users from localStorage
  const getRegisteredUsers = () => {
    const users = localStorage.getItem('registeredUsers')
    return users ? JSON.parse(users) : []
  }
  
  // Save registered users to localStorage
  const saveRegisteredUsers = (users) => {
    localStorage.setItem('registeredUsers', JSON.stringify(users))
  }

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const userFullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`
  })

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check registered users first
      const registeredUsers = getRegisteredUsers()
      const registeredUser = registeredUsers.find(u => 
        u.email === credentials.email && u.password === credentials.password
      )
      
      if (registeredUser) {
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        user.value = registeredUser
        token.value = mockToken
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(registeredUser))
        
        return registeredUser
      }
      
      // Fallback to mock authentication for demo accounts
      if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
        const mockUser = {
          id: 1,
          firstName: 'Admin',
          lastName: 'User',
          email: credentials.email,
          role: 'admin',
          createdAt: new Date('2024-01-01')
        }
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        user.value = mockUser
        token.value = mockToken
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return mockUser
      } else if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
        const mockUser = {
          id: 2,
          firstName: 'Regular',
          lastName: 'User',
          email: credentials.email,
          role: 'user',
          createdAt: new Date('2024-01-15')
        }
        const mockToken = 'mock-jwt-token-' + Date.now()
        
        user.value = mockUser
        token.value = mockToken
        localStorage.setItem('token', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return mockUser
      } else {
        throw new Error('Invalid email or password')
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if email already exists
      const registeredUsers = getRegisteredUsers()
      const existingUser = registeredUsers.find(u => u.email === userData.email)
      
      if (existingUser) {
        throw new Error('Email already registered')
      }
      
      // Create new user
      const newUser = {
        id: Date.now(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password, // Store password for login verification
        role: userData.role || 'user',
        createdAt: new Date()
      }
      
      // Save to registered users
      registeredUsers.push(newUser)
      saveRegisteredUsers(registeredUsers)
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      user.value = newUser
      token.value = mockToken
      localStorage.setItem('token', mockToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      return newUser
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('rememberMe')
    
    // Return success status for components to handle navigation
    return true
  }

  const checkAuth = async () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const rememberMe = localStorage.getItem('rememberMe')
    
    // Only restore session if user chose "Remember me"
    if (storedToken && storedUser && rememberMe === 'true') {
      try {
        // Simulate token validation
        await new Promise(resolve => setTimeout(resolve, 500))
        
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (err) {
        logout()
      }
    } else if (storedToken && storedUser && !rememberMe) {
      // Clear session if user didn't choose "Remember me"
      logout()
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data
      user.value = {
        ...user.value,
        ...profileData
      }
      
      localStorage.setItem('user', JSON.stringify(user.value))
      
      return user.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock password change
      console.log('Password changed successfully')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const forgotPassword = async (email) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock password reset
      console.log('Password reset email sent to:', email)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (resetData) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock password reset
      console.log('Password reset successfully')
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const refreshToken = async () => {
    try {
      // Simulate token refresh
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newToken = 'mock-jwt-token-' + Date.now()
      token.value = newToken
      localStorage.setItem('token', newToken)
      
      return newToken
    } catch (err) {
      logout()
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    userFullName,
    
    // Actions
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
    clearError
  }
}) 