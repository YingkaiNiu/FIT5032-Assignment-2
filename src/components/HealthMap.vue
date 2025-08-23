<template>
  <div class="health-map-container" role="region" aria-label="Health services map">
    <div class="map-controls mb-3">
      <div class="row">
        <div class="col-md-6">
          <div class="input-group">
            <label for="search-services" class="sr-only">Search for health services</label>
            <input 
              id="search-services"
              type="text" 
              class="form-control" 
              placeholder="Search for health services..."
              v-model="searchQuery"
              @keyup.enter="searchServices"
              aria-describedby="search-help"
            />
            <button 
              class="btn btn-primary" 
              @click="searchServices"
              @keydown.enter="searchServices"
              @keydown.space="searchServices"
              aria-label="Search for health services"
            >
              <span aria-hidden="true">🔍</span>
              <span class="sr-only">Search</span>
            </button>
          </div>
          <div id="search-help" class="form-text">
            Type the name of a health service or address to search
          </div>
        </div>
        <div class="col-md-6">
          <fieldset class="btn-group" role="group" aria-labelledby="category-legend">
            <legend id="category-legend" class="sr-only">Filter by service category</legend>
            <button 
              class="btn btn-outline-primary" 
              :class="{ active: selectedCategory === 'all' }"
              @click="filterByCategory('all')"
              @keydown.enter="filterByCategory('all')"
              @keydown.space="filterByCategory('all')"
              aria-pressed="selectedCategory === 'all'"
              aria-label="Show all health services"
            >
              All
            </button>
            <button 
              class="btn btn-outline-primary" 
              :class="{ active: selectedCategory === 'hospital' }"
              @click="filterByCategory('hospital')"
              @keydown.enter="filterByCategory('hospital')"
              @keydown.space="filterByCategory('hospital')"
              aria-pressed="selectedCategory === 'hospital'"
              aria-label="Show only hospitals"
            >
              <span aria-hidden="true">🏥</span>
              <span class="sr-only">Hospitals</span>
            </button>
            <button 
              class="btn btn-outline-primary" 
              :class="{ active: selectedCategory === 'pharmacy' }"
              @click="filterByCategory('pharmacy')"
              @keydown.enter="filterByCategory('pharmacy')"
              @keydown.space="filterByCategory('pharmacy')"
              aria-pressed="selectedCategory === 'pharmacy'"
              aria-label="Show only pharmacies"
            >
              <span aria-hidden="true">💊</span>
              <span class="sr-only">Pharmacies</span>
            </button>
            <button 
              class="btn btn-outline-primary" 
              :class="{ active: selectedCategory === 'clinic' }"
              @click="filterByCategory('clinic')"
              @keydown.enter="filterByCategory('clinic')"
              @keydown.space="filterByCategory('clinic')"
              aria-pressed="selectedCategory === 'clinic'"
              aria-label="Show only clinics"
            >
              <span aria-hidden="true">🏥</span>
              <span class="sr-only">Clinics</span>
            </button>
          </fieldset>
        </div>
      </div>
    </div>

    <div class="map-wrapper">
      <div 
        id="map" 
        style="width: 100%; height: 500px;"
        role="application"
        aria-label="Interactive map showing health services"
        tabindex="0"
        @keydown="handleMapKeyboard"
      ></div>
      <div class="map-instructions sr-only">
        Use arrow keys to navigate the map. Press Enter or Space to select a location.
      </div>
    </div>

    <!-- Service List -->
    <div class="service-list mt-3">
      <h5 id="services-heading">Nearby Health Services</h5>
      <div 
        class="row" 
        role="list" 
        aria-labelledby="services-heading"
        aria-describedby="services-description"
      >
        <div 
          v-for="service in filteredServices" 
          :key="service.id"
          class="col-md-6 col-lg-4 mb-3"
          role="listitem"
        >
          <div 
            class="card service-card" 
            @click="selectService(service)"
            @keydown.enter="selectService(service)"
            @keydown.space="selectService(service)"
            tabindex="0"
            :aria-label="`${service.name}, ${service.category}, ${service.distance}km away`"
            role="button"
          >
            <div class="card-body">
              <div class="d-flex align-items-start">
                <div class="service-icon me-3" aria-hidden="true">
                  {{ getServiceIcon(service.category) }}
                </div>
                <div class="service-info">
                  <h6 class="card-title">{{ service.name }}</h6>
                  <p class="card-text text-muted">{{ service.address }}</p>
                  <div class="service-meta">
                    <span class="badge bg-primary me-2">{{ service.category }}</span>
                    <span class="text-muted">{{ service.distance }}km away</span>
                  </div>
                  <div class="sr-only">
                    Phone: {{ service.phone }}, Rating: {{ service.rating }} out of 5
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="services-description" class="sr-only">
        {{ filteredServices.length }} health services found. Click on any service card to view it on the map.
      </div>
    </div>

    <!-- Accessibility status -->
    <div class="accessibility-status" aria-live="polite" aria-atomic="true">
      <span v-if="selectedService" class="sr-only">
        Selected: {{ selectedService.name }} at {{ selectedService.address }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Google Maps API Key
const googleMapsApiKey = 'AIzaSyAye5w6yoFt_O5FwUBaEaZDqCtQ9i5isuY'

// Map state
const mapCenter = ref({ lat: -37.8136, lng: 144.9631 }) // Melbourne, Australia
const mapZoom = ref(12)
const userLocation = ref(null)
const selectedService = ref(null)
const searchQuery = ref('')
const selectedCategory = ref('all')

// Google Maps objects
let map = null
let markers = []
let infoWindow = null
let userMarker = null

// Sample health services data
const healthServices = ref([
  {
    id: 1,
    name: 'Royal Melbourne Hospital',
    category: 'hospital',
    address: '300 Grattan St, Parkville VIC 3050',
    position: { lat: -37.7996, lng: 144.9576 },
    distance: 2.1,
    phone: '(03) 9342 7000',
    rating: 4.5
  },
  {
    id: 2,
    name: 'St Vincent\'s Hospital Melbourne',
    category: 'hospital',
    address: '41 Victoria Parade, Fitzroy VIC 3065',
    position: { lat: -37.8136, lng: 144.9631 },
    distance: 1.8,
    phone: '(03) 9231 2211',
    rating: 4.3
  },
  {
    id: 3,
    name: 'Melbourne Health Pharmacy',
    category: 'pharmacy',
    address: '300 Grattan St, Parkville VIC 3050',
    position: { lat: -37.7998, lng: 144.9578 },
    distance: 2.1,
    phone: '(03) 9342 7000',
    rating: 4.2
  },
  {
    id: 4,
    name: 'Collins Street Medical Centre',
    category: 'clinic',
    address: '123 Collins St, Melbourne VIC 3000',
    position: { lat: -37.8156, lng: 144.9631 },
    distance: 0.5,
    phone: '(03) 9650 1234',
    rating: 4.7
  },
  {
    id: 5,
    name: 'Priceline Pharmacy Bourke Street',
    category: 'pharmacy',
    address: '200 Bourke St, Melbourne VIC 3000',
    position: { lat: -37.8136, lng: 144.9631 },
    distance: 0.8,
    phone: '(03) 9650 5678',
    rating: 4.1
  }
])

// Computed properties
const filteredServices = computed(() => {
  let filtered = healthServices.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(service => service.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(service => 
      service.name.toLowerCase().includes(query) ||
      service.address.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Methods
const getServiceIcon = (category) => {
  const icons = {
    hospital: '🏥',
    pharmacy: '💊',
    clinic: '🏥'
  }
  return icons[category] || '🏥'
}

const getMarkerIcon = (category) => {
  const icons = {
    hospital: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#FF4444"/>
          <path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 32)
    },
    pharmacy: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#4CAF50"/>
          <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 32)
    },
    clinic: {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#2196F3"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(32, 32)
    }
  }
  return icons[category] || icons.hospital
}

const getInfoWindowContent = (service) => {
  return `
    <div style="padding: 10px; max-width: 200px;">
      <h6 style="margin: 0 0 5px 0;">${service.name}</h6>
      <p style="margin: 0 0 5px 0; font-size: 12px; color: #666;">${service.address}</p>
      <p style="margin: 0 0 5px 0; font-size: 12px;">📞 ${service.phone}</p>
      <p style="margin: 0; font-size: 12px;">⭐ ${service.rating}/5</p>
    </div>
  `
}

const searchServices = () => {
  // 这里可以集成 Google Places API 进行真实搜索
  console.log('Searching for:', searchQuery.value)
  
  // Announce search results to screen readers
  const statusElement = document.querySelector('.accessibility-status')
  if (statusElement) {
    statusElement.textContent = `Searching for ${searchQuery.value}`
  }
}

const filterByCategory = (category) => {
  selectedCategory.value = category
  updateMarkers()
  
  // Announce filter change to screen readers
  const statusElement = document.querySelector('.accessibility-status')
  if (statusElement) {
    const categoryName = category === 'all' ? 'all services' : category + 's'
    statusElement.textContent = `Showing ${categoryName}`
  }
}

const selectService = (service) => {
  selectedService.value = service
  if (map) {
    map.setCenter(service.position)
    map.setZoom(15)
    showServiceInfo(service)
  }
  
  // Announce selection to screen readers
  const statusElement = document.querySelector('.accessibility-status')
  if (statusElement) {
    statusElement.textContent = `Selected ${service.name} at ${service.address}`
  }
}

const showServiceInfo = (service) => {
  if (infoWindow && map) {
    infoWindow.setContent(getInfoWindowContent(service))
    infoWindow.setPosition(service.position)
    infoWindow.open(map)
  }
}

const updateMarkers = () => {
  // Clear existing markers
  markers.forEach(marker => marker.setMap(null))
  markers = []

  // Add new markers for filtered services
  filteredServices.value.forEach(service => {
    const marker = new google.maps.Marker({
      position: service.position,
      map: map,
      title: service.name,
      icon: getMarkerIcon(service.category)
    })

    marker.addListener('click', () => {
      showServiceInfo(service)
    })

    markers.push(marker)
  })
}

const handleMapKeyboard = (event) => {
  if (!map) return
  
  const panDistance = 0.01 // Adjust based on zoom level
  
  switch (event.key) {
    case 'ArrowUp':
      event.preventDefault()
      map.panBy(0, -100)
      break
    case 'ArrowDown':
      event.preventDefault()
      map.panBy(0, 100)
      break
    case 'ArrowLeft':
      event.preventDefault()
      map.panBy(-100, 0)
      break
    case 'ArrowRight':
      event.preventDefault()
      map.panBy(100, 0)
      break
    case '+':
    case '=':
      event.preventDefault()
      map.setZoom(map.getZoom() + 1)
      break
    case '-':
      event.preventDefault()
      map.setZoom(map.getZoom() - 1)
      break
  }
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        userLocation.value = pos
        
        if (map) {
          map.setCenter(pos)
          map.setZoom(14)
          
          // Add user location marker
          if (userMarker) {
            userMarker.setMap(null)
          }
          
          userMarker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Your Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(24, 24)
            }
          })
        }
        
        // Announce location to screen readers
        const statusElement = document.querySelector('.accessibility-status')
        if (statusElement) {
          statusElement.textContent = 'Your location has been detected and marked on the map'
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        
        // Announce error to screen readers
        const statusElement = document.querySelector('.accessibility-status')
        if (statusElement) {
          statusElement.textContent = 'Unable to detect your location. Please allow location access or search manually.'
        }
      }
    )
  }
}

const initMap = () => {
  // Check if Google Maps is loaded
  if (typeof google === 'undefined' || !google.maps) {
    console.error('Google Maps not loaded')
    return
  }

  // Initialize map
  map = new google.maps.Map(document.getElementById('map'), {
    center: mapCenter.value,
    zoom: mapZoom.value,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true,
    fullscreenControl: true
  })

  // Initialize info window
  infoWindow = new google.maps.InfoWindow()

  // Add markers
  updateMarkers()

  // Get user location
  getUserLocation()
  
  // Announce map loaded to screen readers
  const statusElement = document.querySelector('.accessibility-status')
  if (statusElement) {
    statusElement.textContent = 'Map loaded successfully. Use arrow keys to navigate.'
  }
}

const loadGoogleMaps = () => {
  // Check if already loaded
  if (typeof google !== 'undefined' && google.maps) {
    initMap()
    return
  }

  // Load Google Maps script
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`
  script.async = true
  script.defer = true
  script.onload = initMap
  document.head.appendChild(script)
}

// Lifecycle
onMounted(() => {
  loadGoogleMaps()
})

onUnmounted(() => {
  // Clean up markers
  if (markers.length > 0) {
    markers.forEach(marker => marker.setMap(null))
  }
  if (userMarker) {
    userMarker.setMap(null)
  }
})
</script>

<style scoped>
.health-map-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.map-wrapper {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.service-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e9ecef;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.service-card:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

.service-icon {
  font-size: 24px;
  line-height: 1;
}

.service-info {
  flex: 1;
}

.service-meta {
  margin-top: 8px;
}

.btn-group .btn {
  font-size: 12px;
  padding: 6px 12px;
  min-height: 44px;
}

.btn-group .btn.active {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}

.btn-group .btn:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Accessibility status */
.accessibility-status {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* Map instructions */
.map-instructions {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
}

/* High contrast support */
.high-contrast .service-card {
  border: 2px solid #000;
}

.high-contrast .btn-group .btn {
  border: 2px solid #000;
}

.high-contrast .btn-group .btn.active {
  background-color: #000;
  color: #fff;
}

/* Focus indicators for keyboard navigation */
#map:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Improved form accessibility */
.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* Responsive accessibility */
@media (max-width: 768px) {
  .btn-group .btn {
    min-height: 48px;
    font-size: 14px;
  }
  
  .service-card:focus {
    outline: 2px solid #007bff;
    outline-offset: 1px;
  }
}
</style>
