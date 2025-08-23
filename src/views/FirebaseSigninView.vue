<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Firebase Sign In</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="signIn">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  placeholder="Enter your email" 
                  v-model="email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  placeholder="Enter your password" 
                  v-model="password"
                  required
                />
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Sign In</button>
              </div>
            </form>
            <div class="mt-3 text-center">
              <p>Don't have an account? <router-link to="/FireRegister">Register here</router-link></p>
            </div>
            <div v-if="error" class="alert alert-danger mt-3">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const error = ref("")
const router = useRouter()
const auth = getAuth()

const signIn = () => {
  console.log("Starting sign in process...")
  console.log("Email:", email.value)
  console.log("Password length:", password.value.length)
  
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase Sign In Successful!")
      console.log("User:", userCredential.user)
      // Store user info in localStorage for compatibility with existing auth system
      localStorage.setItem('firebaseUser', JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: 'user' // Default role
      }))
      router.push("/dashboard")
    })
    .catch((errorObj) => {
      console.log("Sign in error:", errorObj)
      console.log("Error code:", errorObj.code)
      console.log("Error message:", errorObj.message)
      
      switch (errorObj.code) {
        case 'auth/user-not-found':
          error.value = 'No account found with this email address.'
          break
        case 'auth/wrong-password':
          error.value = 'Incorrect password.'
          break
        case 'auth/invalid-email':
          error.value = 'Invalid email address.'
          break
        case 'auth/user-disabled':
          error.value = 'This account has been disabled.'
          break
        case 'auth/too-many-requests':
          error.value = 'Too many failed attempts. Please try again later.'
          break
        default:
          error.value = `An error occurred during sign in: ${errorObj.message}`
      }
    })
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
</style>
