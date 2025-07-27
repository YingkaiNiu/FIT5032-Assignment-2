<template>
  <div class="rating-component">
    <!-- Display Rating -->
    <div v-if="!editable" class="rating-display">
      <div class="stars">
        <i 
          v-for="star in 5" 
          :key="star"
          :class="star <= displayRating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
        ></i>
      </div>
      <span v-if="showText" class="rating-text ms-2">
        {{ displayRating.toFixed(1) }} out of 5
      </span>
      <span v-if="showCount && ratingCount > 0" class="rating-count ms-2 text-muted">
        ({{ ratingCount }} {{ ratingCount === 1 ? 'review' : 'reviews' }})
      </span>
    </div>

    <!-- Editable Rating -->
    <div v-else class="rating-editable">
      <div class="stars-interactive">
        <i 
          v-for="star in 5" 
          :key="star"
          :class="getStarClass(star)"
          @click="handleStarClick(star)"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
          class="star-icon"
        ></i>
      </div>
      <div v-if="showText" class="rating-text ms-2">
        {{ getRatingText() }}
      </div>
      <div v-if="showSubmitButton && selectedRating > 0" class="mt-2">
        <button 
          class="btn btn-primary btn-sm"
          @click="submitRating"
          :disabled="submitting"
        >
          <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
          {{ submitting ? 'Submitting...' : 'Submit Rating' }}
        </button>
      </div>
    </div>


  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'

export default {
  name: 'RatingComponent',
  props: {
    productId: {
      type: [String, Number],
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    userRating: {
      type: Number,
      default: null
    },
    editable: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: true
    },
    showCount: {
      type: Boolean,
      default: true
    },
    showSubmitButton: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'normal', // 'small', 'normal', 'large'
      validator: (value) => ['small', 'normal', 'large'].includes(value)
    }
  },
  emits: ['rating-submitted', 'rating-updated'],
  setup(props, { emit }) {
    const selectedRating = ref(props.userRating || 0)
    const hoverRating = ref(0)
    const comment = ref('')
    const submitting = ref(false)

    const displayRating = computed(() => {
      if (props.editable && hoverRating.value > 0) {
        return hoverRating.value
      }
      return props.rating
    })

    const ratingCount = computed(() => props.count)

    const getStarClass = (star) => {
      const rating = hoverRating.value > 0 ? hoverRating.value : selectedRating.value
      return star <= rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'
    }

    const getRatingText = () => {
      const rating = selectedRating.value
      if (rating === 0) return 'Select a rating'
      if (rating === 1) return 'Poor'
      if (rating === 2) return 'Fair'
      if (rating === 3) return 'Good'
      if (rating === 4) return 'Very Good'
      if (rating === 5) return 'Excellent'
      return `${rating} out of 5`
    }

    const handleStarClick = (star) => {
      selectedRating.value = star
      if (props.showSubmitButton) {
        // If submit button is shown, don't auto-submit
        return
      }
      submitRating()
    }

    const submitRating = async () => {
      if (selectedRating.value === 0) return
      
      submitting.value = true
      try {
        // Emit the rating event
        emit('rating-submitted', {
          productId: props.productId,
          rating: selectedRating.value,
          comment: comment.value
        })
        
        // Clear comment after submission
        comment.value = ''
      } catch (error) {
        console.error('Error submitting rating:', error)
      } finally {
        submitting.value = false
      }
    }

    const confirmRating = async () => {
      await submitRating()
    }

    const showRatingModal = () => {
      // Modal functionality can be added later if needed
    }

    // Watch for changes in userRating prop
    watch(() => props.userRating, (newRating) => {
      if (newRating !== null) {
        selectedRating.value = newRating
      }
    })

    onMounted(() => {
      // Bootstrap Modal will be initialized when needed
      // For now, we'll use a simple approach without Bootstrap Modal
    })

    return {
      selectedRating,
      hoverRating,
      comment,
      submitting,
      displayRating,
      ratingCount,
      getStarClass,
      getRatingText,
      handleStarClick,
      submitRating,
      confirmRating,
      showRatingModal
    }
  }
}
</script>

<style scoped>
.rating-component {
  display: inline-flex;
  align-items: center;
}

.stars, .stars-interactive {
  display: inline-flex;
  align-items: center;
}

.star-icon {
  cursor: pointer;
  transition: transform 0.1s ease;
  font-size: 1.1em;
}

.star-icon:hover {
  transform: scale(1.1);
}

.rating-text {
  font-weight: 500;
  color: #495057;
}

.rating-count {
  font-size: 0.9em;
}

/* Size variants */
.rating-component.small .star-icon {
  font-size: 0.9em;
}

.rating-component.large .star-icon {
  font-size: 1.3em;
}

/* Modal styles */
.modal .stars-interactive {
  justify-content: center;
}

.modal .star-icon {
  font-size: 1.5em;
  margin: 0 0.1em;
}

/* Responsive */
@media (max-width: 768px) {
  .rating-component {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .rating-text, .rating-count {
    margin-left: 0 !important;
    margin-top: 0.25rem;
  }
}
</style> 