<template>
  <div class="logout-success-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5 col-xl-4">
          <div class="card shadow-custom text-center">
            <div class="card-body p-5">
              <!-- Success Icon -->
              <div class="success-icon mb-4">
                <i class="bi bi-check-circle-fill"></i>
              </div>

              <!-- Success Message -->
              <h2 class="text-success mb-3">Logout Successful!</h2>
              <p class="text-muted mb-4">You have successfully logged out. Thank you for using our service.</p>

              <!-- Auto Redirect Info -->
              <div class="alert alert-info mb-4">
                <i class="bi bi-info-circle me-2"></i>
                <span v-if="countdown > 0">
                  {{ countdown }} seconds until automatic redirect to login page...
                </span>
                <span v-else>
                  Redirecting...
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="d-grid gap-3">
                <button 
                  class="btn btn-primary" 
                  @click="goToLogin"
                  :disabled="isRedirecting"
                >
                  <i class="bi bi-box-arrow-in-right me-2"></i>
                  Go to Login Page
                </button>
                
                <button 
                  class="btn btn-outline-secondary" 
                  @click="goToHome"
                  :disabled="isRedirecting"
                >
                  <i class="bi bi-house me-2"></i>
                  Back to Home
                </button>
              </div>

              <!-- Progress Bar -->
              <div class="progress mt-4" style="height: 4px;">
                <div 
                  class="progress-bar bg-success" 
                  :style="{ width: progressWidth + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LogoutSuccess',
  setup() {
    const router = useRouter()
    const countdown = ref(5)
    const isRedirecting = ref(false)
    const progressWidth = ref(0)
    let countdownTimer = null

    const goToLogin = () => {
      isRedirecting.value = true
      router.push('/login')
    }

    const goToHome = () => {
      isRedirecting.value = true
      router.push('/')
    }

    const startCountdown = () => {
      countdownTimer = setInterval(() => {
        countdown.value--
        progressWidth.value = ((5 - countdown.value) / 5) * 100
        
        if (countdown.value <= 0) {
          clearInterval(countdownTimer)
          goToLogin()
        }
      }, 1000)
    }

    onMounted(() => {
      startCountdown()
    })

    onUnmounted(() => {
      if (countdownTimer) {
        clearInterval(countdownTimer)
      }
    })

    return {
      countdown,
      isRedirecting,
      progressWidth,
      goToLogin,
      goToHome
    }
  }
}
</script>

<style scoped>
.logout-success-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.shadow-custom {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 15px;
}

.card {
  border: none;
  border-radius: 15px;
  background: white;
}

.success-icon {
  font-size: 4rem;
  color: #28a745;
  animation: fadeInScale 0.6s ease-out;
}

.success-icon i {
  animation: bounce 1s ease-in-out;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.progress {
  border-radius: 2px;
  background-color: #e9ecef;
}

.progress-bar {
  transition: width 1s linear;
}

.btn {
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.alert {
  border-radius: 8px;
  border: none;
}

@media (max-width: 768px) {
  .logout-success-page {
    padding: 1rem 0;
  }
  
  .card-body {
    padding: 2rem !important;
  }
  
  .success-icon {
    font-size: 3rem;
  }
}
</style> 