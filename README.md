# Elderly Health Support - Health Charity Web Application

A modern Vue.js web application built for a distinguished health charity, dedicated to supporting vulnerable elderly populations through innovative technology solutions. This application demonstrates advanced web development concepts including authentication, role-based access control, and comprehensive health service management.

## Features

### Category A: Basic Functionality
- ✅ **User Authentication System**
  - User registration with form validation
  - User login with credential verification
  - Password reset functionality
  - Session management with JWT tokens
  - Role-based access control (User/Admin)
  - Firebase Auth integration ready

- ✅ **Responsive Design**
  - Mobile-first responsive layout optimized for elderly users
  - Bootstrap 5 framework integration
  - Cross-browser compatibility
  - Modern UI/UX design principles
  - Large text and high contrast for accessibility

- ✅ **Navigation & Routing**
  - Vue Router implementation
  - Protected routes with authentication guards
  - Dynamic navigation based on user role
  - Breadcrumb navigation
  - Simple navigation structure for elderly users

### Category B: Advanced Features
- ✅ **Health Services Management**
  - Comprehensive health service catalog
  - Service locator with interactive map
  - Appointment booking system
  - Service categories and filtering
  - Emergency services information

- ✅ **Health Resources System**
  - Educational materials and health guides
  - Wellness tips and daily health advice
  - Resource search and filtering
  - Multiple format support (PDF, Video, Articles)
  - Emergency health information

- ✅ **Admin Panel**
  - User management interface
  - Service administration
  - System settings configuration
  - Analytics and reporting tools
  - Appointment management

### Category C: Enhanced Functionality
- ✅ **Advanced UI Components**
  - Modal dialogs and forms
  - Data tables with sorting and pagination
  - Interactive charts and graphs
  - Toast notifications
  - Loading states and error handling
  - Elderly-friendly interface design

- ✅ **Data Management**
  - State management with Pinia
  - API integration patterns (Firestore ready)
  - Data persistence with localStorage
  - Real-time data updates
  - CSV/PDF export capabilities

- ✅ **Security Features**
  - Input validation and sanitization
  - CSRF protection
  - Secure authentication flow
  - Role-based permissions
  - WCAG 2.1 AA accessibility compliance

## Technology Stack

- **Frontend Framework**: Vue.js 3 (Composition API)
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **UI Framework**: Bootstrap 5
- **Build Tool**: Vite
- **Package Manager**: npm
- **Icons**: Bootstrap Icons

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fit5032-web-application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── assets/          # Static assets (CSS, images)
├── components/      # Reusable Vue components
├── router/          # Vue Router configuration
├── stores/          # Pinia stores (state management)
├── views/           # Page components
├── App.vue          # Root component
└── main.js          # Application entry point
```

## Usage

### Authentication

The application includes mock authentication with the following test accounts:

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

### Features Overview

1. **Home Page**: Landing page with health charity mission and services
2. **Services**: Comprehensive health service catalog with interactive map
3. **Resources**: Health guides, educational materials, and wellness tips
4. **About**: Information about the charity's mission and impact
5. **Contact**: Contact form with email integration and location map
6. **Login/Register**: User authentication forms
7. **Dashboard**: User dashboard with health statistics and appointments
8. **Admin Panel**: Administrative interface for service management (admin only)

### Role-Based Access

- **Regular Users**: Can view services, book appointments, access health resources, manage profile
- **Administrators**: Full access including user management, service administration, system settings

### Target Audience

- **Primary**: Elderly individuals (aged 65+) with limited technical skills
- **Secondary**: Caregivers (aged 30-50) supporting elderly family members

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add routes in `src/router/index.js`
3. Create views in `src/views/`
4. Update state management in `src/stores/`

### Styling

- Use Bootstrap 5 classes for layout and components
- Custom CSS in `src/assets/main.css`
- Component-specific styles in `<style scoped>` blocks

### State Management

The application uses Pinia for state management:

- `auth` store: User authentication and session management
- Additional stores can be added for specific features

## API Integration

The application currently uses mock data. To integrate with a real API:

1. Replace mock API calls in stores
2. Configure axios for HTTP requests
3. Update authentication flow
4. Implement proper error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Lazy loading for routes
- Optimized bundle size with Vite
- Efficient state management
- Responsive image loading

## Security Considerations

- Input validation on all forms
- XSS protection through Vue's built-in escaping
- CSRF token implementation ready
- Secure authentication flow
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational purposes as part of FIT5032 Assignment 2.

## Support

For questions or issues, please refer to the assignment documentation or contact your instructor.

---

**Note**: This is a demonstration application built for educational purposes. In a production environment, additional security measures, proper API integration, and comprehensive testing would be required. 