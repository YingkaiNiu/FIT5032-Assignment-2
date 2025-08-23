<template>
  <div class="health-assistant-container" role="region" aria-labelledby="assistant-heading">
    <h3 id="assistant-heading">AI Health Assistant</h3>
    
    <!-- Chat Interface -->
    <div class="chat-container">
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="message"
          :class="message.type"
        >
          <div class="message-content">
            <div class="message-header">
              <span class="sender-name">{{ message.sender }}</span>
              <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="message-text" v-html="formatMessage(message.text)"></div>
          </div>
        </div>
        
        <!-- Typing indicator -->
        <div v-if="isTyping" class="message assistant">
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Input Area -->
      <div class="chat-input-container">
        <form @submit.prevent="sendMessage" class="chat-form">
          <div class="input-group">
            <input
              type="text"
              v-model="newMessage"
              @keydown.enter="sendMessage"
              placeholder="Ask about your health..."
              class="form-control"
              :disabled="isTyping"
              aria-label="Type your health question"
            />
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!newMessage.trim() || isTyping"
              aria-label="Send message"
            >
              <span v-if="!isTyping" aria-hidden="true">📤</span>
              <span v-else class="spinner-border spinner-border-sm" aria-hidden="true"></span>
            </button>
          </div>
        </form>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
          <button
            v-for="action in quickActions"
            :key="action.text"
            @click="sendQuickMessage(action.text)"
            class="btn btn-outline-secondary btn-sm"
            :disabled="isTyping"
            :aria-label="`Quick action: ${action.text}`"
          >
            {{ action.text }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Status Messages -->
    <div v-if="statusMessage" class="alert mt-3" :class="statusClass" role="alert" aria-live="polite">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini API configuration
const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY') // Replace with actual API key
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

// Chat state
const messages = ref([])
const newMessage = ref('')
const isTyping = ref(false)
const statusMessage = ref('')
const messagesContainer = ref(null)

// Quick action buttons
const quickActions = ref([
  { text: 'Headache symptoms' },
  { text: 'Sleep problems' },
  { text: 'Exercise advice' },
  { text: 'Diet recommendations' }
])

// Computed properties
const statusClass = computed(() => {
  if (statusMessage.value.includes('error')) return 'alert-danger'
  if (statusMessage.value.includes('success')) return 'alert-success'
  return 'alert-info'
})

// Methods
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

const formatMessage = (text) => {
  // Convert markdown-like formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const addMessage = (text, sender = 'User') => {
  messages.value.push({
    text,
    sender,
    type: sender === 'User' ? 'user' : 'assistant',
    timestamp: new Date()
  })
  scrollToBottom()
}

const sendQuickMessage = (text) => {
  newMessage.value = text
  sendMessage()
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return
  
  const userMessage = newMessage.value.trim()
  addMessage(userMessage, 'User')
  newMessage.value = ''
  isTyping.value = true
  
  try {
    // Generate AI response
    const prompt = `You are a helpful health assistant. Provide helpful, accurate, and safe health advice. 
    Always remind users to consult healthcare professionals for serious concerns.
    
    User question: ${userMessage}
    
    Please provide a helpful response in a conversational tone.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const aiResponse = response.text()
    
    addMessage(aiResponse, 'Health Assistant')
    statusMessage.value = 'Message sent successfully'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Error generating response:', error)
    addMessage('I apologize, but I\'m having trouble processing your request right now. Please try again later or consult a healthcare professional for immediate concerns.', 'Health Assistant')
    statusMessage.value = 'Error: Unable to generate response'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  } finally {
    isTyping.value = false
  }
}

// Watch for new messages to auto-scroll
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// Initialize with welcome message
onMounted(() => {
  addMessage('Hello! I\'m your AI Health Assistant. I can help answer general health questions and provide wellness advice. Remember, I\'m here to help, but always consult healthcare professionals for serious medical concerns. How can I assist you today?', 'Health Assistant')
})
</script>

<style scoped>
.health-assistant-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 15px;
  max-height: 400px;
}

.message {
  margin-bottom: 15px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message.user .message-content {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: white;
  color: #333;
  border: 1px solid #e9ecef;
  border-bottom-left-radius: 4px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.message-text {
  line-height: 1.4;
}

.message-text :deep(strong) {
  font-weight: 600;
}

.message-text :deep(em) {
  font-style: italic;
}

.chat-input-container {
  margin-top: auto;
}

.chat-form {
  margin-bottom: 10px;
}

.input-group {
  display: flex;
  gap: 10px;
}

.input-group .form-control {
  flex: 1;
  border-radius: 20px;
  padding: 10px 15px;
  border: 1px solid #ced4da;
}

.input-group .btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.quick-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-actions .btn {
  border-radius: 15px;
  font-size: 0.8rem;
  padding: 4px 12px;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #007bff;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Accessibility improvements */
.chat-messages:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .health-assistant-container {
    height: 500px;
    padding: 15px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .quick-actions {
    justify-content: center;
  }
}

/* High contrast support */
.high-contrast .message.assistant .message-content {
  border: 2px solid #000;
}

.high-contrast .message.user .message-content {
  background: #000;
  color: #fff;
}
</style>
