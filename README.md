# Elderly Health Support Web Application

A comprehensive Vue.js web application for elderly health support services, featuring Firebase authentication, email services, and interactive data tables.

## Features

- 🔐 **Firebase Authentication** - User registration and login
- 📧 **Email Service** - Send emails with attachments using EmailJS
- 📊 **Interactive Tables** - Sortable, searchable, and paginated data tables
- 🗺️ **Health Map** - Google Maps integration for health services
- 📤 **Data Export** - CSV and PDF export functionality
- ♿ **Accessibility** - WCAG 2.1 AA compliance
- 🎯 **Health Goal Tracker** - Set and track personal health goals
- ⏰ **Health Reminder System** - Comprehensive health reminder and notification system
- 📈 **Health Dashboard** - Real-time analytics and visualization
- 📅 **Smart Scheduler** - Appointment management system
- 📱 **Offline Records** - Offline-capable health record management
- 🎨 **Modern UI** - Bootstrap-based responsive design
- 🚀 **Cloud Deployment** - Deployed on Vercel

## Technologies Used

- Vue.js 3
- Vue Router
- Pinia (State Management)
- Bootstrap 5
- Firebase Authentication
- EmailJS
- Google Maps API
- Chart.js & vue-chartjs
- FullCalendar

- jsPDF & jspdf-autotable
- Vite

## Business Requirements Implemented

- **D1**: External Authentication (Firebase Auth)
- **D2**: Email Service with Attachments (EmailJS)
- **D3**: Interactive Table Data (Sort, Search, Pagination)
- **D4**: Cloud Deployment (Vercel)
- **E2**: Map Integration (Google Maps API)
- **E4**: Data Export (CSV and PDF)
- **WCAG 2.1 AA**: Accessibility Compliance
- **F**: Innovation Features (Health Goal Tracker, Health Reminder System, Dashboard, Scheduler, Offline Records)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fit5032-assignment-2
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment

This application is deployed on Vercel. The live version can be accessed at:
[Your Vercel URL will be here]

### Deployment Steps

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically build and deploy your application

## Project Structure

```
src/
├── components/          # Vue components
│   ├── EmailComponent.vue
│   ├── UserTable.vue
│   └── ServiceTable.vue
├── views/              # Page components
│   ├── Home.vue
│   ├── FirebaseSigninView.vue
│   ├── FirebaseRegisterView.vue
│   ├── EmailView.vue
│   └── TablesView.vue
├── router/             # Vue Router configuration
├── stores/             # Pinia stores
├── assets/             # Static assets
└── main.js            # Application entry point
```

## Configuration

### Firebase Configuration
- Project ID: `fit5037-assignment3`
- Authentication enabled for email/password

### EmailJS Configuration
- Service ID: `service_o0yplm6`
- Template ID: `template_h33dq1e`

### Google Maps Configuration
- Maps integration for health services location display



## License

MIT License 