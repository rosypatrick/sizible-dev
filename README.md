# Sizible Fashion Style Advice Prototype

A dual-interface platform connecting retailers and consumers through personalized size and style recommendations.

## Project Overview

This prototype demonstrates a fashion platform with dual interfaces for retailers and consumers, aligned with Sizible's brand identity. Retailers can provide natural language style advice and promotion preferences, while consumers receive personalized size and style recommendations.

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git
- Supabase account (for database)

### GitHub Codespaces

When running the application in GitHub Codespaces, you may need to run the following commands:

1. **Set execute permissions for the scripts**
   ```bash
   # For backend (in Codespaces)
   chmod +x ./backend/node_modules/.bin/nodemon

   # For frontend (in Codespaces)
   chmod +x ./frontend/node_modules/.bin/react-scripts
   ```

2. **Fix potential frontend build issues**
   ```bash
   # In the frontend directory (in Codespaces)
   export NODE_OPTIONS=--openssl-legacy-provider
   ```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sizible-dev
   ```

2. **Set up environment variables**

   For the frontend:
   ```bash
   cd frontend
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

   For the backend:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Install dependencies**

   For the frontend:
   ```bash
   cd frontend
   npm install
   ```

   For the backend:
   ```bash
   cd backend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
sizible-dev/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── assets/         # Static assets (images, fonts)
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── styles/         # Global styles and theme
│   │   └── utils/          # Utility functions
│   └── public/             # Public static files
│
├── backend/                # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── data/           # Data access layer
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
│
└── docs/                   # Project documentation
```

## Features

- **Retailer Interface**:
  - Login with retailer name and personal name
  - View existing garments in inventory
  - Provide free-form NLP guidance on style pairings and promotional priorities
  - Submit and save guidance in the system

- **Consumer Interface**:
  - Select retailer, brand, and garment type
  - Receive size recommendations
  - View complementary style recommendations based on retailer guidance

## Technology Stack

- **Frontend**: React, Styled Components, React Router
- **Backend**: Node.js, Express
- **Database**: Supabase PostgreSQL
- **Styling**: Custom theme based on Sizible's brand identity

## Documentation

For more detailed information, see:
- [Technical Documentation](./docs/technical_documentation.md)
- [Implementation Guide](./docs/implementation_guide.md)

## License

This project is proprietary and confidential.

## Contact

For any questions or support, please contact the project maintainers.