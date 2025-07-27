<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5 mb-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">Welcome to FIT5032 Web Application</h1>
            <p class="lead mb-4">A modern Vue.js application demonstrating advanced web development concepts including authentication, role-based access control, and dynamic data management.</p>
            <div class="d-flex gap-3">
              <router-link to="/products" class="btn btn-light btn-lg">Explore Products</router-link>
              <router-link to="/register" class="btn btn-outline-light btn-lg">Get Started</router-link>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="text-center">
              <div class="hero-icon">
                <i class="fas fa-code fa-6x"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section mb-5">
      <div class="container">
        <h2 class="text-center mb-5">Key Features</h2>
        <div class="row g-4">
          <div class="col-md-4" v-for="feature in features" :key="feature.id">
            <div class="card h-100 text-center">
              <div class="card-body">
                <div class="feature-icon mb-3">
                  <i :class="feature.icon" class="fa-3x text-primary"></i>
                </div>
                <h5 class="card-title">{{ feature.title }}</h5>
                <p class="card-text">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section mb-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-3" v-for="stat in statistics" :key="stat.id">
            <div class="stats-card">
              <div class="stats-number">{{ stat.value }}</div>
              <div class="stats-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Products Section -->
    <section class="recent-products mb-5">
      <div class="container">
        <h2 class="text-center mb-5">Recent Products</h2>
        <div class="row g-4">
          <div class="col-md-4" v-for="product in recentProducts" :key="product.id">
            <div class="card product-card">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text">{{ product.description }}</p>
                <div class="rating mb-3">
                  <span v-for="star in 5" :key="star" class="star" :class="star <= product.rating ? 'filled' : 'empty'">
                    ★
                  </span>
                  <span class="ms-2">({{ product.rating }}/5)</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="h5 text-primary mb-0">${{ product.price }}</span>
                  <router-link :to="`/products/${product.id}`" class="btn btn-primary">View Details</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section bg-light py-5">
      <div class="container text-center">
        <h2 class="mb-4">Ready to Get Started?</h2>
        <p class="lead mb-4">Join our community and explore the full features of our application.</p>
        <div class="d-flex justify-content-center gap-3">
          <router-link to="/register" class="btn btn-primary btn-lg">Sign Up Now</router-link>
          <router-link to="/login" class="btn btn-outline-primary btn-lg">Login</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'Home',
  setup() {
    const features = ref([
      {
        id: 1,
        title: 'Vue.js 3 Framework',
        description: 'Built with the latest Vue.js 3 framework using Composition API for modern reactive development.',
        icon: 'fas fa-code'
      },
      {
        id: 2,
        title: 'Responsive Design',
        description: 'Fully responsive design that works perfectly on all devices - desktop, tablet, and mobile.',
        icon: 'fas fa-mobile-alt'
      },
      {
        id: 3,
        title: 'Authentication System',
        description: 'Secure authentication with role-based access control supporting multiple user types.',
        icon: 'fas fa-shield-alt'
      },
      {
        id: 4,
        title: 'Dynamic Data',
        description: 'Real-time data management with local storage persistence and dynamic content updates.',
        icon: 'fas fa-database'
      },
      {
        id: 5,
        title: 'Rating System',
        description: 'Interactive rating system allowing users to rate products and view aggregated scores.',
        icon: 'fas fa-star'
      },
      {
        id: 6,
        title: 'Security Features',
        description: 'Advanced security measures including XSS protection and input validation.',
        icon: 'fas fa-lock'
      }
    ])

    const statistics = ref([
      { id: 1, value: '100+', label: 'Products' },
      { id: 2, value: '50+', label: 'Users' },
      { id: 3, value: '4.8', label: 'Average Rating' },
      { id: 4, value: '24/7', label: 'Availability' }
    ])

    const recentProducts = ref([
      {
        id: 1,
        name: 'Premium Laptop',
        description: 'High-performance laptop with latest specifications',
        price: 1299.99,
        rating: 4.5,
        image: 'https://via.placeholder.com/300x200/007bff/ffffff?text=Laptop'
      },
      {
        id: 2,
        name: 'Wireless Headphones',
        description: 'Noise-cancelling wireless headphones with premium sound',
        price: 299.99,
        rating: 4.8,
        image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Headphones'
      },
      {
        id: 3,
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health monitoring',
        price: 399.99,
        rating: 4.3,
        image: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=Smart+Watch'
      }
    ])

    onMounted(() => {
      // Load data from localStorage if available
      const savedStats = localStorage.getItem('homeStatistics')
      if (savedStats) {
        statistics.value = JSON.parse(savedStats)
      }

      const savedProducts = localStorage.getItem('recentProducts')
      if (savedProducts) {
        recentProducts.value = JSON.parse(savedProducts)
      }
    })

    return {
      features,
      statistics,
      recentProducts
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--primary-color), #0056b3);
  border-radius: 0 0 30px 30px;
}

.hero-icon {
  opacity: 0.8;
}

.feature-icon {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-card {
  background: linear-gradient(135deg, var(--primary-color), #0056b3);
  color: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
}

.stats-number {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stats-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

.cta-section {
  border-radius: 30px 30px 0 0;
}

@media (max-width: 768px) {
  .hero-section {
    text-align: center;
  }
  
  .hero-section .btn {
    margin-bottom: 1rem;
  }
  
  .stats-card {
    margin-bottom: 1rem;
  }
}
</style> 