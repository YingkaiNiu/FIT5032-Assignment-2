<template>
  <div class="innovation-view">
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center mb-4">创新功能体验中心</h2>
          <p class="text-center text-muted mb-5">
            探索我们为提升用户体验而设计的创新功能
          </p>
        </div>
      </div>

      <!-- Feature Navigation -->
      <div class="feature-nav mb-4">
        <div class="row">
          <div class="col-12">
            <div class="nav nav-pills justify-content-center" role="tablist">
              <button
                v-for="(feature, index) in features"
                :key="feature.id"
                class="nav-link"
                :class="{ active: activeFeature === feature.id }"
                @click="setActiveFeature(feature.id)"
                @keydown.enter="setActiveFeature(feature.id)"
                @keydown.space="setActiveFeature(feature.id)"
                :aria-selected="activeFeature === feature.id"
                :aria-controls="`feature-${feature.id}`"
                role="tab"
                type="button"
              >
                <span class="feature-icon me-2" aria-hidden="true">{{ feature.icon }}</span>
                {{ feature.title }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature Content -->
      <div class="feature-content">
        <div class="tab-content">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="tab-pane"
            :class="{ active: activeFeature === feature.id }"
            :id="`feature-${feature.id}`"
            role="tabpanel"
            :aria-labelledby="`feature-${feature.id}-tab`"
          >
            <component :is="feature.component" />
          </div>
        </div>
      </div>

      <!-- Feature Overview -->
      <div class="feature-overview mt-5">
        <h3 class="text-center mb-4">功能概览</h3>
        <div class="row">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="col-lg-3 col-md-6 mb-4"
          >
            <div class="feature-card h-100">
              <div class="feature-card-header">
                <div class="feature-icon-large mb-3" aria-hidden="true">
                  {{ feature.icon }}
                </div>
                <h5>{{ feature.title }}</h5>
              </div>
              <div class="feature-card-body">
                <p class="text-muted">{{ feature.description }}</p>
                <ul class="feature-benefits">
                  <li v-for="benefit in feature.benefits" :key="benefit">
                    {{ benefit }}
                  </li>
                </ul>
              </div>
              <div class="feature-card-footer">
                <button
                  class="btn btn-primary btn-sm"
                  @click="setActiveFeature(feature.id)"
                  @keydown.enter="setActiveFeature(feature.id)"
                  @keydown.space="setActiveFeature(feature.id)"
                  aria-label="体验 {{ feature.title }}"
                >
                  立即体验
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppointmentCalendar from '../components/AppointmentCalendar.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import AIChatbot from '../components/AIChatbot.vue'
import OfflineSupport from '../components/OfflineSupport.vue'

// Active feature state
const activeFeature = ref('calendar')

// Features configuration
const features = ref([
  {
    id: 'calendar',
    title: '智能预约日历',
    icon: '📅',
    component: AppointmentCalendar,
    description: '智能预约管理系统，支持冲突检测和时间建议',
    benefits: [
      '实时冲突检测',
      '智能时间建议',
      '多视图切换',
      '拖拽式操作'
    ]
  },
  {
    id: 'dashboard',
    title: '数据可视化',
    icon: '📊',
    component: AdminDashboard,
    description: '实时数据可视化仪表板，展示关键业务指标',
    benefits: [
      '实时数据更新',
      '多种图表类型',
      '交互式操作',
      '响应式设计'
    ]
  },
  {
    id: 'chatbot',
    title: 'AI智能客服',
    icon: '🤖',
    component: AIChatbot,
    description: 'AI驱动的智能客服助手，提供24/7在线服务',
    benefits: [
      '智能问答',
      '快速响应',
      '多语言支持',
      '学习能力'
    ]
  },
  {
    id: 'offline',
    title: '离线功能支持',
    icon: '📱',
    component: OfflineSupport,
    description: '完整的离线功能支持，确保无网络时也能正常使用',
    benefits: [
      '离线浏览',
      '数据缓存',
      '自动同步',
      '状态监控'
    ]
  }
])

// Methods
const setActiveFeature = (featureId) => {
  activeFeature.value = featureId
  
  // Scroll to feature content
  setTimeout(() => {
    const featureContent = document.querySelector('.feature-content')
    if (featureContent) {
      featureContent.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, 100)
}

// Lifecycle
onMounted(() => {
  // Set initial active feature
  activeFeature.value = 'calendar'
})
</script>

<style scoped>
.innovation-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.feature-nav .nav-pills {
  gap: 10px;
}

.feature-nav .nav-link {
  border-radius: 25px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #f8f9fa;
  color: #6c757d;
}

.feature-nav .nav-link:hover {
  background: #e9ecef;
  color: #495057;
  transform: translateY(-2px);
}

.feature-nav .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.feature-icon {
  font-size: 18px;
}

.feature-content {
  min-height: 600px;
  padding: 30px 0;
}

.tab-pane {
  display: none;
}

.tab-pane.active {
  display: block;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.feature-overview {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 30px;
  margin-top: 40px;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.feature-card-header {
  text-align: center;
  margin-bottom: 20px;
}

.feature-icon-large {
  font-size: 48px;
  margin-bottom: 15px;
}

.feature-card-header h5 {
  color: #333;
  font-weight: 600;
  margin: 0;
}

.feature-card-body {
  margin-bottom: 20px;
}

.feature-card-body p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.feature-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-benefits li {
  padding: 5px 0;
  color: #555;
  font-size: 0.9rem;
  position: relative;
  padding-left: 20px;
}

.feature-benefits li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

.feature-card-footer {
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  padding: 8px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

/* Accessibility */
.nav-link:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

.btn:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 20px;
  }
  
  .feature-nav .nav-pills {
    flex-direction: column;
    align-items: center;
  }
  
  .feature-nav .nav-link {
    width: 100%;
    max-width: 300px;
    margin-bottom: 10px;
  }
  
  .feature-content {
    min-height: 400px;
    padding: 20px 0;
  }
  
  .feature-overview {
    padding: 20px;
  }
}

/* High contrast support */
.high-contrast .feature-card {
  border: 2px solid #000;
}

.high-contrast .nav-link {
  border: 2px solid #000;
}

.high-contrast .btn-primary {
  border: 2px solid #000;
}
</style>
