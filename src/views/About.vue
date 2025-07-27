<template>
  <div class="about-page">
    <div class="container">
      <!-- Hero Section -->
      <section class="hero-section bg-primary text-white py-5 mb-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <h1 class="display-4 fw-bold mb-4">About Our Mission</h1>
              <p class="lead mb-4">We are a distinguished health charity dedicated to significantly impacting the community by supporting vulnerable elderly populations through innovative technology solutions.</p>
            </div>
            <div class="col-lg-4 text-center">
              <i class="bi bi-heart-pulse display-1 text-light opacity-75"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission & Vision -->
      <section class="py-5">
        <div class="row g-5">
          <div class="col-lg-6">
            <div class="mission-card card h-100 shadow">
              <div class="card-body p-4">
                <div class="text-center mb-4">
                  <i class="bi bi-bullseye display-4 text-primary"></i>
                </div>
                <h3 class="card-title text-center mb-4">Our Mission</h3>
                <p class="card-text">To improve the health and well-being of elderly individuals (aged 65+) with limited technical skills by providing crucial resources, support, and education through accessible technology solutions.</p>
                <ul class="list-unstyled">
                  <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Provide accessible health services</li>
                  <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Support vulnerable elderly populations</li>
                  <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Leverage technology for community impact</li>
                  <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Ensure equitable access to healthcare</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="vision-card card h-100 shadow">
              <div class="card-body p-4">
                <div class="text-center mb-4">
                  <i class="bi bi-eye display-4 text-info"></i>
                </div>
                <h3 class="card-title text-center mb-4">Our Vision</h3>
                <p class="card-text">To create a world where every elderly individual has access to quality healthcare and support services, regardless of their technical abilities or socioeconomic status.</p>
                <ul class="list-unstyled">
                  <li class="mb-2"><i class="bi bi-star text-warning me-2"></i>Universal access to health services</li>
                  <li class="mb-2"><i class="bi bi-star text-warning me-2"></i>Technology-enabled care solutions</li>
                  <li class="mb-2"><i class="bi bi-star text-warning me-2"></i>Community-driven health initiatives</li>
                  <li class="mb-2"><i class="bi bi-star text-warning me-2"></i>Sustainable healthcare models</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Our Story -->
      <section class="py-5 bg-light">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h2 class="section-title mb-4">Our Story</h2>
              <p class="lead mb-4">Founded in 2020, our organization emerged from a deep understanding of the challenges faced by elderly populations in accessing modern healthcare services.</p>
              <p class="mb-4">We recognized that many elderly individuals struggle with technology barriers, limited mobility, and complex healthcare systems. Our founders, healthcare professionals and technology experts, came together with a shared vision: to bridge the gap between traditional healthcare and modern technology.</p>
              <p class="mb-4">Today, we serve over 500 elderly individuals and partner with 50+ healthcare providers to deliver comprehensive, accessible health services to our community.</p>
            </div>
            <div class="col-lg-6">
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-marker bg-primary"></div>
                  <div class="timeline-content">
                    <h5>2020 - Foundation</h5>
                    <p>Organization founded with focus on elderly health support</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker bg-success"></div>
                  <div class="timeline-content">
                    <h5>2021 - First 100 Patients</h5>
                    <p>Reached our first milestone of serving 100 elderly patients</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker bg-info"></div>
                  <div class="timeline-content">
                    <h5>2022 - Technology Platform</h5>
                    <p>Launched our digital health platform for easy access</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-marker bg-warning"></div>
                  <div class="timeline-content">
                    <h5>2023 - Community Expansion</h5>
                    <p>Expanded services to reach 500+ elderly individuals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values -->
      <section class="py-5">
        <div class="container">
          <div class="row mb-5">
            <div class="col-12 text-center">
              <h2 class="section-title">Our Values</h2>
              <p class="section-subtitle">The principles that guide everything we do</p>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-lg-3 col-md-6" v-for="value in values" :key="value.id">
              <div class="value-card text-center">
                <div class="value-icon mb-3">
                  <i :class="value.icon" class="display-4 text-primary"></i>
                </div>
                <h5>{{ value.title }}</h5>
                <p class="text-muted">{{ value.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Team -->
      <section class="py-5 bg-light">
        <div class="container">
          <div class="row mb-5">
            <div class="col-12 text-center">
              <h2 class="section-title">Our Leadership Team</h2>
              <p class="section-subtitle">Dedicated professionals committed to elderly health</p>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-lg-4 col-md-6" v-for="member in team" :key="member.id">
              <div class="team-card card text-center">
                <div class="card-body p-4">
                  <div class="team-avatar mb-3">
                    <i class="bi bi-person-circle display-4 text-primary"></i>
                  </div>
                  <h5 class="card-title">{{ member.name }}</h5>
                  <p class="text-primary mb-2">{{ member.position }}</p>
                  <p class="card-text text-muted">{{ member.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Impact -->
      <section class="py-5">
        <div class="container">
          <div class="row mb-5">
            <div class="col-12 text-center">
              <h2 class="section-title">Our Impact</h2>
              <p class="section-subtitle">Making a difference in elderly healthcare</p>
            </div>
          </div>
          <div class="row g-4">
            <div class="col-lg-3 col-md-6" v-for="stat in impactStats" :key="stat.id">
              <div class="impact-card text-center">
                <div class="impact-number mb-2">
                  <h2 class="text-primary fw-bold">{{ stat.value }}</h2>
                </div>
                <h6>{{ stat.label }}</h6>
                <p class="text-muted small">{{ stat.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="py-5 bg-primary text-white">
        <div class="container text-center">
          <h2 class="mb-4">Join Our Mission</h2>
          <p class="lead mb-4">Help us continue supporting elderly health and well-being in our community.</p>
          <div class="d-flex justify-content-center gap-3">
            <router-link to="/contact" class="btn btn-light btn-lg">Get Involved</router-link>
            <router-link to="/services" class="btn btn-outline-light btn-lg">Our Services</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  setup() {
    const values = [
      {
        id: 1,
        title: 'Compassion',
        description: 'We approach every individual with empathy, understanding, and genuine care for their well-being.',
        icon: 'bi bi-heart'
      },
      {
        id: 2,
        title: 'Accessibility',
        description: 'We ensure our services are available to all elderly individuals, regardless of their technical abilities.',
        icon: 'bi bi-universal-access'
      },
      {
        id: 3,
        title: 'Innovation',
        description: 'We continuously seek new ways to improve healthcare delivery through technology and best practices.',
        icon: 'bi bi-lightbulb'
      },
      {
        id: 4,
        title: 'Community',
        description: 'We believe in the power of community support and collaboration to achieve better health outcomes.',
        icon: 'bi bi-people'
      }
    ]

    const team = [
      {
        id: 1,
        name: 'Dr. Sarah Johnson',
        position: 'Executive Director',
        description: 'Healthcare professional with 20+ years experience in geriatric care and community health initiatives.'
      },
      {
        id: 2,
        name: 'Michael Chen',
        position: 'Technology Director',
        description: 'Technology expert focused on creating accessible digital solutions for elderly populations.'
      },
      {
        id: 3,
        name: 'Dr. Maria Rodriguez',
        position: 'Medical Director',
        description: 'Board-certified geriatrician committed to improving healthcare access for vulnerable populations.'
      }
    ]

    const impactStats = [
      {
        id: 1,
        value: '500+',
        label: 'Elderly Supported',
        description: 'Individuals receiving our services'
      },
      {
        id: 2,
        value: '50+',
        label: 'Health Partners',
        description: 'Healthcare providers collaborating with us'
      },
      {
        id: 3,
        value: '95%',
        label: 'Satisfaction Rate',
        description: 'Patient satisfaction with our services'
      },
      {
        id: 4,
        value: '24/7',
        label: 'Support Available',
        description: 'Round-the-clock assistance and care'
      }
    ]

    return {
      values,
      team,
      impactStats
    }
  }
}
</script>

<style scoped>
.about-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
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

.mission-card,
.vision-card {
  border: none;
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

.mission-card:hover,
.vision-card:hover {
  transform: translateY(-5px);
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #dee2e6;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -1.5rem;
  top: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 3px solid white;
}

.timeline-content {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.value-card {
  padding: 2rem 1rem;
}

.value-icon {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-card {
  border: none;
  border-radius: 1rem;
  transition: transform 0.3s ease;
}

.team-card:hover {
  transform: translateY(-5px);
}

.team-avatar {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.impact-card {
  padding: 2rem 1rem;
}

.impact-number h2 {
  font-size: 3rem;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .about-page {
    padding: 1rem;
  }
  
  .timeline {
    padding-left: 1rem;
  }
  
  .timeline::before {
    left: 0.5rem;
  }
  
  .timeline-marker {
    left: -0.75rem;
  }
  
  .impact-number h2 {
    font-size: 2rem;
  }
}
</style> 