<template>
  <div class="resources-page">
    <div class="container">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col-12 text-center">
          <h1 class="display-4 fw-bold text-primary mb-3">Health Resources</h1>
          <p class="lead text-muted">Comprehensive health guides, educational materials, and wellness tips tailored for elderly needs</p>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search resources..."
                      v-model="searchQuery"
                      @input="filterResources"
                    />
                    <button class="btn btn-outline-secondary" type="button">
                      <i class="bi bi-search"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-3">
                  <select class="form-select" v-model="selectedCategory" @change="filterResources">
                    <option value="">All Categories</option>
                    <option value="health-guides">Health Guides</option>
                    <option value="wellness-tips">Wellness Tips</option>
                    <option value="medication">Medication</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="exercise">Exercise</option>
                    <option value="mental-health">Mental Health</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <select class="form-select" v-model="selectedFormat" @change="filterResources">
                    <option value="">All Formats</option>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                    <option value="infographic">Infographic</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Resources -->
      <div class="row mb-5">
        <div class="col-12">
          <h2 class="section-title mb-4">Featured Resources</h2>
          <div class="row g-4">
            <div class="col-lg-4 col-md-6" v-for="resource in featuredResources" :key="resource.id">
              <div class="resource-card card h-100 shadow-sm">
                <div class="resource-image">
                  <img :src="resource.image" :alt="resource.title" class="card-img-top" />
                  <div class="resource-badge">
                    <span :class="getFormatBadgeClass(resource.format)" class="badge">
                      {{ resource.format.toUpperCase() }}
                    </span>
                  </div>
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ resource.title }}</h5>
                  <p class="card-text">{{ resource.description }}</p>
                  <div class="resource-meta mb-3">
                    <span class="badge bg-primary me-2">{{ resource.category }}</span>
                    <small class="text-muted">{{ resource.duration }}</small>
                  </div>
                  <div class="mt-auto">
                    <button class="btn btn-primary w-100" @click="viewResource(resource)">
                      <i class="bi bi-eye me-2"></i>View Resource
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- All Resources -->
      <div class="row mb-5">
        <div class="col-12">
          <h2 class="section-title mb-4">All Resources</h2>
          <div class="row g-4">
            <div class="col-lg-6" v-for="resource in filteredResources" :key="resource.id">
              <div class="resource-item card">
                <div class="card-body">
                  <div class="d-flex">
                    <div class="resource-icon me-3">
                      <i :class="getResourceIcon(resource.format)" class="text-primary"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h6 class="card-title">{{ resource.title }}</h6>
                      <p class="card-text text-muted small">{{ resource.description }}</p>
                      <div class="resource-tags">
                        <span class="badge bg-light text-dark me-2">{{ resource.category }}</span>
                        <span class="badge bg-secondary me-2">{{ resource.format }}</span>
                        <span class="badge bg-info">{{ resource.duration }}</span>
                      </div>
                      <div class="mt-2">
                        <button class="btn btn-sm btn-outline-primary me-2" @click="viewResource(resource)">
                          View
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" @click="downloadResource(resource)">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Health Tips Section -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card bg-light">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">
                <i class="bi bi-lightbulb text-warning me-2"></i>
                Daily Health Tips
              </h3>
              <div class="row g-4">
                <div class="col-md-6 col-lg-3" v-for="tip in healthTips" :key="tip.id">
                  <div class="tip-card text-center">
                    <div class="tip-icon mb-3">
                      <i :class="tip.icon" class="text-primary display-6"></i>
                    </div>
                    <h6>{{ tip.title }}</h6>
                    <p class="text-muted small">{{ tip.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Emergency Information -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card border-danger">
            <div class="card-header bg-danger text-white">
              <h3 class="mb-0">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Emergency Health Information
              </h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h5>Emergency Contacts</h5>
                  <ul class="list-unstyled">
                    <li class="mb-2">
                      <strong>Medical Emergency:</strong> 911
                    </li>
                    <li class="mb-2">
                      <strong>Poison Control:</strong> 1-800-222-1222
                    </li>
                    <li class="mb-2">
                      <strong>Mental Health Crisis:</strong> 988
                    </li>
                    <li class="mb-2">
                      <strong>Our Support Line:</strong> 1-800-HEALTH-911
                    </li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <h5>Important Documents</h5>
                  <ul class="list-unstyled">
                    <li class="mb-2">
                      <a href="#" class="text-decoration-none">
                        <i class="bi bi-file-pdf text-danger me-2"></i>
                        Emergency Contact Form
                      </a>
                    </li>
                    <li class="mb-2">
                      <a href="#" class="text-decoration-none">
                        <i class="bi bi-file-pdf text-danger me-2"></i>
                        Medication List Template
                      </a>
                    </li>
                    <li class="mb-2">
                      <a href="#" class="text-decoration-none">
                        <i class="bi bi-file-pdf text-danger me-2"></i>
                        Health History Form
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter Signup -->
      <div class="row">
        <div class="col-12">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <h3 class="mb-3">Stay Updated with Health Tips</h3>
              <p class="mb-4">Subscribe to our newsletter for the latest health information and wellness tips</p>
              <div class="row justify-content-center">
                <div class="col-md-6">
                  <div class="input-group">
                    <input
                      type="email"
                      class="form-control"
                      placeholder="Enter your email address"
                      v-model="newsletterEmail"
                    />
                    <button class="btn btn-light" type="button" @click="subscribeNewsletter">
                      Subscribe
                    </button>
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
import { ref, computed } from 'vue'

export default {
  name: 'Resources',
  setup() {
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedFormat = ref('')
    const newsletterEmail = ref('')

    const featuredResources = ref([
      {
        id: 1,
        title: 'Complete Health Guide for Seniors',
        description: 'Comprehensive guide covering all aspects of senior health including nutrition, exercise, and preventive care.',
        category: 'Health Guides',
        format: 'pdf',
        duration: '45 min read',
        image: 'https://via.placeholder.com/400x250/007bff/ffffff?text=Health+Guide'
      },
      {
        id: 2,
        title: 'Exercise Routines for Elderly',
        description: 'Safe and effective exercise routines designed specifically for elderly individuals.',
        category: 'Exercise',
        format: 'video',
        duration: '20 min',
        image: 'https://via.placeholder.com/400x250/28a745/ffffff?text=Exercise+Video'
      },
      {
        id: 3,
        title: 'Medication Management Tips',
        description: 'Essential tips for managing medications safely and effectively.',
        category: 'Medication',
        format: 'infographic',
        duration: '5 min read',
        image: 'https://via.placeholder.com/400x250/dc3545/ffffff?text=Medication+Tips'
      }
    ])

    const allResources = ref([
      {
        id: 4,
        title: 'Nutrition Guide for Healthy Aging',
        description: 'Dietary recommendations and meal planning for optimal health in older adults.',
        category: 'Nutrition',
        format: 'pdf',
        duration: '30 min read'
      },
      {
        id: 5,
        title: 'Mental Health and Wellness',
        description: 'Strategies for maintaining mental health and emotional well-being.',
        category: 'Mental Health',
        format: 'article',
        duration: '15 min read'
      },
      {
        id: 6,
        title: 'Fall Prevention Guide',
        description: 'Comprehensive guide to preventing falls and maintaining balance.',
        category: 'Health Guides',
        format: 'pdf',
        duration: '25 min read'
      },
      {
        id: 7,
        title: 'Sleep Hygiene for Seniors',
        description: 'Tips for improving sleep quality and establishing healthy sleep patterns.',
        category: 'Wellness Tips',
        format: 'article',
        duration: '10 min read'
      },
      {
        id: 8,
        title: 'Social Connection Activities',
        description: 'Ideas and activities to maintain social connections and combat loneliness.',
        category: 'Mental Health',
        format: 'video',
        duration: '15 min'
      },
      {
        id: 9,
        title: 'Chronic Disease Management',
        description: 'Managing common chronic conditions like diabetes, hypertension, and arthritis.',
        category: 'Health Guides',
        format: 'pdf',
        duration: '40 min read'
      }
    ])

    const healthTips = ref([
      {
        id: 1,
        title: 'Stay Hydrated',
        description: 'Drink 8 glasses of water daily to maintain good health.',
        icon: 'bi bi-droplet'
      },
      {
        id: 2,
        title: 'Regular Exercise',
        description: '30 minutes of moderate activity most days of the week.',
        icon: 'bi bi-activity'
      },
      {
        id: 3,
        title: 'Healthy Diet',
        description: 'Eat a balanced diet rich in fruits, vegetables, and whole grains.',
        icon: 'bi bi-apple'
      },
      {
        id: 4,
        title: 'Quality Sleep',
        description: 'Aim for 7-9 hours of sleep each night for optimal health.',
        icon: 'bi bi-moon'
      }
    ])

    const filteredResources = computed(() => {
      let filtered = allResources.value

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(resource =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query)
        )
      }

      if (selectedCategory.value) {
        filtered = filtered.filter(resource =>
          resource.category.toLowerCase().replace(' ', '-') === selectedCategory.value
        )
      }

      if (selectedFormat.value) {
        filtered = filtered.filter(resource =>
          resource.format === selectedFormat.value
        )
      }

      return filtered
    })

    const getFormatBadgeClass = (format) => {
      const classes = {
        pdf: 'bg-danger',
        video: 'bg-primary',
        article: 'bg-success',
        infographic: 'bg-warning'
      }
      return classes[format] || 'bg-secondary'
    }

    const getResourceIcon = (format) => {
      const icons = {
        pdf: 'bi bi-file-pdf',
        video: 'bi bi-play-circle',
        article: 'bi bi-file-text',
        infographic: 'bi bi-image'
      }
      return icons[format] || 'bi bi-file'
    }

    const filterResources = () => {
      // Filtering is handled by computed property
    }

    const viewResource = (resource) => {
      console.log('Viewing resource:', resource)
      // In a real app, this would open the resource
    }

    const downloadResource = (resource) => {
      console.log('Downloading resource:', resource)
      // In a real app, this would trigger a download
    }

    const subscribeNewsletter = () => {
      if (newsletterEmail.value) {
        console.log('Subscribing to newsletter:', newsletterEmail.value)
        alert('Thank you for subscribing to our newsletter!')
        newsletterEmail.value = ''
      } else {
        alert('Please enter a valid email address.')
      }
    }

    return {
      searchQuery,
      selectedCategory,
      selectedFormat,
      newsletterEmail,
      featuredResources,
      filteredResources,
      healthTips,
      getFormatBadgeClass,
      getResourceIcon,
      filterResources,
      viewResource,
      downloadResource,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
.resources-page {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.section-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 1rem;
}

.resource-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  border-radius: 1rem;
  overflow: hidden;
}

.resource-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.resource-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.resource-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resource-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.resource-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.resource-item {
  transition: transform 0.2s ease;
  border: none;
  border-radius: 0.5rem;
}

.resource-item:hover {
  transform: translateY(-2px);
}

.resource-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 50%;
  flex-shrink: 0;
}

.resource-tags {
  margin-bottom: 1rem;
}

.tip-card {
  padding: 1rem;
}

.tip-icon {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .resources-page {
    padding: 1rem;
  }
  
  .resource-card {
    margin-bottom: 2rem;
  }
  
  .resource-item {
    margin-bottom: 1rem;
  }
}
</style> 