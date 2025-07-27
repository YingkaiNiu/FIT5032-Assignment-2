<template>
  <div class="reviews-page">
    <div class="container">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h3 mb-0">Service Reviews & Ratings</h1>
              <p class="text-muted mb-0">See what our community members are saying about our health services</p>
            </div>
            <div class="d-flex gap-2">
              <div class="input-group" style="width: 300px;">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search service reviews..."
                  v-model="searchQuery"
                  @input="handleSearch"
                />
                <button class="btn btn-outline-secondary" type="button">
                  <i class="bi bi-search"></i>
                </button>
              </div>
              <button class="btn btn-primary" @click="showFilters = !showFilters">
                <i class="bi bi-funnel"></i> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="row mb-4" v-if="showFilters">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">
                  <label for="ratingFilter" class="form-label">Rating</label>
                  <select class="form-select" id="ratingFilter" v-model="filters.rating">
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="productFilter" class="form-label">Service</label>
                  <select class="form-select" id="productFilter" v-model="filters.product">
                    <option value="">All Services</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="sortBy" class="form-label">Sort By</label>
                  <select class="form-select" id="sortBy" v-model="filters.sortBy">
                    <option value="date">Date</option>
                    <option value="rating">Rating</option>
                    <option value="product">Service</option>
                  </select>
                </div>
                <div class="col-md-3 d-flex align-items-end">
                  <button class="btn btn-outline-secondary w-100" @click="clearFilters">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row text-center">
                <div class="col-md-3">
                  <div class="stat-item">
                    <h3 class="text-primary mb-1">{{ totalReviews }}</h3>
                    <p class="text-muted mb-0">Total Reviews</p>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="stat-item">
                    <h3 class="text-warning mb-1">{{ averageRating.toFixed(1) }}</h3>
                    <p class="text-muted mb-0">Average Rating</p>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="stat-item">
                    <h3 class="text-success mb-1">{{ totalProducts }}</h3>
                    <p class="text-muted mb-0">Services Rated</p>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="stat-item">
                    <h3 class="text-info mb-1">{{ fiveStarPercentage }}%</h3>
                    <p class="text-muted mb-0">5-Star Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rating Distribution -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Rating Distribution</h5>
            </div>
            <div class="card-body">
              <div class="rating-distribution">
                <div 
                  v-for="rating in 5" 
                  :key="rating" 
                  class="rating-bar d-flex align-items-center mb-2"
                >
                  <div class="rating-label me-3" style="width: 60px;">
                    {{ rating }} <i class="bi bi-star-fill text-warning"></i>
                  </div>
                  <div class="progress flex-grow-1 me-3" style="height: 20px;">
                    <div 
                      class="progress-bar bg-warning" 
                      :style="{ width: getRatingPercentage(6 - rating) + '%' }"
                    ></div>
                  </div>
                  <div class="rating-count" style="width: 50px; text-align: right;">
                    {{ getRatingCount(6 - rating) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews List -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <p class="mb-0 text-muted">
              Showing {{ filteredReviews.length }} of {{ allReviews.length }} service reviews
            </p>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-outline-secondary" 
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <i class="bi bi-list"></i> List
              </button>
              <button 
                class="btn btn-outline-secondary" 
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                <i class="bi bi-grid"></i> Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div class="row" v-if="viewMode === 'list'">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div 
                v-for="review in paginatedReviews" 
                :key="review.id"
                class="review-item border-bottom pb-3 mb-3"
              >
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 class="mb-1">{{ review.productName }}</h6>
                    <RatingComponent 
                      :product-id="review.productId"
                      :rating="review.rating"
                      :count="0"
                      :editable="false"
                      :show-text="false"
                      :show-count="false"
                      size="small"
                    />
                  </div>
                  <small class="text-muted">{{ formatDate(review.date) }}</small>
                </div>
                <p class="mb-2">{{ review.comment }}</p>
                <div class="d-flex align-items-center">
                  <i class="bi bi-person-circle me-2"></i>
                  <span class="text-muted">{{ review.userName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div class="row" v-else>
        <div 
          class="col-lg-4 col-md-6 mb-4" 
          v-for="review in paginatedReviews" 
          :key="review.id"
        >
          <div class="card review-card h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h6 class="card-title">{{ review.productName }}</h6>
                <small class="text-muted">{{ formatDate(review.date) }}</small>
              </div>
              <RatingComponent 
                :product-id="review.productId"
                :rating="review.rating"
                :count="0"
                :editable="false"
                :show-text="false"
                :show-count="false"
                size="small"
              />
              <p class="card-text mt-3">{{ review.comment }}</p>
              <div class="d-flex align-items-center mt-auto">
                <i class="bi bi-person-circle me-2"></i>
                <span class="text-muted">{{ review.userName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="row" v-if="totalPages > 1">
        <div class="col-12">
          <nav aria-label="Reviews pagination">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li 
                v-for="page in visiblePages" 
                :key="page"
                class="page-item" 
                :class="{ active: page === currentPage }"
              >
                <button class="page-link" @click="changePage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import RatingComponent from '../components/RatingComponent.vue'
import { useRatingStore } from '../stores/rating.js'

export default {
  name: 'Reviews',
  components: {
    RatingComponent
  },
  setup() {
    const ratingStore = useRatingStore()
    
    const searchQuery = ref('')
    const showFilters = ref(false)
    const viewMode = ref('list')
    const currentPage = ref(1)
    const itemsPerPage = 12

    const filters = reactive({
      rating: '',
      product: '',
      sortBy: 'date'
    })

    // Mock data - in real app, this would come from API
    const products = ref([
      { id: 1, name: 'Elderly Health Check Program' },
      { id: 2, name: 'Mental Health Support Group' },
      { id: 3, name: 'Nutrition & Wellness Workshop' },
      { id: 4, name: 'Physical Therapy Sessions' },
      { id: 5, name: 'Caregiver Support Network' },
      { id: 6, name: 'Health Education Seminars' },
      { id: 7, name: 'Home Safety Assessment' },
      { id: 8, name: 'Social Activities Club' }
    ])

    const allReviews = ref([
      {
        id: 1,
        productId: 1,
        productName: 'Elderly Health Check Program',
        rating: 5,
        comment: 'Excellent service! The health check was thorough and the staff was very caring and professional.',
        userName: 'Margaret Johnson',
        date: new Date('2024-01-15')
      },
      {
        id: 2,
        productId: 1,
        productName: 'Elderly Health Check Program',
        rating: 4,
        comment: 'Very helpful program. The nurses were knowledgeable and made me feel comfortable during the check-up.',
        userName: 'Robert Smith',
        date: new Date('2024-01-10')
      },
      {
        id: 3,
        productId: 2,
        productName: 'Mental Health Support Group',
        rating: 5,
        comment: 'This support group has been a lifesaver for me. The therapist is amazing and the group members are so supportive.',
        userName: 'Helen Davis',
        date: new Date('2024-01-12')
      },
      {
        id: 4,
        productId: 3,
        productName: 'Nutrition & Wellness Workshop',
        rating: 4,
        comment: 'Great workshop on healthy eating! Learned a lot about meal planning and nutrition for seniors.',
        userName: 'Dorothy Wilson',
        date: new Date('2024-01-08')
      },
      {
        id: 5,
        productId: 4,
        productName: 'Physical Therapy Sessions',
        rating: 5,
        comment: 'The physical therapy sessions have really improved my mobility and strength. Highly recommend!',
        userName: 'James Brown',
        date: new Date('2024-01-05')
      },
      {
        id: 6,
        productId: 5,
        productName: 'Caregiver Support Network',
        rating: 4,
        comment: 'Wonderful support for caregivers. The resources and emotional support have been invaluable.',
        userName: 'Mary Anderson',
        date: new Date('2024-01-03')
      },
      {
        id: 7,
        productId: 6,
        productName: 'Health Education Seminars',
        rating: 5,
        comment: 'Very informative seminars on medication management and fall prevention. The speakers are experts in their field.',
        userName: 'Thomas Miller',
        date: new Date('2024-01-07')
      },
      {
        id: 8,
        productId: 7,
        productName: 'Home Safety Assessment',
        rating: 4,
        comment: 'Professional assessment that identified several safety hazards in my home. The recommendations were practical.',
        userName: 'Betty Taylor',
        date: new Date('2024-01-09')
      },
      {
        id: 9,
        productId: 8,
        productName: 'Social Activities Club',
        rating: 5,
        comment: 'Love the social activities! Made many new friends and the events are always fun and engaging.',
        userName: 'George White',
        date: new Date('2024-01-11')
      }
    ])

    const filteredReviews = computed(() => {
      let filtered = allReviews.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(review => 
          review.productName.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query) ||
          review.userName.toLowerCase().includes(query)
        )
      }

      // Rating filter
      if (filters.rating) {
        const minRating = parseInt(filters.rating)
        filtered = filtered.filter(review => review.rating >= minRating)
      }

      // Product filter
      if (filters.product) {
        filtered = filtered.filter(review => review.productId === parseInt(filters.product))
      }

      // Sort
      switch (filters.sortBy) {
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'product':
          filtered.sort((a, b) => a.productName.localeCompare(b.productName))
          break
        default:
          filtered.sort((a, b) => b.date - a.date)
      }

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredReviews.value.length / itemsPerPage)
    })

    const paginatedReviews = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredReviews.value.slice(start, end)
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

    // Statistics
    const totalReviews = computed(() => allReviews.value.length)
    const totalProducts = computed(() => new Set(allReviews.value.map(r => r.productId)).size)
    const averageRating = computed(() => {
      const total = allReviews.value.reduce((sum, review) => sum + review.rating, 0)
      return total / totalReviews.value
    })
    const fiveStarPercentage = computed(() => {
      const fiveStarCount = allReviews.value.filter(review => review.rating === 5).length
      return Math.round((fiveStarCount / totalReviews.value) * 100)
    })

    const getRatingPercentage = (rating) => {
      const count = allReviews.value.filter(r => r.rating === rating).length
      return (count / totalReviews.value) * 100
    }

    const getRatingCount = (rating) => {
      return allReviews.value.filter(r => r.rating === rating).length
    }

    const handleSearch = () => {
      currentPage.value = 1
    }

    const clearFilters = () => {
      filters.rating = ''
      filters.product = ''
      filters.sortBy = 'date'
      searchQuery.value = ''
      currentPage.value = 1
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    }

    onMounted(() => {
      // Load any additional data if needed
    })

    return {
      searchQuery,
      showFilters,
      viewMode,
      currentPage,
      filters,
      products,
      allReviews,
      filteredReviews: paginatedReviews,
      totalPages,
      visiblePages,
      totalReviews,
      totalProducts,
      averageRating,
      fiveStarPercentage,
      getRatingPercentage,
      getRatingCount,
      handleSearch,
      clearFilters,
      changePage,
      formatDate
    }
  }
}
</script>

<style scoped>
.reviews-page {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.stat-item {
  padding: 1rem;
}

.stat-item h3 {
  font-size: 2rem;
  font-weight: 700;
}

.rating-distribution {
  max-width: 500px;
}

.rating-bar {
  font-size: 0.9rem;
}

.review-item:last-child {
  border-bottom: none !important;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

.review-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  border-radius: 0.5rem;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
}

.progress {
  background-color: #e9ecef;
}

.progress-bar {
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .reviews-page {
    padding: 1rem;
  }
  
  .stat-item h3 {
    font-size: 1.5rem;
  }
  
  .rating-distribution {
    max-width: 100%;
  }
}
</style> 