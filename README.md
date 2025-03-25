# Logistics Management System

A modern web application for managing logistics operations, built with React and TypeScript. This system allows users to create, track, and manage delivery orders with real-time updates.

## Features

- **User Authentication**: Secure login system with role-based access control
- **Order Management**: Create, track, and manage delivery orders
- **Real-time Updates**: Live status updates for orders
- **Role-based Interface**: Different views for admin, drivers, and regular users
- **Responsive Design**: Mobile-friendly interface
- **Form Validation**: Comprehensive input validation using Zod
- **State Management**: Redux for global state management
- **Type Safety**: Full TypeScript implementation

## Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time Updates**: Socket.IO
- **UI Components**: Custom components with Tailwind CSS
- **Code Quality**: ESLint, Prettier

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/logistics-frontend.git
cd logistics-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure API endpoints:
   The application uses a configuration file located at `src/config/api.js` to manage API endpoints and other configuration settings. You can modify the endpoints according to your backend setup:

```javascript
// src/config/api.js
export const API_URL = 'your_api_url';
```

## Running the Project

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
# or
yarn build
```

To preview the production build:
```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
src/
├── app/                    # App configuration and store setup
├── components/            # Shared UI components
├── config/               # Configuration files
│   └── api.js           # API endpoints configuration
├── features/             # Feature-based modules
│   ├── auth/            # Authentication related components
│   ├── dashboard/       # Dashboard components
│   ├── orders/          # Order management components
│   └── users/           # User management components
├── services/            # API services
├── types/               # TypeScript type definitions
└── utils/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## User Roles

The application supports three user roles:

1. **Admin**
   - View all orders
   - Manage users
   - Assign drivers to orders
   - Update order status

2. **Driver**
   - View assigned orders
   - Update order status
   - View order history

3. **User**
   - Create new orders
   - View their orders
   - Track order status
   - View order history

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [Zod](https://zod.dev/)
