<template>
  <div class="product-detail-page">
    <div class="container">
      <!-- Breadcrumb -->
      <nav aria-label="breadcrumb" class="mb-4">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">Home</router-link>
          </li>
          <li class="breadcrumb-item">
            <router-link to="/products">Products</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ product?.name }}</li>
        </ol>
      </nav>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="product" class="row">
        <!-- Product Images -->
        <div class="col-lg-6 mb-4">
          <div class="product-images">
            <div class="main-image-container mb-3">
              <img 
                :src="selectedImage" 
                :alt="product.name"
                class="img-fluid main-image"
                @error="handleImageError"
              />
            </div>
            <div class="thumbnail-images d-flex gap-2">
              <img 
                v-for="(image, index) in product.images" 
                :key="index"
                :src="image" 
                :alt="`${product.name} - Image ${index + 1}`"
                class="thumbnail-image"
                :class="{ active: selectedImage === image }"
                @click="selectedImage = image"
                @error="handleImageError"
              />
            </div>
          </div>
        </div>

        <!-- Product Information -->
        <div class="col-lg-6">
          <div class="product-info">
            <h1 class="product-title mb-3">{{ product.name }}</h1>
            
            <!-- Rating and Reviews -->
            <div class="product-rating mb-3">
              <div class="d-flex align-items-center gap-2">
                <div class="rating-stars">
                  <i 
                    v-for="star in 5" 
                    :key="star"
                    :class="star <= product.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
                  ></i>
                </div>
                <span class="rating-text">{{ product.rating }} out of 5</span>
                <span class="reviews-count">({{ product.reviews }} reviews)</span>
              </div>
            </div>

            <!-- Price -->
            <div class="product-price mb-4">
              <span class="current-price">${{ product.price }}</span>
              <span v-if="product.originalPrice" class="original-price ms-2">${{ product.originalPrice }}</span>
              <span v-if="product.discount" class="discount-badge ms-2">{{ product.discount }}% OFF</span>
            </div>

            <!-- Description -->
            <div class="product-description mb-4">
              <h5>Description</h5>
              <p>{{ product.description }}</p>
            </div>

            <!-- Features -->
            <div class="product-features mb-4" v-if="product.features">
              <h5>Features</h5>
              <ul class="feature-list">
                <li v-for="feature in product.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>

            <!-- Purchase Options -->
            <div class="purchase-options mb-4">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="quantity" class="form-label">Quantity</label>
                  <div class="input-group">
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="quantity > 1 && quantity--"
                    >
                      <i class="bi bi-dash"></i>
                    </button>
                    <input 
                      type="number" 
                      class="form-control text-center" 
                      id="quantity"
                      v-model="quantity"
                      min="1"
                      :max="product.stock"
                    />
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button"
                      @click="quantity < product.stock && quantity++"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Availability</label>
                  <div class="availability-status">
                    <span 
                      :class="product.stock > 0 ? 'text-success' : 'text-danger'"
                      class="fw-bold"
                    >
                      {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <button 
                  class="btn btn-primary btn-lg me-3 mb-2"
                  :disabled="product.stock === 0"
                  @click="addToCart"
                >
                  <i class="bi bi-cart-plus me-2"></i>
                  Add to Cart
                </button>
                <button 
                  class="btn btn-success btn-lg me-3 mb-2"
                  :disabled="product.stock === 0"
                  @click="buyNow"
                >
                  <i class="bi bi-lightning me-2"></i>
                  Buy Now
                </button>
                <button class="btn btn-outline-primary mb-2" @click="addToWishlist">
                  <i class="bi bi-heart me-2"></i>
                  Add to Wishlist
                </button>
              </div>
            </div>

            <!-- Product Meta -->
            <div class="product-meta">
              <div class="row">
                <div class="col-md-6">
                  <p class="mb-1"><strong>Category:</strong> {{ product.category }}</p>
                  <p class="mb-1"><strong>SKU:</strong> {{ product.sku }}</p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1"><strong>Weight:</strong> {{ product.weight }}</p>
                  <p class="mb-1"><strong>Dimensions:</strong> {{ product.dimensions }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div v-if="product" class="row mt-5">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="mb-0">Customer Reviews</h4>
              <button class="btn btn-primary" @click="showReviewForm = true">
                Write a Review
              </button>
            </div>
            <div class="card-body">
              <!-- Review Summary -->
              <div class="review-summary mb-4">
                <div class="row align-items-center">
                  <div class="col-md-3 text-center">
                    <div class="average-rating">
                      <h2 class="mb-0">{{ product.rating }}</h2>
                      <div class="rating-stars mb-2">
                        <i 
                          v-for="star in 5" 
                          :key="star"
                          :class="star <= product.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
                        ></i>
                      </div>
                      <p class="text-muted">Based on {{ product.reviews }} reviews</p>
                    </div>
                  </div>
                  <div class="col-md-9">
                    <div class="rating-bars">
                      <div 
                        v-for="rating in 5" 
                        :key="rating"
                        class="rating-bar d-flex align-items-center mb-2"
                      >
                        <span class="rating-label me-2">{{ 6 - rating }} stars</span>
                        <div class="progress flex-grow-1 me-2" style="height: 8px;">
                          <div 
                            class="progress-bar bg-warning" 
                            :style="{ width: getRatingPercentage(6 - rating) + '%' }"
                          ></div>
                        </div>
                        <span class="rating-count">{{ getRatingCount(6 - rating) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Review Form -->
              <div v-if="showReviewForm" class="review-form mb-4">
                <h5>Write Your Review</h5>
                <form @submit.prevent="submitReview">
                  <div class="mb-3">
                    <label class="form-label">Rating</label>
                    <div class="rating-input">
                      <i 
                        v-for="star in 5" 
                        :key="star"
                        :class="star <= reviewForm.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
                        @click="reviewForm.rating = star"
                        style="cursor: pointer; font-size: 1.5rem;"
                      ></i>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="reviewTitle" class="form-label">Title</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="reviewTitle"
                      v-model="reviewForm.title"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="reviewContent" class="form-label">Review</label>
                    <textarea 
                      class="form-control" 
                      id="reviewContent"
                      v-model="reviewForm.content"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">Submit Review</button>
                    <button type="button" class="btn btn-outline-secondary" @click="showReviewForm = false">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              <!-- Reviews List -->
              <div class="reviews-list">
                <div 
                  v-for="review in product.reviewList" 
                  :key="review.id"
                  class="review-item border-bottom pb-3 mb-3"
                >
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 class="mb-1">{{ review.title }}</h6>
                      <div class="rating-stars mb-1">
                        <i 
                          v-for="star in 5" 
                          :key="star"
                          :class="star <= review.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
                        ></i>
                      </div>
                    </div>
                    <small class="text-muted">{{ formatDate(review.date) }}</small>
                  </div>
                  <p class="mb-2">{{ review.content }}</p>
                  <div class="review-meta">
                    <span class="text-muted">By {{ review.author }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="row mt-5">
        <div class="col-12">
          <h4 class="mb-4">Related Products</h4>
          <div class="row">
            <div 
              class="col-lg-3 col-md-4 col-sm-6 mb-4"
              v-for="relatedProduct in relatedProducts" 
              :key="relatedProduct.id"
            >
              <div class="card product-card h-100">
                <img 
                  :src="relatedProduct.image" 
                  :alt="relatedProduct.name"
                  class="card-img-top"
                  style="height: 200px; object-fit: cover;"
                />
                <div class="card-body">
                  <h6 class="card-title">{{ relatedProduct.name }}</h6>
                  <p class="card-text text-muted small">{{ relatedProduct.description }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-primary fw-bold">${{ relatedProduct.price }}</span>
                    <router-link :to="`/products/${relatedProduct.id}`" class="btn btn-outline-primary btn-sm">
                      View
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'ProductDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const loading = ref(true)
    const product = ref(null)
    const selectedImage = ref('')
    const quantity = ref(1)
    const showReviewForm = ref(false)
    const relatedProducts = ref([])

    const reviewForm = reactive({
      rating: 0,
      title: '',
      content: ''
    })

    const loadProduct = async () => {
      loading.value = true
      try {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock product data
        product.value = {
          id: parseInt(route.params.id),
          name: 'Vue.js Development Guide',
          description: 'Comprehensive guide to Vue.js development with best practices and advanced techniques. This book covers everything from basic concepts to advanced patterns, making it perfect for both beginners and experienced developers.',
          category: 'Books',
          price: 29.99,
          originalPrice: 39.99,
          discount: 25,
          rating: 4.5,
          reviews: 128,
          stock: 50,
          sku: 'VUE-001',
          weight: '1.2 lbs',
          dimensions: '8.5" x 11" x 1"',
          images: [
            'https://via.placeholder.com/600x400/007bff/ffffff?text=Vue.js+Guide+1',
            'https://via.placeholder.com/600x400/28a745/ffffff?text=Vue.js+Guide+2',
            'https://via.placeholder.com/600x400/ffc107/ffffff?text=Vue.js+Guide+3'
          ],
          features: [
            'Comprehensive Vue.js coverage',
            'Real-world examples and projects',
            'Best practices and patterns',
            'Advanced concepts and techniques',
            'Performance optimization tips'
          ],
          reviewList: [
            {
              id: 1,
              title: 'Excellent Resource',
              content: 'This book is a must-have for any Vue.js developer. The examples are clear and the explanations are thorough.',
              rating: 5,
              author: 'John Doe',
              date: new Date('2024-01-15')
            },
            {
              id: 2,
              title: 'Great for Beginners',
              content: 'Perfect for someone starting with Vue.js. The step-by-step approach makes it easy to follow.',
              rating: 4,
              author: 'Jane Smith',
              date: new Date('2024-01-10')
            }
          ]
        }
        
        selectedImage.value = product.value.images[0]
        
        // Load related products
        relatedProducts.value = [
          {
            id: 2,
            name: 'Web Development Course',
            description: 'Complete web development course',
            price: 99.99,
            image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Web+Course'
          },
          {
            id: 3,
            name: 'JavaScript Mastery',
            description: 'Advanced JavaScript concepts',
            price: 34.99,
            image: 'https://via.placeholder.com/300x200/17a2b8/ffffff?text=JavaScript'
          },
          {
            id: 4,
            name: 'React Fundamentals',
            description: 'Learn React from scratch',
            price: 79.99,
            image: 'https://via.placeholder.com/300x200/6f42c1/ffffff?text=React+Course'
          }
        ]
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        loading.value = false
      }
    }

    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/600x400/6c757d/ffffff?text=No+Image'
    }

    const addToCart = () => {
      console.log('Adding to cart:', { product: product.value, quantity: quantity.value })
    }

    const buyNow = () => {
      console.log('Buying now:', { product: product.value, quantity: quantity.value })
    }

    const addToWishlist = () => {
      console.log('Adding to wishlist:', product.value)
    }

    const getRatingPercentage = (rating) => {
      if (!product.value?.reviewList) return 0
      const count = product.value.reviewList.filter(r => r.rating === rating).length
      return (count / product.value.reviewList.length) * 100
    }

    const getRatingCount = (rating) => {
      if (!product.value?.reviewList) return 0
      return product.value.reviewList.filter(r => r.rating === rating).length
    }

    const submitReview = () => {
      console.log('Submitting review:', reviewForm)
      // Reset form
      reviewForm.rating = 0
      reviewForm.title = ''
      reviewForm.content = ''
      showReviewForm.value = false
    }

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date)
    }

    onMounted(() => {
      loadProduct()
    })

    return {
      loading,
      product,
      selectedImage,
      quantity,
      showReviewForm,
      relatedProducts,
      reviewForm,
      handleImageError,
      addToCart,
      buyNow,
      addToWishlist,
      getRatingPercentage,
      getRatingCount,
      submitReview,
      formatDate
    }
  }
}
</script>

<style scoped>
.product-detail-page {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.main-image-container {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.thumbnail-images {
  overflow-x: auto;
}

.thumbnail-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border: 2px solid transparent;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.thumbnail-image:hover,
.thumbnail-image.active {
  border-color: #007bff;
}

.product-title {
  color: #333;
  font-weight: 600;
}

.rating-stars {
  display: flex;
  align-items: center;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #007bff;
}

.original-price {
  font-size: 1.25rem;
  text-decoration: line-through;
  color: #6c757d;
}

.discount-badge {
  background-color: #dc3545;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.feature-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.review-summary {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.average-rating h2 {
  color: #007bff;
  font-weight: 700;
}

.rating-bar .progress {
  background-color: #e9ecef;
}

.review-item:last-child {
  border-bottom: none !important;
}

.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 1rem;
  }
  
  .main-image {
    height: 300px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .btn {
    width: 100%;
  }
}
</style> 