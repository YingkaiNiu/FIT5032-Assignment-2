<template>
  <div class="offline-support-container" role="region" aria-labelledby="offline-heading">
    <h3 id="offline-heading">离线功能支持</h3>
    
    <!-- Connection Status -->
    <div class="status-card mb-4">
      <div class="status-header">
        <h5>连接状态</h5>
        <div class="status-indicator" :class="isOnline ? 'online' : 'offline'">
          <span class="status-dot"></span>
          <span class="status-text">{{ isOnline ? '在线' : '离线' }}</span>
        </div>
      </div>
      
      <div class="status-details">
        <div class="status-item">
          <span class="status-label">网络连接</span>
          <span class="status-value" :class="isOnline ? 'text-success' : 'text-danger'">
            {{ isOnline ? '已连接' : '未连接' }}
          </span>
        </div>
        <div class="status-item">
          <span class="status-label">最后同步</span>
          <span class="status-value">{{ lastSyncTime }}</span>
        </div>
        <div class="status-item">
          <span class="status-label">缓存数据</span>
          <span class="status-value">{{ cachedItemsCount }} 项</span>
        </div>
      </div>
    </div>

    <!-- Offline Features -->
    <div class="features-grid">
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="feature-card">
            <div class="feature-icon">
              <span aria-hidden="true">📱</span>
            </div>
            <div class="feature-content">
              <h6>离线浏览</h6>
              <p>即使没有网络连接，您也可以浏览已缓存的内容和服务信息。</p>
              <div class="feature-status">
                <span class="badge bg-success">可用</span>
                <small class="text-muted ms-2">已缓存 {{ cachedPagesCount }} 个页面</small>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="feature-card">
            <div class="feature-icon">
              <span aria-hidden="true">💾</span>
            </div>
            <div class="feature-content">
              <h6>数据缓存</h6>
              <p>重要数据会自动缓存到本地，确保离线时也能访问关键信息。</p>
              <div class="feature-status">
                <span class="badge bg-success">可用</span>
                <small class="text-muted ms-2">{{ cacheSize }} MB 已使用</small>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="feature-card">
            <div class="feature-icon">
              <span aria-hidden="true">📝</span>
            </div>
            <div class="feature-content">
              <h6>离线表单</h6>
              <p>可以在离线状态下填写表单，数据会在重新连接后自动同步。</p>
              <div class="feature-status">
                <span class="badge bg-success">可用</span>
                <small class="text-muted ms-2">{{ pendingFormsCount }} 个待同步</small>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="feature-card">
            <div class="feature-icon">
              <span aria-hidden="true">🔄</span>
            </div>
            <div class="feature-content">
              <h6>自动同步</h6>
              <p>网络恢复后，离线期间的数据会自动同步到服务器。</p>
              <div class="feature-status">
                <span class="badge" :class="isOnline ? 'bg-success' : 'bg-warning'">
                  {{ isOnline ? '已启用' : '等待连接' }}
                </span>
                <small class="text-muted ms-2">{{ syncStatus }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cache Management -->
    <div class="cache-management mt-4">
      <h5>缓存管理</h5>
      <div class="cache-controls">
        <div class="row">
          <div class="col-md-6">
            <div class="cache-info">
              <div class="cache-item">
                <span class="cache-label">页面缓存</span>
                <div class="progress mb-2">
                  <div 
                    class="progress-bar" 
                    :style="{ width: pageCachePercentage + '%' }"
                    :aria-valuenow="pageCachePercentage"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    role="progressbar"
                  ></div>
                </div>
                <small class="text-muted">{{ cachedPagesCount }} / {{ totalPagesCount }} 页面</small>
              </div>
              
              <div class="cache-item">
                <span class="cache-label">数据缓存</span>
                <div class="progress mb-2">
                  <div 
                    class="progress-bar bg-info" 
                    :style="{ width: dataCachePercentage + '%' }"
                    :aria-valuenow="dataCachePercentage"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    role="progressbar"
                  ></div>
                </div>
                <small class="text-muted">{{ cacheSize }} MB / {{ maxCacheSize }} MB</small>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="cache-actions">
              <button 
                class="btn btn-outline-primary btn-sm me-2 mb-2"
                @click="refreshCache"
                @keydown.enter="refreshCache"
                @keydown.space="refreshCache"
                :disabled="isRefreshing"
                aria-label="刷新缓存"
              >
                <span v-if="isRefreshing" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                <span v-else aria-hidden="true">🔄</span>
                <span class="ms-1">{{ isRefreshing ? '刷新中...' : '刷新缓存' }}</span>
              </button>
              
              <button 
                class="btn btn-outline-warning btn-sm me-2 mb-2"
                @click="clearCache"
                @keydown.enter="clearCache"
                @keydown.space="clearCache"
                :disabled="isClearing"
                aria-label="清除缓存"
              >
                <span v-if="isClearing" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                <span v-else aria-hidden="true">🗑️</span>
                <span class="ms-1">{{ isClearing ? '清除中...' : '清除缓存' }}</span>
              </button>
              
              <button 
                class="btn btn-outline-success btn-sm mb-2"
                @click="syncData"
                @keydown.enter="syncData"
                @keydown.space="syncData"
                :disabled="!isOnline || isSyncing"
                aria-label="同步数据"
              >
                <span v-if="isSyncing" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                <span v-else aria-hidden="true">📤</span>
                <span class="ms-1">{{ isSyncing ? '同步中...' : '同步数据' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Actions -->
    <div v-if="pendingActions.length > 0" class="pending-actions mt-4">
      <h5>待处理操作</h5>
      <div class="pending-list">
        <div 
          v-for="action in pendingActions" 
          :key="action.id"
          class="pending-item"
          role="listitem"
        >
          <div class="pending-icon">
            <span aria-hidden="true">{{ getActionIcon(action.type) }}</span>
          </div>
          <div class="pending-content">
            <div class="pending-title">{{ action.title }}</div>
            <div class="pending-description">{{ action.description }}</div>
            <div class="pending-time">{{ formatTime(action.timestamp) }}</div>
          </div>
          <div class="pending-status">
            <span class="badge bg-warning">待同步</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Offline Tips -->
    <div class="offline-tips mt-4">
      <h5>离线使用提示</h5>
      <div class="tips-list">
        <div class="tip-item">
          <span class="tip-icon" aria-hidden="true">💡</span>
          <span class="tip-text">首次访问时请确保网络连接，以便缓存重要内容</span>
        </div>
        <div class="tip-item">
          <span class="tip-icon" aria-hidden="true">💡</span>
          <span class="tip-text">离线状态下填写的表单会在网络恢复后自动提交</span>
        </div>
        <div class="tip-item">
          <span class="tip-icon" aria-hidden="true">💡</span>
          <span class="tip-text">定期清理缓存可以释放存储空间并提高性能</span>
        </div>
        <div class="tip-item">
          <span class="tip-icon" aria-hidden="true">💡</span>
          <span class="tip-text">重要操作建议在网络连接稳定时进行</span>
        </div>
      </div>
    </div>

    <!-- Status Messages -->
    <div v-if="statusMessage" class="alert mt-3" :class="statusClass" role="alert" aria-live="polite">
      <span v-if="statusMessage.type === 'success'" class="me-2" aria-hidden="true">✅</span>
      <span v-else-if="statusMessage.type === 'warning'" class="me-2" aria-hidden="true">⚠️</span>
      <span v-else-if="statusMessage.type === 'error'" class="me-2" aria-hidden="true">❌</span>
      {{ statusMessage.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Component state
const isOnline = ref(navigator.onLine)
const isRefreshing = ref(false)
const isClearing = ref(false)
const isSyncing = ref(false)
const statusMessage = ref(null)

// Cache data
const cachedPagesCount = ref(15)
const totalPagesCount = ref(25)
const cacheSize = ref(45.2)
const maxCacheSize = ref(100)
const cachedItemsCount = ref(342)
const pendingFormsCount = ref(3)
const lastSyncTime = ref('2024-01-15 14:30')

// Pending actions
const pendingActions = ref([
  {
    id: 1,
    type: 'form_submit',
    title: '健康咨询预约',
    description: '张三的预约申请',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: 2,
    type: 'data_update',
    title: '个人信息更新',
    description: '李四的个人资料修改',
    timestamp: new Date(Date.now() - 45 * 60 * 1000)
  },
  {
    id: 3,
    type: 'feedback_submit',
    title: '服务评价',
    description: '王五的服务反馈',
    timestamp: new Date(Date.now() - 60 * 60 * 1000)
  }
])

// Computed properties
const pageCachePercentage = computed(() => {
  return Math.round((cachedPagesCount.value / totalPagesCount.value) * 100)
})

const dataCachePercentage = computed(() => {
  return Math.round((cacheSize.value / maxCacheSize.value) * 100)
})

const syncStatus = computed(() => {
  if (!isOnline.value) return '等待网络连接'
  if (isSyncing.value) return '正在同步...'
  if (pendingActions.value.length > 0) return `${pendingActions.value.length} 项待同步`
  return '已同步'
})

const statusClass = computed(() => {
  if (!statusMessage.value) return ''
  const classes = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-danger'
  }
  return classes[statusMessage.value.type] || 'alert-info'
})

// Methods
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine
  if (isOnline.value) {
    showStatus('网络连接已恢复', 'success')
    // Auto-sync when back online
    setTimeout(() => {
      if (pendingActions.value.length > 0) {
        syncData()
      }
    }, 2000)
  } else {
    showStatus('网络连接已断开，已启用离线模式', 'warning')
  }
}

const refreshCache = async () => {
  isRefreshing.value = true
  showStatus('正在刷新缓存...', 'info')
  
  try {
    // Simulate cache refresh
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update cache data
    cachedPagesCount.value = Math.min(cachedPagesCount.value + 2, totalPagesCount.value)
    cacheSize.value = Math.min(cacheSize.value + 5, maxCacheSize.value)
    
    showStatus('缓存刷新成功', 'success')
  } catch (error) {
    showStatus('缓存刷新失败', 'error')
  } finally {
    isRefreshing.value = false
  }
}

const clearCache = async () => {
  if (!confirm('确定要清除所有缓存数据吗？这将删除所有离线内容。')) {
    return
  }
  
  isClearing.value = true
  showStatus('正在清除缓存...', 'info')
  
  try {
    // Simulate cache clearing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Reset cache data
    cachedPagesCount.value = 0
    cacheSize.value = 0
    cachedItemsCount.value = 0
    
    showStatus('缓存清除成功', 'success')
  } catch (error) {
    showStatus('缓存清除失败', 'error')
  } finally {
    isClearing.value = false
  }
}

const syncData = async () => {
  if (!isOnline.value) {
    showStatus('无法同步：网络连接不可用', 'error')
    return
  }
  
  isSyncing.value = true
  showStatus('正在同步数据...', 'info')
  
  try {
    // Simulate data sync
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Clear pending actions
    pendingActions.value = []
    pendingFormsCount.value = 0
    lastSyncTime.value = new Date().toLocaleString('zh-CN')
    
    showStatus('数据同步成功', 'success')
  } catch (error) {
    showStatus('数据同步失败', 'error')
  } finally {
    isSyncing.value = false
  }
}

const getActionIcon = (type) => {
  const icons = {
    form_submit: '📝',
    data_update: '📊',
    feedback_submit: '⭐',
    appointment_book: '📅'
  }
  return icons[type] || '📄'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  
  const days = Math.floor(hours / 24)
  return `${days}天前`
}

const showStatus = (text, type = 'info') => {
  statusMessage.value = { text, type }
  setTimeout(() => {
    statusMessage.value = null
  }, 5000)
}

// Event listeners
const handleOnline = () => updateOnlineStatus()
const handleOffline = () => updateOnlineStatus()

// Lifecycle
onMounted(() => {
  // Add event listeners
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Initialize status
  updateOnlineStatus()
})

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

// Service Worker registration (for PWA support)
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

// Register service worker on mount
onMounted(() => {
  registerServiceWorker()
})
</script>

<style scoped>
.offline-support-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.status-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #dee2e6;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.status-indicator {
  display: flex;
  align-items: center;
  font-weight: 600;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-indicator.online .status-dot {
  background-color: #28a745;
  animation: pulse 2s infinite;
}

.status-indicator.offline .status-dot {
  background-color: #dc3545;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.status-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.status-label {
  font-weight: 500;
  color: #666;
}

.status-value {
  font-weight: 600;
}

.feature-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  display: flex;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 24px;
  margin-right: 15px;
  flex-shrink: 0;
}

.feature-content {
  flex: 1;
}

.feature-content h6 {
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
}

.feature-content p {
  margin-bottom: 12px;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.feature-status {
  display: flex;
  align-items: center;
}

.cache-management {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #dee2e6;
}

.cache-item {
  margin-bottom: 20px;
}

.cache-label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.progress {
  height: 8px;
  border-radius: 4px;
}

.progress-bar {
  background-color: #007bff;
  border-radius: 4px;
}

.pending-actions {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
}

.pending-list {
  max-height: 300px;
  overflow-y: auto;
}

.pending-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.pending-item:last-child {
  border-bottom: none;
}

.pending-icon {
  font-size: 20px;
  margin-right: 15px;
  flex-shrink: 0;
}

.pending-content {
  flex: 1;
}

.pending-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.pending-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.pending-time {
  color: #999;
  font-size: 0.8rem;
}

.pending-status {
  margin-left: 15px;
}

.offline-tips {
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 8px;
  padding: 20px;
}

.tips-list {
  display: grid;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
}

.tip-icon {
  font-size: 16px;
  margin-right: 10px;
  flex-shrink: 0;
}

.tip-text {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.5;
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
.btn:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .offline-support-container {
    padding: 15px;
  }
  
  .status-details {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    padding: 15px;
  }
  
  .cache-controls .row {
    flex-direction: column;
  }
  
  .cache-actions {
    margin-top: 20px;
  }
}

/* High contrast support */
.high-contrast .status-card,
.high-contrast .feature-card,
.high-contrast .cache-management,
.high-contrast .pending-actions,
.high-contrast .offline-tips {
  border: 2px solid #000;
}

.high-contrast .pending-item {
  border-bottom-color: #000;
}

/* Custom scrollbar */
.pending-list::-webkit-scrollbar {
  width: 6px;
}

.pending-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.pending-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.pending-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
