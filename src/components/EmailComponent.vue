<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Send Email with Attachment</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="sendEmail">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="fromName" class="form-label">Your Name</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="fromName" 
                      v-model="emailData.fromName"
                      required
                    />
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="fromEmail" class="form-label">Your Email</label>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="fromEmail" 
                      v-model="emailData.fromEmail"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div class="mb-3">
                <label for="toEmail" class="form-label">To Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="toEmail" 
                  v-model="emailData.toEmail"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="subject" class="form-label">Subject</label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="subject" 
                  v-model="emailData.subject"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <textarea 
                  class="form-control" 
                  id="message" 
                  rows="5" 
                  v-model="emailData.message"
                  required
                ></textarea>
              </div>
              
              <div class="mb-3">
                <label for="attachment" class="form-label">Attachment (Optional)</label>
                <input 
                  type="file" 
                  class="form-control" 
                  id="attachment" 
                  @change="handleFileUpload"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                />
                <div class="form-text">Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)</div>
              </div>
              
              <div v-if="attachmentName" class="mb-3">
                <label class="form-label">Selected Attachment:</label>
                <div class="d-flex align-items-center p-2 border rounded bg-light">
                  <span class="me-2">📎</span>
                  <span class="me-auto">{{ attachmentName }}</span>
                  <button type="button" class="btn btn-sm btn-outline-danger" @click="removeAttachment">
                    ✕ Remove
                  </button>
                </div>
              </div>
              
              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isLoading ? 'Sending...' : 'Send Email' }}
                </button>
              </div>
            </form>
            
            <div v-if="success" class="alert alert-success mt-3">
              ✅ {{ success }}
            </div>
            
            <div v-if="error" class="alert alert-danger mt-3">
              ⚠️ {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

const emailData = ref({
  fromName: '',
  fromEmail: '',
  toEmail: '',
  subject: '',
  message: ''
})

const attachment = ref(null)
const attachmentName = ref('')
const isLoading = ref(false)
const success = ref('')
const error = ref('')

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      error.value = 'File size must be less than 10MB'
      event.target.value = ''
      return
    }
    attachment.value = file
    attachmentName.value = file.name
    error.value = ''
    success.value = ''
  }
}

const removeAttachment = () => {
  attachment.value = null
  attachmentName.value = ''
  const fileInput = document.getElementById('attachment')
  if (fileInput) {
    fileInput.value = ''
  }
}

const sendEmail = async () => {
  isLoading.value = true
  success.value = ''
  error.value = ''
  
  try {
    // Initialize EmailJS with your public key
    emailjs.init('Km2ke5da8jX_fN9Bu')
    
    // Prepare template parameters
    const templateParams = {
      from_name: emailData.value.fromName,
      from_email: emailData.value.fromEmail,
      to_email: emailData.value.toEmail,
      subject: emailData.value.subject,
      message: emailData.value.message
    }
    
    // Send email using EmailJS
    const response = await emailjs.send(
      'service_o0yplm6', // Your EmailJS Service ID
      'template_h33dq1e', // Your EmailJS Template ID
      templateParams,
      'Km2ke5da8jX_fN9Bu' // Your public key
    )
    
    console.log('Email sent successfully:', response)
    success.value = 'Email sent successfully! Check your inbox.'
    
    // Reset form
    emailData.value = {
      fromName: '',
      fromEmail: '',
      toEmail: '',
      subject: '',
      message: ''
    }
    attachment.value = null
    attachmentName.value = ''
    
    // Clear file input
    const fileInput = document.getElementById('attachment')
    if (fileInput) {
      fileInput.value = ''
    }
    
  } catch (err) {
    console.error('Email sending failed:', err)
    error.value = `Failed to send email: ${err.text || err.message || 'Please try again.'}`
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}
</style>
