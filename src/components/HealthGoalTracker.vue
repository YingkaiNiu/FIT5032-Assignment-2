<template>
  <div class="health-goal-tracker-container" role="region" aria-labelledby="goal-tracker-heading">
    <h3 id="goal-tracker-heading" class="mb-4 text-center">Health Goal Tracker</h3>

    <div class="row justify-content-center mb-4">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Add New Goal</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="addGoal" aria-label="Add new health goal form">
              <div class="mb-3">
                <label for="goalName" class="form-label">Goal Name <span class="text-danger">*</span></label>
                <input
                  type="text"
                  class="form-control"
                  id="goalName"
                  v-model="newGoal.name"
                  placeholder="e.g., Drink 8 glasses of water daily"
                  required
                  aria-required="true"
                />
              </div>
              <div class="mb-3">
                <label for="goalTarget" class="form-label">Target (Optional)</label>
                <input
                  type="text"
                  class="form-control"
                  id="goalTarget"
                  v-model="newGoal.target"
                  placeholder="e.g., 8 glasses, 30 minutes, 5 kg"
                />
              </div>
              <div class="mb-3">
                <label for="goalDueDate" class="form-label">Due Date (Optional)</label>
                <input
                  type="date"
                  class="form-control"
                  id="goalDueDate"
                  v-model="newGoal.dueDate"
                />
              </div>
              <div class="mb-3">
                <label for="goalCategory" class="form-label">Category</label>
                <select class="form-select" id="goalCategory" v-model="newGoal.category">
                  <option value="General">General Wellness</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Mental Health">Mental Health</option>
                  <option value="Sleep">Sleep</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary w-100" aria-label="Add Goal">Add Goal</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header bg-info text-white">
            <h4 class="mb-0">Your Health Goals</h4>
          </div>
          <div class="card-body">
            <div v-if="goals.length === 0" class="alert alert-light text-center" role="status">
              No goals added yet. Start by adding a new goal above!
            </div>
            <ul class="list-group list-group-flush" v-else aria-label="List of health goals">
              <li
                v-for="(goal, index) in goals"
                :key="goal.id"
                class="list-group-item d-flex justify-content-between align-items-center"
                :class="{ 'list-group-item-success': goal.completed }"
                :aria-labelledby="`goal-name-${goal.id}`"
              >
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`goal-checkbox-${goal.id}`"
                    v-model="goal.completed"
                    @change="saveGoals"
                    :aria-label="`Mark ${goal.name} as completed`"
                  />
                  <label class="form-check-label" :for="`goal-checkbox-${goal.id}`">
                    <span :id="`goal-name-${goal.id}`" :class="{ 'text-decoration-line-through': goal.completed }">
                      {{ goal.name }}
                    </span>
                    <div class="text-muted small">
                      <span v-if="goal.target" class="me-2">Target: {{ goal.target }}</span>
                      <span v-if="goal.dueDate" class="me-2">Due: {{ formatDate(goal.dueDate) }}</span>
                      <span class="badge bg-secondary">{{ goal.category }}</span>
                    </div>
                  </label>
                </div>
                <div>
                  <button
                    @click="editGoal(goal)"
                    class="btn btn-sm btn-outline-primary me-2"
                    aria-label="Edit Goal"
                    title="Edit Goal"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    @click="removeGoal(index)"
                    class="btn btn-sm btn-outline-danger"
                    aria-label="Remove Goal"
                    title="Remove Goal"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div class="card-footer text-muted text-center">
            Progress: {{ completedGoalsCount }} / {{ goals.length }} goals completed
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Goal Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">Edit Health Goal</h5>
          <button type="button" class="btn-close btn-close-white" @click="closeEditModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form v-if="editingGoal">
            <div class="mb-3">
              <label for="editGoalName" class="form-label">Goal Name</label>
              <input type="text" class="form-control" id="editGoalName" v-model="editingGoal.name" required />
            </div>
            <div class="mb-3">
              <label for="editGoalTarget" class="form-label">Target (Optional)</label>
              <input type="text" class="form-control" id="editGoalTarget" v-model="editingGoal.target" />
            </div>
            <div class="mb-3">
              <label for="editGoalDueDate" class="form-label">Due Date (Optional)</label>
              <input type="date" class="form-control" id="editGoalDueDate" v-model="editingGoal.dueDate" />
            </div>
            <div class="mb-3">
              <label for="editGoalCategory" class="form-label">Category</label>
              <select class="form-select" id="editGoalCategory" v-model="editingGoal.category">
                <option value="General">General Wellness</option>
                <option value="Fitness">Fitness</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Sleep">Sleep</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="saveEditedGoal">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const goals = ref([])
const newGoal = ref({
  name: '',
  target: '',
  dueDate: '',
  category: 'General',
  completed: false,
})
const editingGoal = ref(null)
const showEditModal = ref(false)

onMounted(() => {
  loadGoals()
})

const addGoal = () => {
  if (newGoal.value.name.trim()) {
    goals.value.push({
      id: Date.now(),
      ...newGoal.value,
    })
    newGoal.value = { name: '', target: '', dueDate: '', category: 'General', completed: false }
    saveGoals()
  }
}

const removeGoal = (index) => {
  goals.value.splice(index, 1)
  saveGoals()
}

const editGoal = (goal) => {
  editingGoal.value = { ...goal }
  showEditModal.value = true
}

const saveEditedGoal = () => {
  if (editingGoal.value) {
    const index = goals.value.findIndex(g => g.id === editingGoal.value.id)
    if (index !== -1) {
      goals.value[index] = editingGoal.value
      saveGoals()
    }
    showEditModal.value = false
    editingGoal.value = null
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editingGoal.value = null
}

const saveGoals = () => {
  localStorage.setItem('healthGoals', JSON.stringify(goals.value))
}

const loadGoals = () => {
  const savedGoals = localStorage.getItem('healthGoals')
  if (savedGoals) {
    goals.value = JSON.parse(savedGoals)
  }
}

const completedGoalsCount = computed(() => {
  return goals.value.filter((goal) => goal.completed).length
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
</script>

<style scoped>
.health-goal-tracker-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.card {
  border: none;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 20px;
}

.card-header {
  background: linear-gradient(45deg, #007bff, #0056b3);
  color: white;
  padding: 1rem 1.5rem;
  font-weight: bold;
  border-bottom: none;
}

.card-header h4 {
  font-size: 1.25rem;
}

.card-body {
  padding: 1.5rem;
}

.list-group-item {
  border-left: none;
  border-right: none;
  padding: 1rem 1.5rem;
  transition: background-color 0.3s ease;
}

.list-group-item:first-child {
  border-top: none;
}

.list-group-item:last-child {
  border-bottom: none;
}

.list-group-item-success {
  background-color: #d4edda;
}

.form-check-input:checked + .form-check-label span {
  color: #28a745;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  color: white;
}

.modal-header.bg-primary {
  background: linear-gradient(45deg, #007bff, #0056b3) !important;
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

/* Accessibility improvements */
.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.btn:focus {
  outline: 3px solid #007bff;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .health-goal-tracker-container {
    padding: 10px;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .list-group-item {
    padding: 0.75rem 1rem;
  }
}

/* Custom Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* High contrast support */
.high-contrast .card {
  border: 2px solid #000;
}

.high-contrast .form-control,
.high-contrast .form-select {
  border: 2px solid #000;
}

.high-contrast .btn {
  border: 2px solid #000;
}
</style>
