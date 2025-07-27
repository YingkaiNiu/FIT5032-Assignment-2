<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5 mb-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">Supporting Elderly Health & Wellbeing</h1>
            <p class="lead mb-4">We are dedicated to improving the health and well-being of elderly populations through innovative technology solutions and compassionate care.</p>
            <div class="d-flex gap-3">
              <router-link to="/services" class="btn btn-light btn-lg">Our Services</router-link>
              <router-link to="/appointments" class="btn btn-outline-light btn-lg">Book Appointment</router-link>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-image text-center">
              <i class="bi bi-heart-pulse display-1 text-light opacity-75"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Services -->
    <section class="py-5">
      <div class="container">
        <div class="row mb-5">
          <div class="col-12 text-center">
            <h2 class="section-title">Our Services</h2>
            <p class="section-subtitle">Comprehensive health support for elderly communities</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <div class="service-card card h-100 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="service-icon mb-3">
                  <i class="bi bi-calendar-check text-primary display-4"></i>
                </div>
                <h5 class="card-title">Health Appointments</h5>
                <p class="card-text">Easy-to-use appointment booking system for medical consultations, health check-ups, and wellness visits.</p>
                <router-link to="/appointments" class="btn btn-outline-primary">Book Now</router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="service-card card h-100 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="service-icon mb-3">
                  <i class="bi bi-map text-success display-4"></i>
                </div>
                <h5 class="card-title">Service Locator</h5>
                <p class="card-text">Find nearby health services, clinics, and support facilities with our interactive map feature.</p>
                <router-link to="/services" class="btn btn-outline-success">Find Services</router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="service-card card h-100 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="service-icon mb-3">
                  <i class="bi bi-book text-info display-4"></i>
                </div>
                <h5 class="card-title">Health Resources</h5>
                <p class="card-text">Access comprehensive health guides, educational materials, and wellness tips tailored for elderly needs.</p>
                <router-link to="/resources" class="btn btn-outline-info">Learn More</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h2 class="section-title">About Our Mission</h2>
            <p class="lead mb-4">We are a distinguished health charity dedicated to significantly impacting the community by supporting vulnerable elderly populations through innovative technology solutions.</p>
            <p class="mb-4">Our focus is on improving the health and well-being of elderly individuals (aged 65+) with limited technical skills, providing crucial resources, support, and education through accessible technology.</p>
            <div class="row g-3">
              <div class="col-6">
                <div class="stat-item text-center">
                  <h3 class="text-primary fw-bold">500+</h3>
                  <p class="text-muted">Elderly Supported</p>
                </div>
              </div>
              <div class="col-6">
                <div class="stat-item text-center">
                  <h3 class="text-success fw-bold">50+</h3>
                  <p class="text-muted">Health Partners</p>
                </div>
              </div>
            </div>
            <router-link to="/about" class="btn btn-primary mt-3">Learn More About Us</router-link>
          </div>
          <div class="col-lg-6">
            <div class="about-image text-center">
              <i class="bi bi-people-fill display-1 text-primary opacity-75"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <div class="row mb-5">
          <div class="col-12 text-center">
            <h2 class="section-title">Why Choose Our Platform</h2>
            <p class="section-subtitle">Designed specifically for elderly users and their caregivers</p>
          </div>
        </div>
        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-phone text-primary display-5"></i>
              </div>
              <h5>Mobile Responsive</h5>
              <p class="text-muted">Optimized for all devices, ensuring easy access on smartphones and tablets.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-eye text-success display-5"></i>
              </div>
              <h5>Large Text & Clear Design</h5>
              <p class="text-muted">High contrast, large fonts, and simple navigation for better visibility.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-shield-check text-info display-5"></i>
              </div>
              <h5>Secure & Private</h5>
              <p class="text-muted">Your health information is protected with industry-standard security measures.</p>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="feature-item text-center">
              <div class="feature-icon mb-3">
                <i class="bi bi-headset text-warning display-5"></i>
              </div>
              <h5>24/7 Support</h5>
              <p class="text-muted">Round-the-clock assistance for technical support and health inquiries.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-5 bg-primary text-white">
      <div class="container text-center">
        <h2 class="mb-4">Ready to Get Started?</h2>
        <p class="lead mb-4">Join our community and access the health support you deserve.</p>
        <div class="d-flex justify-content-center gap-3">
          <router-link to="/register" class="btn btn-light btn-lg">Create Account</router-link>
          <router-link to="/contact" class="btn btn-outline-light btn-lg">Contact Us</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  setup() {
    return {}
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.section-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.service-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  border-radius: 1rem;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
}

.service-icon {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-item {
  padding: 2rem 1rem;
}

.feature-icon {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-item h3 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.about-image {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 50vh;
    text-align: center;
  }
  
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .service-card {
    margin-bottom: 2rem;
  }
  
  .feature-item {
    padding: 1rem;
  }
}
</style> 