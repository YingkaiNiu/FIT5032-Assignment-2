<template>
  <div class="email-container" role="region" aria-labelledby="email-heading">
    <h2 id="email-heading" class="text-center mb-4">Send Email with Attachment</h2>
    
    <form @submit.prevent="sendEmail" class="email-form" role="form" aria-describedby="form-instructions">
      <div id="form-instructions" class="sr-only">
        Fill out the form below to send an email with attachment. All fields marked with asterisk are required.
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="to-email" class="form-label">
            To Email <span class="text-danger" aria-label="required">*</span>
          </label>
          <input
            id="to-email"
            type="email"
            class="form-control"
            v-model="toEmail"
            required
            aria-describedby="to-email-help"
            :aria-invalid="toEmailError ? 'true' : 'false'"
            :aria-describedby="toEmailError ? 'to-email-error' : 'to-email-help'"
          />
          <div id="to-email-help" class="form-text">
            Enter the recipient's email address
          </div>
          <div v-if="toEmailError" id="to-email-error" class="text-danger" role="alert">
            {{ toEmailError }}
          </div>
        </div>

        <div class="col-md-6 mb-3">
          <label for="from-name" class="form-label">
            From Name <span class="text-danger" aria-label="required">*</span>
          </label>
          <input
            id="from-name"
            type="text"
            class="form-control"
            v-model="fromName"
            required
            aria-describedby="from-name-help"
            :aria-invalid="fromNameError ? 'true' : 'false'"
            :aria-describedby="fromNameError ? 'from-name-error' : 'from-name-help'"
          />
          <div id="from-name-help" class="form-text">
            Enter your name as it will appear to the recipient
          </div>
          <div v-if="fromNameError" id="from-name-error" class="text-danger" role="alert">
            {{ fromNameError }}
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label for="subject" class="form-label">
          Subject <span class="text-danger" aria-label="required">*</span>
        </label>
        <input
          id="subject"
          type="text"
          class="form-control"
          v-model="subject"
          required
          aria-describedby="subject-help"
          :aria-invalid="subjectError ? 'true' : 'false'"
          :aria-describedby="subjectError ? 'subject-error' : 'subject-help'"
        />
        <div id="subject-help" class="form-text">
          Enter a brief subject for your email
        </div>
        <div v-if="subjectError" id="subject-error" class="text-danger" role="alert">
          {{ subjectError }}
        </div>
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">
          Message <span class="text-danger" aria-label="required">*</span>
        </label>
        <textarea
          id="message"
          class="form-control"
          rows="5"
          v-model="message"
          required
          aria-describedby="message-help"
          :aria-invalid="messageError ? 'true' : 'false'"
          :aria-describedby="messageError ? 'message-error' : 'message-help'"
        ></textarea>
        <div id="message-help" class="form-text">
          Enter your email message here
        </div>
        <div v-if="messageError" id="message-error" class="text-danger" role="alert">
          {{ messageError }}
        </div>
      </div>

      <div class="mb-3">
        <label for="file-input" class="form-label">
          Attachment <span class="text-muted">(Optional)</span>
        </label>
        <input
          id="file-input"
          type="file"
          class="form-control"
          @change="handleFileUpload"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          aria-describedby="file-help"
        />
        <div id="file-help" class="form-text">
          Select a file to attach (PDF, Word, Text, or Image files up to 10MB)
        </div>
        <div v-if="fileError" class="text-danger" role="alert">
          {{ fileError }}
        </div>
      </div>

      <!-- Attachment Preview -->
      <div v-if="attachment" class="mb-3">
        <div class="attachment-preview" role="region" aria-label="Attachment preview">
          <div class="d-flex align-items-center">
            <span class="attachment-icon me-2" aria-hidden="true">📎</span>
            <span class="attachment-name">{{ attachmentName }}</span>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger ms-2"
              @click="removeAttachment"
              @keydown.enter="removeAttachment"
              @keydown.space="removeAttachment"
              aria-label="Remove attachment"
            >
              <span aria-hidden="true">✕</span>
              <span class="sr-only">Remove</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Status Messages -->
      <div v-if="statusMessage" class="alert" :class="statusClass" role="alert" aria-live="polite">
        <span v-if="statusType === 'success'" class="me-2" aria-hidden="true">✅</span>
        <span v-else-if="statusType === 'error'" class="me-2" aria-hidden="true">⚠️</span>
        {{ statusMessage }}
      </div>

      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          type="button"
          class="btn btn-secondary me-md-2"
          @click="resetForm"
          @keydown.enter="resetForm"
          @keydown.space="resetForm"
          aria-label="Clear all form fields"
        >
          Clear Form
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading"
          :aria-describedby="isLoading ? 'loading-status' : undefined"
        >
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <span v-if="isLoading" id="loading-status" class="sr-only">Sending email...</span>
          {{ isLoading ? 'Sending...' : 'Send Email' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import emailjs from '@emailjs/browser'

// Form data
const toEmail = ref('')
const fromName = ref('')
const subject = ref('')
const message = ref('')
const attachment = ref(null)
const attachmentName = ref('')

// Error states
const toEmailError = ref('')
const fromNameError = ref('')
const subjectError = ref('')
const messageError = ref('')
const fileError = ref('')

// Status
const isLoading = ref(false)
const statusMessage = ref('')
const statusType = ref('')

// Computed properties
const statusClass = computed(() => {
  switch (statusType.value) {
    case 'success':
      return 'alert-success'
    case 'error':
      return 'alert-danger'
    default:
      return ''
  }
})

// Methods
const validateForm = () => {
  let isValid = true
  
  // Clear previous errors
  toEmailError.value = ''
  fromNameError.value = ''
  subjectError.value = ''
  messageError.value = ''
  
  // Validate email
  if (!toEmail.value) {
    toEmailError.value = 'Email address is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail.value)) {
    toEmailError.value = 'Please enter a valid email address'
    isValid = false
  }
  
  // Validate name
  if (!fromName.value.trim()) {
    fromNameError.value = 'Name is required'
    isValid = false
  }
  
  // Validate subject
  if (!subject.value.trim()) {
    subjectError.value = 'Subject is required'
    isValid = false
  }
  
  // Validate message
  if (!message.value.trim()) {
    messageError.value = 'Message is required'
    isValid = false
  }
  
  return isValid
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  fileError.value = ''
  
  if (file) {
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      fileError.value = 'File size must be less than 10MB'
      event.target.value = ''
      return
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      fileError.value = 'Please select a valid file type (PDF, Word, Text, or Image)'
      event.target.value = ''
      return
    }
    
    attachment.value = file
    attachmentName.value = file.name
  }
}

const removeAttachment = () => {
  attachment.value = null
  attachmentName.value = ''
  const fileInput = document.getElementById('file-input')
  if (fileInput) {
    fileInput.value = ''
  }
}

const resetForm = () => {
  toEmail.value = ''
  fromName.value = ''
  subject.value = ''
  message.value = ''
  removeAttachment()
  statusMessage.value = ''
  statusType.value = ''
  
  // Clear errors
  toEmailError.value = ''
  fromNameError.value = ''
  subjectError.value = ''
  messageError.value = ''
  fileError.value = ''
  
  // Announce to screen readers
  announceToScreenReader('Form has been cleared')
}

const announceToScreenReader = (message) => {
  // Create a temporary element for screen reader announcements
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  document.body.appendChild(announcement)
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

const sendEmail = async () => {
  if (!validateForm()) {
    statusMessage.value = 'Please fix the errors above before sending'
    statusType.value = 'error'
    announceToScreenReader('Form has validation errors. Please check the form and try again.')
    return
  }
  
  isLoading.value = true
  statusMessage.value = ''
  statusType.value = ''
  
  try {
    // Initialize EmailJS
    emailjs.init('YOUR_EMAILJS_PUBLIC_KEY')
    
    // Prepare template parameters
    const templateParams = {
      to_email: toEmail.value,
      from_name: fromName.value,
      subject: subject.value,
      message: message.value,
      attachment_name: attachmentName.value || 'No attachment'
    }
    
    // Send email
    const response = await emailjs.send(
      'service_o0yplm6',
      'template_h33dq1e',
      templateParams
    )
    
    if (response.status === 200) {
      statusMessage.value = 'Email sent successfully!'
      statusType.value = 'success'
      announceToScreenReader('Email sent successfully')
      
      // Reset form on success
      resetForm()
    } else {
      throw new Error('Failed to send email')
    }
  } catch (error) {
    console.error('Error sending email:', error)
    statusMessage.value = 'Failed to send email. Please try again.'
    statusType.value = 'error'
    announceToScreenReader('Failed to send email. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.email-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.email-form {
  margin-top: 20px;
}

.attachment-preview {
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.attachment-icon {
  font-size: 18px;
}

.attachment-name {
  font-weight: 500;
  color: #495057;
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

/* Focus indicators */
.form-control:focus,
.btn:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* High contrast support */
.high-contrast .form-control {
  border: 2px solid #000;
}

.high-contrast .btn {
  border: 2px solid #000;
}

.high-contrast .alert {
  border: 2px solid #000;
}

/* Improved form accessibility */
.form-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-text {
  font-size: 0.875rem;
  color: #6c757d;
}

.text-danger {
  color: #dc3545 !important;
}

/* Responsive accessibility */
@media (max-width: 768px) {
  .email-container {
    padding: 15px;
  }
  
  .form-control:focus,
  .btn:focus {
    outline: 2px solid #007bff;
    outline-offset: 1px;
  }
}

/* Button accessibility */
.btn {
  min-height: 44px;
  min-width: 44px;
}

.btn-sm {
  min-height: 32px;
  min-width: 32px;
}

/* Alert accessibility */
.alert {
  border: 1px solid transparent;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
}

.alert-success {
  background-color: #d1e7dd;
  border-color: #badbcc;
  color: #0f5132;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
}

/* Form validation styles */
.form-control.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-control.is-valid {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25);
}

/* Loading state */
.spinner-border {
  width: 1rem;
  height: 1rem;
}

/* Required field indicator */
.text-danger[aria-label="required"] {
  font-weight: bold;
}
</style>
