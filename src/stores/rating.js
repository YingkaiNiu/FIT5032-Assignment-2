import { ref, computed } from 'vue'

export const useRatingStore = () => {
  // Store ratings data
  const ratings = ref({
    // Product ratings: { productId: { average: number, count: number, userRatings: { userId: rating } } }
  })

  // User's current ratings
  const userRatings = ref({})

  // Loading states
  const loading = ref(false)
  const submitting = ref(false)

  // Computed properties
  const getProductRating = computed(() => {
    return (productId) => {
      const productRating = ratings.value[productId]
      if (!productRating) {
        return { average: 0, count: 0, userRating: null }
      }
      
      const userRating = userRatings.value[productId] || null
      return {
        average: productRating.average,
        count: productRating.count,
        userRating
      }
    }
  })

  // Actions
  const loadProductRatings = async (productId) => {
    loading.value = true
    try {
      // Simulate API call - in real app, this would fetch from backend
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data - replace with actual API call
      if (!ratings.value[productId]) {
        ratings.value[productId] = {
          average: Math.random() * 2 + 3, // Random rating between 3-5
          count: Math.floor(Math.random() * 100) + 10,
          userRatings: {}
        }
      }
      
      // Load user's rating if authenticated
      const userId = localStorage.getItem('userId')
      if (userId && ratings.value[productId].userRatings[userId]) {
        userRatings.value[productId] = ratings.value[productId].userRatings[userId]
      }
    } catch (error) {
      console.error('Error loading ratings:', error)
    } finally {
      loading.value = false
    }
  }

  const submitRating = async (productId, rating, comment = '') => {
    submitting.value = true
    try {
      // Simulate API call - in real app, this would post to backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const userId = localStorage.getItem('userId') || 'anonymous'
      
      // Update local state
      if (!ratings.value[productId]) {
        ratings.value[productId] = {
          average: rating,
          count: 1,
          userRatings: {}
        }
      } else {
        const currentRating = ratings.value[productId]
        const userRating = currentRating.userRatings[userId]
        
        if (userRating) {
          // Update existing rating
          const totalRating = currentRating.average * currentRating.count - userRating + rating
          currentRating.average = totalRating / currentRating.count
        } else {
          // Add new rating
          const totalRating = currentRating.average * currentRating.count + rating
          currentRating.count += 1
          currentRating.average = totalRating / currentRating.count
        }
        
        currentRating.userRatings[userId] = rating
      }
      
      // Update user's rating
      userRatings.value[productId] = rating
      
      return { success: true }
    } catch (error) {
      console.error('Error submitting rating:', error)
      return { success: false, error: error.message }
    } finally {
      submitting.value = false
    }
  }

  const getUserRating = (productId) => {
    return userRatings.value[productId] || null
  }

  const hasUserRated = (productId) => {
    return userRatings.value[productId] !== undefined
  }

  const clearUserRating = (productId) => {
    delete userRatings.value[productId]
  }

  return {
    // State
    ratings,
    userRatings,
    loading,
    submitting,
    
    // Computed
    getProductRating,
    
    // Actions
    loadProductRatings,
    submitRating,
    getUserRating,
    hasUserRated,
    clearUserRating
  }
} 