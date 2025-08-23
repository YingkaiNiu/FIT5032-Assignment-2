<template>
  <div class="ai-chatbot-container" role="region" aria-labelledby="chatbot-heading">
    <h3 id="chatbot-heading">AI智能客服助手</h3>
    
    <!-- Chat Interface -->
    <div class="chat-interface">
      <!-- Chat Messages -->
      <div 
        class="chat-messages" 
        ref="messagesContainer"
        role="log"
        aria-label="聊天消息历史"
        aria-live="polite"
      >
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message"
          :class="message.type"
          role="listitem"
        >
          <div class="message-avatar">
            <span v-if="message.type === 'user'" aria-hidden="true">👤</span>
            <span v-else aria-hidden="true">🤖</span>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">
                {{ message.type === 'user' ? '您' : 'AI助手' }}
              </span>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
            <div class="message-text" v-html="formatMessage(message.text)"></div>
            <div v-if="message.type === 'assistant' && message.suggestions" class="message-suggestions">
              <button 
                v-for="suggestion in message.suggestions" 
                :key="suggestion"
                class="btn btn-outline-primary btn-sm me-2 mb-2"
                @click="sendMessage(suggestion)"
                @keydown.enter="sendMessage(suggestion)"
                @keydown.space="sendMessage(suggestion)"
                :aria-label="`快速回复: ${suggestion}`"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- Typing Indicator -->
        <div v-if="isTyping" class="message assistant" role="listitem">
          <div class="message-avatar">
            <span aria-hidden="true">🤖</span>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">AI助手</span>
            </div>
            <div class="typing-indicator">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="chat-input-container">
        <form @submit.prevent="sendUserMessage" role="form" aria-describedby="chat-form-help">
          <div id="chat-form-help" class="sr-only">
            输入您的问题，AI助手将为您提供帮助
          </div>
          
          <div class="input-group">
            <input
              ref="messageInput"
              v-model="userInput"
              type="text"
              class="form-control"
              placeholder="输入您的问题..."
              :disabled="isTyping"
              @keydown.enter="sendUserMessage"
              aria-label="输入消息"
              aria-describedby="input-help"
            />
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!userInput.trim() || isTyping"
              @keydown.enter="sendUserMessage"
              @keydown.space="sendUserMessage"
              aria-label="发送消息"
            >
              <span v-if="isTyping" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-else aria-hidden="true">📤</span>
            </button>
          </div>
          
          <div id="input-help" class="form-text">
            按 Enter 键发送消息，或点击发送按钮
          </div>
        </form>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions mt-3">
      <h6>快速问题：</h6>
      <div class="quick-buttons">
        <button 
          v-for="quickQuestion in quickQuestions" 
          :key="quickQuestion"
          class="btn btn-outline-secondary btn-sm me-2 mb-2"
          @click="sendMessage(quickQuestion)"
          @keydown.enter="sendMessage(quickQuestion)"
          @keydown.space="sendMessage(quickQuestion)"
          :disabled="isTyping"
          :aria-label="`快速提问: ${quickQuestion}`"
        >
          {{ quickQuestion }}
        </button>
      </div>
    </div>

    <!-- Chat Status -->
    <div class="chat-status mt-3">
      <div class="status-indicators">
        <span class="status-item">
          <span class="status-dot online" aria-label="AI服务在线"></span>
          <span class="status-text">AI服务在线</span>
        </span>
        <span class="status-item">
          <span class="status-dot" :class="isTyping ? 'typing' : 'idle'" aria-label="AI状态"></span>
          <span class="status-text">{{ isTyping ? '正在思考...' : '等待中' }}</span>
        </span>
      </div>
    </div>

    <!-- Error Messages -->
    <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert" aria-live="polite">
      <span aria-hidden="true">⚠️</span>
      <span class="ms-2">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'

// Chat state
const messages = ref([])
const userInput = ref('')
const isTyping = ref(false)
const errorMessage = ref('')
const messagesContainer = ref(null)
const messageInput = ref(null)

// Quick questions
const quickQuestions = [
  '如何预约服务？',
  '有哪些健康服务？',
  '如何修改预约时间？',
  '服务费用是多少？',
  '如何联系客服？'
]

// Sample responses (in real app, these would come from Gemini API)
const aiResponses = {
  '如何预约服务？': {
    text: '您可以通过以下方式预约服务：\n\n1. 点击页面上的"预约"按钮\n2. 选择您需要的服务类型\n3. 选择合适的时间和日期\n4. 填写个人信息\n5. 确认预约\n\n我们的智能日历系统会自动检测时间冲突，确保您能获得最佳的服务时间。',
    suggestions: ['预约需要多长时间？', '可以取消预约吗？', '需要提前多久预约？']
  },
  '有哪些健康服务？': {
    text: '我们提供以下健康服务：\n\n🏥 **健康咨询** - 专业医生提供健康建议\n💊 **药物检查** - 药物相互作用和副作用检查\n🏃 **物理治疗** - 康复训练和物理治疗\n🚨 **紧急护理** - 紧急医疗情况处理\n🔄 **康复训练** - 术后康复和功能恢复\n\n每种服务都有专业的医疗团队为您提供支持。',
    suggestions: ['服务费用是多少？', '需要医生推荐吗？', '服务时长是多久？']
  },
  '如何修改预约时间？': {
    text: '您可以通过以下方式修改预约时间：\n\n1. 登录您的账户\n2. 进入"我的预约"页面\n3. 找到需要修改的预约\n4. 点击"修改"按钮\n5. 选择新的时间\n6. 确认修改\n\n请注意，修改预约需要在服务开始前24小时进行。',
    suggestions: ['可以取消预约吗？', '修改需要手续费吗？', '如何查看预约状态？']
  },
  '服务费用是多少？': {
    text: '我们的服务费用如下：\n\n💰 **健康咨询** - $50/次\n💊 **药物检查** - $30/次\n🏃 **物理治疗** - $80/次\n🚨 **紧急护理** - $120/次\n🔄 **康复训练** - $100/次\n\n我们接受医疗保险，具体费用可能因保险计划而异。请咨询我们的客服了解详细信息。',
    suggestions: ['接受哪些保险？', '有优惠套餐吗？', '如何支付费用？']
  },
  '如何联系客服？': {
    text: '您可以通过以下方式联系我们的客服团队：\n\n📞 **电话** - 1-800-HEALTH (1-800-432-584)\n📧 **邮件** - support@healthcare.com\n💬 **在线聊天** - 点击页面右下角的聊天图标\n📱 **移动应用** - 通过我们的移动应用\n\n客服时间：周一至周五 8:00-18:00，周六 9:00-17:00',
    suggestions: ['客服响应时间多久？', '有紧急联系方式吗？', '可以预约客服咨询吗？']
  }
}

// Default welcome message
const welcomeMessage = {
  id: Date.now(),
  type: 'assistant',
  text: '您好！我是您的AI健康助手 🤖\n\n我可以帮助您：\n• 了解我们的健康服务\n• 协助预约管理\n• 回答常见问题\n• 提供健康建议\n\n请告诉我您需要什么帮助？',
  timestamp: new Date(),
  suggestions: ['如何预约服务？', '有哪些健康服务？', '服务费用是多少？']
}

// Methods
const sendUserMessage = () => {
  if (!userInput.value.trim() || isTyping.value) return
  
  const message = {
    id: Date.now(),
    type: 'user',
    text: userInput.value.trim(),
    timestamp: new Date()
  }
  
  messages.value.push(message)
  const userQuestion = userInput.value.trim()
  userInput.value = ''
  
  // Show typing indicator
  isTyping.value = true
  errorMessage.value = ''
  
  // Simulate AI response
  setTimeout(() => {
    generateAIResponse(userQuestion)
    isTyping.value = false
  }, 1500 + Math.random() * 1000) // Random delay for realistic feel
}

const sendMessage = (text) => {
  userInput.value = text
  sendUserMessage()
}

const generateAIResponse = (question) => {
  // In a real implementation, this would call Gemini API
  // For demo purposes, we'll use predefined responses
  
  let response = aiResponses[question]
  
  if (!response) {
    // Generate a generic response for unknown questions
    response = {
      text: `感谢您的问题！关于"${question}"，我建议您：\n\n1. 查看我们的服务介绍页面\n2. 联系我们的客服团队\n3. 预约专业咨询\n\n如果您需要更具体的帮助，请提供更多详细信息。`,
      suggestions: ['如何预约服务？', '联系客服', '查看服务介绍']
    }
  }
  
  const aiMessage = {
    id: Date.now(),
    type: 'assistant',
    text: response.text,
    timestamp: new Date(),
    suggestions: response.suggestions
  }
  
  messages.value.push(aiMessage)
  scrollToBottom()
}

const formatMessage = (text) => {
  // Convert markdown-like formatting to HTML
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/•/g, '&bull;')
}

const formatTime = (timestamp) => {
  return timestamp.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const focusInput = () => {
  if (messageInput.value) {
    messageInput.value.focus()
  }
}

// Watch for new messages to auto-scroll
watch(messages, () => {
  scrollToBottom()
}, { deep: true })

// Lifecycle
onMounted(() => {
  // Add welcome message
  messages.value.push(welcomeMessage)
  
  // Focus input after component mounts
  setTimeout(focusInput, 500)
})

// In a real implementation, you would integrate with Gemini API like this:
/*
const callGeminiAPI = async (question) => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful healthcare assistant. Answer this question in Chinese: ${question}`
          }]
        }]
      })
    })
    
    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('无法连接到AI服务，请稍后重试')
  }
}
*/
</script>

<style scoped>
.ai-chatbot-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chat-interface {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8f9fa;
}

.message {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin: 0 10px;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background-color: #28a745;
}

.message-content {
  flex: 1;
  max-width: 70%;
}

.message.user .message-content {
  text-align: right;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.message.user .message-header {
  flex-direction: row-reverse;
}

.message-sender {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

.message-time {
  font-size: 0.8rem;
  color: #666;
}

.message-text {
  background-color: white;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  line-height: 1.5;
  word-wrap: break-word;
}

.message.user .message-text {
  background-color: #007bff;
  color: white;
}

.message-suggestions {
  margin-top: 10px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-radius: 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #007bff;
  margin: 0 2px;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) { animation-delay: -0.32s; }
.typing-dot:nth-child(2) { animation-delay: -0.16s; }

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

.chat-input-container {
  padding: 20px;
  background-color: white;
  border-top: 1px solid #dee2e6;
}

.quick-actions {
  padding: 15px 0;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chat-status {
  padding: 10px 0;
  border-top: 1px solid #dee2e6;
}

.status-indicators {
  display: flex;
  gap: 20px;
}

.status-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-dot.online {
  background-color: #28a745;
}

.status-dot.typing {
  background-color: #ffc107;
  animation: pulse 1s infinite;
}

.status-dot.idle {
  background-color: #6c757d;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.status-text {
  font-size: 0.8rem;
}

/* Accessibility */
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
.btn:focus,
.form-control:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .ai-chatbot-container {
    padding: 15px;
  }
  
  .chat-interface {
    height: 400px;
  }
  
  .message-content {
    max-width: 85%;
  }
  
  .quick-buttons {
    flex-direction: column;
  }
  
  .quick-buttons .btn {
    width: 100%;
    margin-bottom: 8px;
  }
}

/* High contrast support */
.high-contrast .chat-interface {
  border: 2px solid #000;
}

.high-contrast .message-text {
  border: 1px solid #000;
}

.high-contrast .message.user .message-text {
  border: 1px solid #fff;
}

/* Custom scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
