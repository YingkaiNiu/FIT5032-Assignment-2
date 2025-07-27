<template>
  <div class="products-page">
    <div class="container">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h3 mb-0">Health Services & Programs</h1>
              <p class="text-muted mb-0">Rate and review our health support services and programs</p>
            </div>
            <div class="d-flex gap-2">
              <div class="input-group" style="width: 300px;">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search services..."
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
                  <label for="categoryFilter" class="form-label">Category</label>
                  <select class="form-select" id="categoryFilter" v-model="filters.category">
                    <option value="">All Categories</option>
                    <option value="Medical Care">Medical Care</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Wellness Programs">Wellness Programs</option>
                    <option value="Support Groups">Support Groups</option>
                    <option value="Educational Services">Educational Services</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="availabilityFilter" class="form-label">Availability</label>
                  <select class="form-select" id="availabilityFilter" v-model="filters.availability">
                    <option value="">All Services</option>
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Waitlist">Waitlist</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="sortBy" class="form-label">Sort By</label>
                  <select class="form-select" id="sortBy" v-model="filters.sortBy">
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
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

      <!-- Products Grid -->
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <p class="mb-0 text-muted">
              Showing {{ filteredProducts.length }} of {{ products.length }} services
            </p>
            <div class="d-flex gap-2">
              <button 
                class="btn btn-outline-secondary" 
                :class="{ active: viewMode === 'grid' }"
                @click="viewMode = 'grid'"
              >
                <i class="bi bi-grid"></i>
              </button>
              <button 
                class="btn btn-outline-secondary" 
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
              >
                <i class="bi bi-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid View -->
      <div class="row" v-if="viewMode === 'grid'">
        <div 
          class="col-xl-3 col-lg-4 col-md-6 mb-4" 
          v-for="product in filteredProducts" 
          :key="product.id"
        >
          <div class="card product-card h-100 shadow-sm">
            <div class="product-image-container">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="card-img-top product-image"
                @error="handleImageError"
              />
              <div class="product-overlay">
                <div class="product-actions">
                  <button class="btn btn-primary btn-sm" @click="rateService(product)">
                    <i class="bi bi-star"></i> Rate Service
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text text-muted">{{ product.description }}</p>
              <div class="product-meta mb-3">
                <span class="badge bg-primary">{{ product.category }}</span>
                <RatingComponent 
                  :product-id="product.id"
                  :rating="product.rating"
                  :count="product.reviews"
                  :editable="true"
                  :show-submit-button="false"
                  size="small"
                  @rating-submitted="handleRatingSubmitted"
                />
              </div>
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="badge" :class="getAvailabilityClass(product.availability)">
                    {{ product.availability }}
                  </span>
                  <span class="text-muted small">
                    {{ product.participants }} participants
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div class="row" v-else>
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div 
                class="product-list-item d-flex align-items-center py-3 border-bottom"
                v-for="product in filteredProducts" 
                :key="product.id"
              >
                <div class="product-image-container me-3" style="width: 100px;">
                  <img 
                    :src="product.image" 
                    :alt="product.name"
                    class="img-fluid rounded"
                    @error="handleImageError"
                  />
                </div>
                <div class="flex-grow-1">
                  <h5 class="mb-1">{{ product.name }}</h5>
                  <p class="text-muted mb-2">{{ product.description }}</p>
                  <div class="d-flex align-items-center gap-3">
                    <span class="badge bg-primary">{{ product.category }}</span>
                    <RatingComponent 
                      :product-id="product.id"
                      :rating="product.rating"
                      :count="product.reviews"
                      :editable="true"
                      :show-submit-button="false"
                      size="small"
                      @rating-submitted="handleRatingSubmitted"
                    />
                    <span class="text-muted">
                      {{ product.participants }} participants
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <div class="mb-2">
                    <span class="badge" :class="getAvailabilityClass(product.availability)">
                      {{ product.availability }}
                    </span>
                  </div>
                  <div class="btn-group">
                    <button class="btn btn-primary btn-sm" @click="rateService(product)">
                      <i class="bi bi-star"></i> Rate Service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="row mt-4">
        <div class="col-12">
          <nav aria-label="Products pagination">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
                  Previous
                </a>
              </li>
              <li 
                class="page-item" 
                :class="{ active: page === currentPage }"
                v-for="page in totalPages" 
                :key="page"
              >
                <a class="page-link" href="#" @click.prevent="changePage(page)">
                  {{ page }}
                </a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
                  Next
                </a>
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
import { useRouter } from 'vue-router'
import RatingComponent from '../components/RatingComponent.vue'
import { useRatingStore } from '../stores/rating.js'

export default {
  name: 'Products',
  components: {
    RatingComponent
  },
  setup() {
    const router = useRouter()
    const ratingStore = useRatingStore()
    const products = ref([])
    const searchQuery = ref('')
    const showFilters = ref(false)
    const viewMode = ref('grid')
    const currentPage = ref(1)
    const itemsPerPage = 12

    const filters = reactive({
      category: '',
      availability: '',
      sortBy: 'name'
    })

    const loadProducts = async () => {
      // Mock data for health charity services
      products.value = [
        {
          id: 1,
          name: 'Elderly Health Check Program',
          description: 'Comprehensive health screening and monitoring services for elderly individuals, including blood pressure, diabetes, and heart health checks.',
          category: 'Medical Care',
          rating: 4.7,
          reviews: 156,
          availability: 'Available',
          participants: 89,
          image: 'https://via.placeholder.com/300x200/007bff/ffffff?text=Health+Check'
        },
        {
          id: 2,
          name: 'Mental Health Support Group',
          description: 'Weekly support group sessions for elderly individuals dealing with depression, anxiety, and loneliness. Led by licensed therapists.',
          category: 'Mental Health',
          rating: 4.9,
          reviews: 203,
          availability: 'Available',
          participants: 45,
          image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Mental+Health'
        },
        {
          id: 3,
          name: 'Nutrition & Wellness Workshop',
          description: 'Educational workshops on healthy eating, meal planning, and nutrition for elderly individuals and their caregivers.',
          category: 'Wellness Programs',
          rating: 4.5,
          reviews: 128,
          availability: 'Limited',
          participants: 67,
          image: 'https://via.placeholder.com/300x200/ffc107/ffffff?text=Nutrition'
        },
        {
          id: 4,
          name: 'Physical Therapy Sessions',
          description: 'Specialized physical therapy programs designed for elderly individuals to improve mobility, strength, and balance.',
          category: 'Medical Care',
          rating: 4.8,
          reviews: 189,
          availability: 'Waitlist',
          participants: 34,
          image: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=Physical+Therapy'
        },
        {
          id: 5,
          name: 'Caregiver Support Network',
          description: 'Support network and resources for family caregivers, including training, respite care, and emotional support.',
          category: 'Support Groups',
          rating: 4.6,
          reviews: 145,
          availability: 'Available',
          participants: 78,
          image: 'https://via.placeholder.com/300x200/17a2b8/ffffff?text=Caregiver+Support'
        },
        {
          id: 6,
          name: 'Health Education Seminars',
          description: 'Monthly educational seminars on various health topics including medication management, fall prevention, and chronic disease management.',
          category: 'Educational Services',
          rating: 4.4,
          reviews: 167,
          availability: 'Coming Soon',
          participants: 92,
          image: 'https://via.placeholder.com/300x200/6f42c1/ffffff?text=Health+Education'
        },
        {
          id: 7,
          name: 'Home Safety Assessment',
          description: 'Professional home safety assessments to identify and address potential hazards for elderly individuals living independently.',
          category: 'Wellness Programs',
          rating: 4.7,
          reviews: 134,
          availability: 'Available',
          participants: 56,
          image: 'https://via.placeholder.com/300x200/20c997/ffffff?text=Home+Safety'
        },
        {
          id: 8,
          name: 'Social Activities Club',
          description: 'Regular social activities and events designed to reduce isolation and promote social connections among elderly individuals.',
          category: 'Support Groups',
          rating: 4.8,
          reviews: 178,
          availability: 'Available',
          participants: 123,
          image: 'https://via.placeholder.com/300x200/fd7e14/ffffff?text=Social+Activities'
        }
      ]
    }

    const filteredProducts = computed(() => {
      let filtered = products.value

      // Search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
        )
      }

      // Category filter
      if (filters.category) {
        filtered = filtered.filter(product => product.category === filters.category)
      }

      // Availability filter
      if (filters.availability) {
        filtered = filtered.filter(product => product.availability === filters.availability)
      }

      // Sort
      switch (filters.sortBy) {
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          filtered.sort((a, b) => b.id - a.id)
          break
        case 'popular':
          filtered.sort((a, b) => b.participants - a.participants)
          break
        default:
          filtered.sort((a, b) => a.name.localeCompare(b.name))
      }

      return filtered
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage)
    })

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredProducts.value.slice(start, end)
    })

    const handleSearch = () => {
      currentPage.value = 1
    }

    const clearFilters = () => {
      filters.category = ''
      filters.availability = ''
      filters.sortBy = 'name'
      searchQuery.value = ''
      currentPage.value = 1
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }



    const rateService = (product) => {
      // Show a message to guide user to rate the service
      alert(`Please click on the stars next to "${product.name}" to rate this service.`)
    }

    const getAvailabilityClass = (availability) => {
      switch (availability) {
        case 'Available':
          return 'bg-success'
        case 'Limited':
          return 'bg-warning'
        case 'Waitlist':
          return 'bg-info'
        case 'Coming Soon':
          return 'bg-secondary'
        default:
          return 'bg-secondary'
      }
    }

    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/300x200/6c757d/ffffff?text=No+Image'
    }

    const handleRatingSubmitted = async (ratingData) => {
      try {
        const result = await ratingStore.submitRating(
          ratingData.productId, 
          ratingData.rating, 
          ratingData.comment
        )
        
        if (result.success) {
          // Update the product's rating in the local state
          const product = products.value.find(p => p.id === ratingData.productId)
          if (product) {
            const newRating = ratingStore.getProductRating.value(ratingData.productId)
            product.rating = newRating.average
            product.reviews = newRating.count
          }
          
          // Show success message
          alert('Rating submitted successfully!')
        } else {
          alert('Failed to submit rating. Please try again.')
        }
      } catch (error) {
        console.error('Error handling rating submission:', error)
        alert('An error occurred while submitting your rating.')
      }
    }

    onMounted(() => {
      loadProducts()
    })

    return {
      products,
      searchQuery,
      showFilters,
      viewMode,
      currentPage,
      filters,
      filteredProducts: paginatedProducts,
      totalPages,
      handleSearch,
      clearFilters,
      changePage,
      rateService,
      getAvailabilityClass,
      handleImageError,
      handleRatingSubmitted
    }
  }
}
</script>

<style scoped>
.products-page {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
}

.product-list-item {
  transition: background-color 0.2s ease;
}

.product-list-item:hover {
  background-color: #f8f9fa;
}

.btn-group .btn {
  border-radius: 0.25rem;
}

@media (max-width: 768px) {
  .products-page {
    padding: 1rem;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .product-list-item {
    flex-direction: column;
    text-align: center;
  }
  
  .product-list-item .text-end {
    text-align: center !important;
    margin-top: 1rem;
  }
}
</style> 