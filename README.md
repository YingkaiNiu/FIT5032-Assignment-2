# FIT5032 Web Application

A modern Vue.js web application built for FIT5032 Assignment 2, demonstrating advanced web development concepts including authentication, role-based access control, and dynamic data management.

## Features

### Category A: Basic Functionality
- ✅ **User Authentication System**
  - User registration with form validation
  - User login with credential verification
  - Password reset functionality
  - Session management with JWT tokens
  - Role-based access control (User/Admin)

- ✅ **Responsive Design**
  - Mobile-first responsive layout
  - Bootstrap 5 framework integration
  - Cross-browser compatibility
  - Modern UI/UX design principles

- ✅ **Navigation & Routing**
  - Vue Router implementation
  - Protected routes with authentication guards
  - Dynamic navigation based on user role
  - Breadcrumb navigation

### Category B: Advanced Features
- ✅ **Dashboard & Analytics**
  - Interactive dashboard with statistics
  - Real-time data visualization
  - User activity tracking
  - System status monitoring

- ✅ **Product Management System**
  - Product catalog with search and filtering
  - Product details with image gallery
  - Rating and review system
  - Stock management
  - Category-based organization

- ✅ **Admin Panel**
  - User management interface
  - Product administration
  - System settings configuration
  - Analytics and reporting tools

### Category C: Enhanced Functionality
- ✅ **Advanced UI Components**
  - Modal dialogs and forms
  - Data tables with sorting and pagination
  - Interactive charts and graphs
  - Toast notifications
  - Loading states and error handling

- ✅ **Data Management**
  - State management with Pinia
  - API integration patterns
  - Data persistence with localStorage
  - Real-time data updates

- ✅ **Security Features**
  - Input validation and sanitization
  - CSRF protection
  - Secure authentication flow
  - Role-based permissions

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

1. **Home Page**: Landing page with application overview
2. **Login/Register**: User authentication forms
3. **Dashboard**: User dashboard with statistics and activities
4. **Products**: Product catalog with search and filtering
5. **Product Details**: Detailed product view with reviews
6. **Admin Panel**: Administrative interface (admin only)

### Role-Based Access

- **Regular Users**: Can view products, manage profile, access dashboard
- **Administrators**: Full access including user management, system settings

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