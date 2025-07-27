<template>
  <div class="contact-page">
    <div class="container">
      <!-- Header -->
      <div class="row mb-5">
        <div class="col-12 text-center">
          <h1 class="display-4 fw-bold text-primary mb-3">Contact Us</h1>
          <p class="lead text-muted">Get in touch with our team for support, inquiries, or to learn more about our services</p>
        </div>
      </div>

      <div class="row g-5">
        <!-- Contact Information -->
        <div class="col-lg-4">
          <div class="contact-info">
            <h3 class="mb-4">Get In Touch</h3>
            
            <div class="contact-item mb-4">
              <div class="contact-icon">
                <i class="bi bi-geo-alt text-primary"></i>
              </div>
              <div class="contact-details">
                <h6>Address</h6>
                <p class="mb-0">123 Health Street<br>Community Center<br>City, State 12345</p>
              </div>
            </div>

            <div class="contact-item mb-4">
              <div class="contact-icon">
                <i class="bi bi-telephone text-primary"></i>
              </div>
              <div class="contact-details">
                <h6>Phone</h6>
                <p class="mb-0">
                  <a href="tel:+1-800-HEALTH-911" class="text-decoration-none">1-800-HEALTH-911</a><br>
                  <small class="text-muted">24/7 Emergency Support</small>
                </p>
              </div>
            </div>

            <div class="contact-item mb-4">
              <div class="contact-icon">
                <i class="bi bi-envelope text-primary"></i>
              </div>
              <div class="contact-details">
                <h6>Email</h6>
                <p class="mb-0">
                  <a href="mailto:info@elderlyhealth.org" class="text-decoration-none">info@elderlyhealth.org</a><br>
                  <small class="text-muted">General Inquiries</small>
                </p>
              </div>
            </div>

            <div class="contact-item mb-4">
              <div class="contact-icon">
                <i class="bi bi-clock text-primary"></i>
              </div>
              <div class="contact-details">
                <h6>Office Hours</h6>
                <p class="mb-0">
                  Monday - Friday: 8:00 AM - 6:00 PM<br>
                  Saturday: 9:00 AM - 2:00 PM<br>
                  Sunday: Closed
                </p>
              </div>
            </div>

            <!-- Emergency Contact -->
            <div class="emergency-contact mt-5">
              <div class="card border-danger">
                <div class="card-body text-center">
                  <i class="bi bi-exclamation-triangle text-danger display-4 mb-3"></i>
                  <h5 class="text-danger">Emergency Support</h5>
                  <p class="mb-2">For medical emergencies, call:</p>
                  <h4 class="text-danger fw-bold">911</h4>
                  <p class="small text-muted">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="col-lg-8">
          <div class="contact-form">
            <div class="card shadow">
              <div class="card-header bg-primary text-white">
                <h3 class="mb-0">
                  <i class="bi bi-envelope me-2"></i>
                  Send Us a Message
                </h3>
              </div>
              <div class="card-body p-4">
                <form @submit.prevent="submitForm" novalidate>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="firstName" class="form-label">First Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.firstName }"
                        id="firstName"
                        v-model="form.firstName"
                        required
                      />
                      <div class="invalid-feedback" v-if="errors.firstName">
                        {{ errors.firstName }}
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="lastName" class="form-label">Last Name *</label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.lastName }"
                        id="lastName"
                        v-model="form.lastName"
                        required
                      />
                      <div class="invalid-feedback" v-if="errors.lastName">
                        {{ errors.lastName }}
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="email" class="form-label">Email Address *</label>
                      <input
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        id="email"
                        v-model="form.email"
                        required
                      />
                      <div class="invalid-feedback" v-if="errors.email">
                        {{ errors.email }}
                      </div>
                    </div>
                    <div class="col-md-6 mb-3">
                      <label for="phone" class="form-label">Phone Number</label>
                      <input
                        type="tel"
                        class="form-control"
                        :class="{ 'is-invalid': errors.phone }"
                        id="phone"
                        v-model="form.phone"
                      />
                      <div class="invalid-feedback" v-if="errors.phone">
                        {{ errors.phone }}
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="subject" class="form-label">Subject *</label>
                    <select
                      class="form-select"
                      :class="{ 'is-invalid': errors.subject }"
                      id="subject"
                      v-model="form.subject"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="appointment">Appointment Booking</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="emergency">Emergency Information</option>
                      <option value="other">Other</option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.subject">
                      {{ errors.subject }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="message" class="form-label">Message *</label>
                    <textarea
                      class="form-control"
                      :class="{ 'is-invalid': errors.message }"
                      id="message"
                      v-model="form.message"
                      rows="5"
                      required
                    ></textarea>
                    <div class="invalid-feedback" v-if="errors.message">
                      {{ errors.message }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        :class="{ 'is-invalid': errors.consent }"
                        type="checkbox"
                        id="consent"
                        v-model="form.consent"
                        required
                      />
                      <label class="form-check-label" for="consent">
                        I agree to the processing of my personal data for the purpose of responding to my inquiry *
                      </label>
                      <div class="invalid-feedback" v-if="errors.consent">
                        {{ errors.consent }}
                      </div>
                    </div>
                  </div>

                  <div class="d-grid">
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg"
                      :disabled="loading"
                    >
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ loading ? 'Sending Message...' : 'Send Message' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Location Map -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="bi bi-map me-2"></i>
                Find Our Location
              </h3>
            </div>
            <div class="card-body p-0">
              <div class="map-container">
                <div class="map-placeholder">
                  <i class="bi bi-geo-alt display-1 text-muted"></i>
                  <h4 class="text-muted mt-3">Interactive Map</h4>
                  <p class="text-muted">Our service locations will be displayed here</p>
                  <div class="location-info mt-3">
                    <p><strong>Main Office:</strong> 123 Health Street, Community Center</p>
                    <p><strong>Service Centers:</strong> Multiple locations across the city</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="row mt-5">
        <div class="col-12">
          <h3 class="text-center mb-4">Frequently Asked Questions</h3>
          <div class="accordion" id="faqAccordion">
            <div class="accordion-item" v-for="(faq, index) in faqs" :key="index">
              <h2 class="accordion-header" :id="`faq${index}`">
                <button
                  class="accordion-button"
                  :class="{ collapsed: index !== 0 }"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#collapse${index}`"
                  :aria-expanded="index === 0"
                  :aria-controls="`collapse${index}`"
                >
                  {{ faq.question }}
                </button>
              </h2>
              <div
                :id="`collapse${index}`"
                class="accordion-collapse collapse"
                :class="{ show: index === 0 }"
                :aria-labelledby="`faq${index}`"
                data-bs-parent="#faqAccordion"
              >
                <div class="accordion-body">
                  {{ faq.answer }}
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
import { ref, reactive } from 'vue'

export default {
  name: 'Contact',
  setup() {
    const loading = ref(false)
    const errors = reactive({})
    
    const form = reactive({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      consent: false
    })

    const faqs = [
      {
        question: 'How do I book an appointment?',
        answer: 'You can book an appointment through our online booking system, by calling our office, or by visiting us in person. Our staff will help you find the most convenient time.'
      },
      {
        question: 'What services are available for elderly individuals?',
        answer: 'We offer comprehensive health services including primary care, mental health support, specialist consultations, dental care, and emergency services. All services are designed specifically for elderly needs.'
      },
      {
        question: 'Is there a cost for your services?',
        answer: 'Most of our services are provided free of charge to eligible elderly individuals. Some specialized services may have minimal costs, which we discuss upfront.'
      },
      {
        question: 'How can I get emergency support?',
        answer: 'For medical emergencies, call 911 immediately. For non-emergency support, call our 24/7 hotline at 1-800-HEALTH-911.'
      },
      {
        question: 'Do you provide transportation services?',
        answer: 'We offer limited transportation services for medical appointments. Please contact us in advance to arrange transportation if needed.'
      }
    ]

    const validateForm = () => {
      errors.value = {}
      
      if (!form.firstName.trim()) {
        errors.firstName = 'First name is required'
      }
      
      if (!form.lastName.trim()) {
        errors.lastName = 'Last name is required'
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!form.email) {
        errors.email = 'Email is required'
      } else if (!emailRegex.test(form.email)) {
        errors.email = 'Please enter a valid email address'
      }
      
      if (form.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(form.phone.replace(/\s/g, ''))) {
        errors.phone = 'Please enter a valid phone number'
      }
      
      if (!form.subject) {
        errors.subject = 'Please select a subject'
      }
      
      if (!form.message.trim()) {
        errors.message = 'Message is required'
      } else if (form.message.length < 10) {
        errors.message = 'Message must be at least 10 characters long'
      }
      
      if (!form.consent) {
        errors.consent = 'You must agree to the data processing terms'
      }
      
      return Object.keys(errors).length === 0
    }

    const submitForm = async () => {
      if (!validateForm()) return
      
      loading.value = true
      
      try {
        // Simulate API call (SendGrid integration would go here)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Reset form
        Object.keys(form).forEach(key => {
          if (key === 'consent') {
            form[key] = false
          } else {
            form[key] = ''
          }
        })
        
        // Show success message (in a real app, you'd use a toast notification)
        alert('Thank you for your message! We will get back to you soon.')
      } catch (error) {
        console.error('Error submitting form:', error)
        alert('There was an error sending your message. Please try again.')
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      loading,
      faqs,
      submitForm
    }
  }
}
</script>

<style scoped>
.contact-page {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 50%;
  flex-shrink: 0;
}

.contact-details h6 {
  margin-bottom: 0.5rem;
  color: #333;
}

.contact-details p {
  color: #6c757d;
  margin-bottom: 0;
}

.emergency-contact .card {
  border-radius: 1rem;
}

.map-container {
  height: 400px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder {
  text-align: center;
  color: #6c757d;
}

.location-info {
  background-color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.accordion-item {
  border: none;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.accordion-button {
  background-color: white;
  border: none;
  font-weight: 600;
}

.accordion-button:not(.collapsed) {
  background-color: #e7f1ff;
  color: #0d6efd;
}

.accordion-button:focus {
  box-shadow: none;
  border-color: rgba(0, 0, 0, 0.125);
}

@media (max-width: 768px) {
  .contact-page {
    padding: 1rem;
  }
  
  .contact-item {
    flex-direction: column;
    text-align: center;
  }
  
  .map-container {
    height: 300px;
  }
}
</style> 