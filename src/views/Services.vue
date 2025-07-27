<template>
  <div class="services-page">
    <div class="container">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col-12 text-center">
          <h1 class="display-4 fw-bold text-primary mb-3">Our Health Services</h1>
          <p class="lead text-muted">Comprehensive health support designed specifically for elderly communities</p>
        </div>
      </div>

      <!-- Service Categories -->
      <div class="row g-4 mb-5">
        <div class="col-lg-4 col-md-6" v-for="category in serviceCategories" :key="category.id">
          <div class="service-category-card card h-100 shadow-sm">
            <div class="card-body text-center p-4">
              <div class="category-icon mb-3">
                <i :class="category.icon" class="display-4 text-primary"></i>
              </div>
              <h4 class="card-title">{{ category.title }}</h4>
              <p class="card-text">{{ category.description }}</p>
              <button class="btn btn-outline-primary" @click="selectedCategory = category">
                View Services
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Locator Map -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="bi bi-map me-2"></i>
                Find Health Services Near You
              </h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="search-filters mb-3">
                    <label for="serviceType" class="form-label">Service Type</label>
                    <select class="form-select" id="serviceType" v-model="selectedServiceType">
                      <option value="">All Services</option>
                      <option value="medical">Medical Care</option>
                      <option value="dental">Dental Care</option>
                      <option value="mental">Mental Health</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="specialist">Specialist Care</option>
                    </select>
                  </div>
                  <div class="search-filters mb-3">
                    <label for="distance" class="form-label">Distance</label>
                    <select class="form-select" id="distance" v-model="selectedDistance">
                      <option value="5">Within 5 km</option>
                      <option value="10">Within 10 km</option>
                      <option value="20">Within 20 km</option>
                      <option value="50">Within 50 km</option>
                    </select>
                  </div>
                  <button class="btn btn-primary w-100" @click="searchServices">
                    <i class="bi bi-search me-2"></i>
                    Search Services
                  </button>
                </div>
                <div class="col-md-8">
                  <div class="map-container">
                    <div class="map-placeholder">
                      <i class="bi bi-map display-1 text-muted"></i>
                      <p class="text-muted mt-3">Interactive map will be displayed here</p>
                      <p class="text-muted small">Showing health services within {{ selectedDistance }}km</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service List -->
      <div class="row" v-if="selectedCategory">
        <div class="col-12">
          <h2 class="mb-4">{{ selectedCategory.title }} Services</h2>
          <div class="row g-4">
            <div class="col-lg-6" v-for="service in selectedCategory.services" :key="service.id">
              <div class="service-item card h-100">
                <div class="card-body">
                  <div class="d-flex align-items-start">
                    <div class="service-icon-small me-3">
                      <i :class="service.icon" class="text-primary"></i>
                    </div>
                    <div class="flex-grow-1">
                      <h5 class="card-title">{{ service.name }}</h5>
                      <p class="card-text">{{ service.description }}</p>
                      <div class="service-details">
                        <span class="badge bg-success me-2">{{ service.duration }}</span>
                        <span class="badge bg-info me-2">{{ service.cost }}</span>
                        <span v-if="service.available" class="badge bg-primary">Available</span>
                        <span v-else class="badge bg-secondary">Unavailable</span>
                      </div>
                      <div class="mt-3">
                        <button class="btn btn-sm btn-outline-primary me-2" @click="bookService(service)">
                          Book Appointment
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" @click="viewServiceDetails(service)">
                          Learn More
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

      <!-- Emergency Services -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="card border-danger">
            <div class="card-header bg-danger text-white">
              <h3 class="mb-0">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Emergency Services
              </h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <h5>24/7 Emergency Hotline</h5>
                  <p class="text-danger fw-bold fs-4">1-800-HEALTH-911</p>
                  <p>Available 24 hours a day for medical emergencies</p>
                </div>
                <div class="col-md-6">
                  <h5>Emergency Services</h5>
                  <ul class="list-unstyled">
                    <li><i class="bi bi-telephone text-danger me-2"></i>Ambulance: 911</li>
                    <li><i class="bi bi-heart-pulse text-danger me-2"></i>Urgent Care Centers</li>
                    <li><i class="bi bi-hospital text-danger me-2"></i>Emergency Rooms</li>
                  </ul>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Services',
  setup() {
    const router = useRouter()
    const selectedCategory = ref(null)
    const selectedServiceType = ref('')
    const selectedDistance = ref('10')

    const serviceCategories = ref([
      {
        id: 1,
        title: 'Primary Care',
        description: 'Comprehensive health care for elderly patients including regular check-ups and preventive care.',
        icon: 'bi bi-heart-pulse',
        services: [
          {
            id: 1,
            name: 'Annual Health Check-up',
            description: 'Comprehensive health assessment including blood pressure, cholesterol, and diabetes screening.',
            duration: '60 min',
            cost: 'Free',
            available: true,
            icon: 'bi bi-clipboard-pulse'
          },
          {
            id: 2,
            name: 'Vaccination Services',
            description: 'Seasonal flu shots, pneumonia vaccines, and other essential vaccinations.',
            duration: '30 min',
            cost: 'Free',
            available: true,
            icon: 'bi bi-droplet'
          },
          {
            id: 3,
            name: 'Chronic Disease Management',
            description: 'Ongoing care for diabetes, hypertension, arthritis, and other chronic conditions.',
            duration: '45 min',
            cost: 'Free',
            available: true,
            icon: 'bi bi-graph-up'
          }
        ]
      },
      {
        id: 2,
        title: 'Mental Health',
        description: 'Specialized mental health support including counseling and therapy services.',
        icon: 'bi bi-brain',
        services: [
          {
            id: 4,
            name: 'Individual Counseling',
            description: 'One-on-one therapy sessions for depression, anxiety, and other mental health concerns.',
            duration: '50 min',
            cost: 'Free',
            available: true,
            icon: 'bi bi-person-heart'
          },
          {
            id: 5,
            name: 'Group Therapy',
            description: 'Support groups for grief, loneliness, and social isolation.',
            duration: '90 min',
            cost: 'Free',
            available: true,
            icon: 'bi bi-people'
          },
          {
            id: 6,
            name: 'Memory Care Support',
            description: 'Specialized support for individuals with memory issues and their caregivers.',
            duration: '60 min',
            cost: 'Free',
            available: true,
            icon: 'bi bi-lightbulb'
          }
        ]
      },
      {
        id: 3,
        title: 'Specialist Care',
        description: 'Specialized medical services for specific health conditions and needs.',
        icon: 'bi bi-stethoscope',
        services: [
          {
            id: 7,
            name: 'Cardiology Consultation',
            description: 'Heart health assessment and management of cardiovascular conditions.',
            duration: '45 min',
            cost: 'Free',
            available: true,
            icon: 'bi bi-heart'
          },
          {
            id: 8,
            name: 'Dental Care',
            description: 'Comprehensive dental services including cleaning, fillings, and denture care.',
            duration: '60 min',
            cost: 'Free',
            available: true,
            icon: 'bi bi-tooth'
          },
          {
            id: 9,
            name: 'Physical Therapy',
            description: 'Rehabilitation services for mobility issues and post-surgery recovery.',
            duration: '45 min',
            cost: 'Free',
            available: true,
            icon: 'bi bi-activity'
          }
        ]
      }
    ])

    const searchServices = () => {
      console.log('Searching for services:', {
        type: selectedServiceType.value,
        distance: selectedDistance.value
      })
    }

    const bookService = (service) => {
      router.push(`/appointments?service=${service.id}`)
    }

    const viewServiceDetails = (service) => {
      console.log('Viewing service details:', service)
    }

    return {
      selectedCategory,
      selectedServiceType,
      selectedDistance,
      serviceCategories,
      searchServices,
      bookService,
      viewServiceDetails
    }
  }
}
</script>

<style scoped>
.services-page {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.service-category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  border-radius: 1rem;
}

.service-category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.category-icon {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-item {
  transition: transform 0.2s ease;
  border: none;
  border-radius: 0.5rem;
}

.service-item:hover {
  transform: translateY(-2px);
}

.service-icon-small {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 50%;
}

.map-container {
  height: 400px;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder {
  text-align: center;
  color: #6c757d;
}

.search-filters {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .services-page {
    padding: 1rem;
  }
  
  .service-category-card {
    margin-bottom: 2rem;
  }
  
  .map-container {
    height: 300px;
    margin-top: 1rem;
  }
}
</style> 