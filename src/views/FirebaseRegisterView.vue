<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Create an Account</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  placeholder="Email" 
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
                  placeholder="Password" 
                  v-model="password"
                  required
                />
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-success">Save to Firebase</button>
              </div>
            </form>
            <div class="mt-3 text-center">
              <p>Already have an account? <router-link to="/FireLogin">Sign in here</router-link></p>
            </div>
            <div v-if="error" class="alert alert-danger mt-3">
              {{ error }}
            </div>
            <div v-if="success" class="alert alert-success mt-3">
              {{ success }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"

const email = ref("")
const password = ref("")
const error = ref("")
const success = ref("")
const router = useRouter()
const auth = getAuth()

const register = () => {
  console.log("Starting registration process...")
  console.log("Email:", email.value)
  console.log("Password length:", password.value.length)
  
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      console.log("Firebase Register Successful!")
      console.log("User:", userCredential.user)
      success.value = "Account created successfully! Redirecting to sign in..."
      // Store user info in localStorage for compatibility with existing auth system
      localStorage.setItem('firebaseUser', JSON.stringify({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: 'user' // Default role
      }))
      setTimeout(() => {
        router.push("/FireLogin")
      }, 2000)
    })
    .catch((errorObj) => {
      console.log("Registration error:", errorObj)
      console.log("Error code:", errorObj.code)
      console.log("Error message:", errorObj.message)
      
      switch (errorObj.code) {
        case 'auth/email-already-in-use':
          error.value = 'An account with this email already exists.'
          break
        case 'auth/weak-password':
          error.value = 'Password should be at least 6 characters long.'
          break
        case 'auth/invalid-email':
          error.value = 'Invalid email address.'
          break
        case 'auth/operation-not-allowed':
          error.value = 'Email/password accounts are not enabled. Please contact support.'
          break
        default:
          error.value = `An error occurred during registration: ${errorObj.message}`
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
