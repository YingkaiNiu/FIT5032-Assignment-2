<template>
  <div class="products-page">
    <div class="container">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h1 class="h3 mb-0">Products</h1>
              <p class="text-muted mb-0">Browse our collection of products</p>
            </div>
            <div class="d-flex gap-2">
              <div class="input-group" style="width: 300px;">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Search products..."
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
                    <option value="Books">Books</option>
                    <option value="Courses">Courses</option>
                    <option value="Templates">Templates</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="priceFilter" class="form-label">Price Range</label>
                  <select class="form-select" id="priceFilter" v-model="filters.priceRange">
                    <option value="">All Prices</option>
                    <option value="0-25">$0 - $25</option>
                    <option value="25-50">$25 - $50</option>
                    <option value="50-100">$50 - $100</option>
                    <option value="100+">$100+</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label for="sortBy" class="form-label">Sort By</label>
                  <select class="form-select" id="sortBy" v-model="filters.sortBy">
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
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
              Showing {{ filteredProducts.length }} of {{ products.length }} products
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
                  <button class="btn btn-primary btn-sm" @click="viewProduct(product)">
                    <i class="bi bi-eye"></i> View
                  </button>
                  <button class="btn btn-outline-primary btn-sm" @click="addToCart(product)">
                    <i class="bi bi-cart-plus"></i> Add to Cart
                  </button>
                </div>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text text-muted">{{ product.description }}</p>
              <div class="product-meta mb-3">
                <span class="badge bg-primary">{{ product.category }}</span>
                <div class="rating">
                  <i 
                    v-for="star in 5" 
                    :key="star"
                    :class="star <= product.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
                  ></i>
                  <span class="ms-1 text-muted">({{ product.reviews }})</span>
                </div>
              </div>
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="h5 mb-0 text-primary">${{ product.price }}</span>
                  <span class="text-muted small">
                    {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
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
                    <div class="rating">
                      <i 
                        v-for="star in 5" 
                        :key="star"
                        :class="star <= product.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
                      ></i>
                      <span class="ms-1 text-muted">({{ product.reviews }})</span>
                    </div>
                    <span class="text-muted">
                      {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                    </span>
                  </div>
                </div>
                <div class="text-end">
                  <div class="h5 mb-2 text-primary">${{ product.price }}</div>
                  <div class="btn-group">
                    <button class="btn btn-outline-primary btn-sm" @click="viewProduct(product)">
                      <i class="bi bi-eye"></i> View
                    </button>
                    <button class="btn btn-primary btn-sm" @click="addToCart(product)">
                      <i class="bi bi-cart-plus"></i> Add to Cart
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

export default {
  name: 'Products',
  setup() {
    const router = useRouter()
    const products = ref([])
    const searchQuery = ref('')
    const showFilters = ref(false)
    const viewMode = ref('grid')
    const currentPage = ref(1)
    const itemsPerPage = 12

    const filters = reactive({
      category: '',
      priceRange: '',
      sortBy: 'name'
    })

    const loadProducts = async () => {
      // Mock data
      products.value = [
        {
          id: 1,
          name: 'Vue.js Development Guide',
          description: 'Comprehensive guide to Vue.js development with best practices and advanced techniques.',
          category: 'Books',
          price: 29.99,
          rating: 4.5,
          reviews: 128,
          stock: 50,
          image: 'https://via.placeholder.com/300x200/007bff/ffffff?text=Vue.js+Guide'
        },
        {
          id: 2,
          name: 'Web Development Course',
          description: 'Complete web development course covering HTML, CSS, JavaScript, and modern frameworks.',
          category: 'Courses',
          price: 99.99,
          rating: 4.8,
          reviews: 256,
          stock: 25,
          image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Web+Course'
        },
        {
          id: 3,
          name: 'Premium Template Bundle',
          description: 'Collection of premium responsive templates for various business needs.',
          category: 'Templates',
          price: 19.99,
          rating: 4.2,
          reviews: 89,
          stock: 0,
          image: 'https://via.placeholder.com/300x200/ffc107/ffffff?text=Templates'
        },
        {
          id: 4,
          name: 'Development Tools Kit',
          description: 'Essential development tools and utilities for modern web development.',
          category: 'Tools',
          price: 49.99,
          rating: 4.6,
          reviews: 156,
          stock: 30,
          image: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=Tools+Kit'
        },
        {
          id: 5,
          name: 'JavaScript Mastery',
          description: 'Advanced JavaScript concepts and modern ES6+ features explained in detail.',
          category: 'Books',
          price: 34.99,
          rating: 4.7,
          reviews: 203,
          stock: 40,
          image: 'https://via.placeholder.com/300x200/17a2b8/ffffff?text=JavaScript'
        },
        {
          id: 6,
          name: 'React Fundamentals',
          description: 'Learn React from scratch with hands-on projects and real-world examples.',
          category: 'Courses',
          price: 79.99,
          rating: 4.9,
          reviews: 312,
          stock: 15,
          image: 'https://via.placeholder.com/300x200/6f42c1/ffffff?text=React+Course'
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

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number)
        filtered = filtered.filter(product => {
          if (max) {
            return product.price >= min && product.price <= max
          } else {
            return product.price >= min
          }
        })
      }

      // Sort
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'newest':
          filtered.sort((a, b) => b.id - a.id)
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
      filters.priceRange = ''
      filters.sortBy = 'name'
      searchQuery.value = ''
      currentPage.value = 1
    }

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const viewProduct = (product) => {
      router.push(`/products/${product.id}`)
    }

    const addToCart = (product) => {
      // Implementation for adding to cart
      console.log('Adding to cart:', product)
    }

    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/300x200/6c757d/ffffff?text=No+Image'
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
      viewProduct,
      addToCart,
      handleImageError
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