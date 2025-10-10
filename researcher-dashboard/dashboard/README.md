# Researcher Dashboard

A comprehensive dashboard for managing voice conversational AI interview platforms. Built with React, Tailwind CSS, and modern web technologies.

## Features

### 🔐 Authentication
- Secure login/register system
- JWT token-based authentication
- Protected routes and session management

### 📊 Dashboard Overview
- Real-time statistics and metrics
- Recent activity feed
- Quick action buttons
- Visual data representation

### 📝 Template Management
- Create and manage interview templates
- Starter questions configuration
- Shareable interview links
- Template analytics

### 🎤 Session Monitoring
- Real-time session tracking
- Detailed session transcripts
- Sentiment analysis
- Session status management

### 👥 Respondent Management
- Panel management system
- Demographics tracking
- Participation history
- Behavior tagging

### 📈 Insights & Analytics
- Interactive charts and graphs
- Sentiment distribution analysis
- Theme extraction and analysis
- Completion rate tracking

### 📋 Survey Generation
- AI-powered survey creation
- Multiple question types
- Google Forms integration
- Export capabilities

### 💰 Incentive Management
- Payment tracking
- Status management
- Automated calculations
- Bulk operations

## Technology Stack

- **Frontend**: React 19, Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### API Configuration

The application expects a backend API running on `http://localhost:8000/api`. Update the API base URL in `src/services/api.js` if your backend runs on a different port.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/          # Authentication components
│   ├── Dashboard/     # Dashboard-specific components
│   ├── Layout/        # Layout components
│   ├── Sessions/      # Session-related components
│   └── Templates/     # Template management components
├── contexts/          # React contexts
├── pages/            # Page components
├── services/         # API services
└── App.jsx          # Main application component
```

## Features Overview

### Dashboard
- Overview cards with key metrics
- Recent activity feed
- Quick action buttons
- Real-time data updates

### Templates
- Create/edit interview templates
- Manage starter questions
- Generate shareable links
- Track usage statistics

### Sessions
- View all interview sessions
- Filter by status and date
- Detailed session transcripts
- Sentiment analysis results

### Respondents
- Manage research panel
- Track demographics
- View participation history
- Behavior analysis

### Insights
- Interactive data visualizations
- Sentiment distribution charts
- Theme analysis
- Performance metrics

### Survey Generator
- AI-powered question generation
- Multiple question types
- Google Forms integration
- Export functionality

### Incentives
- Track payment status
- Manage respondent incentives
- Bulk payment operations
- Financial reporting

## API Integration

The dashboard integrates with a REST API that provides:

- Authentication endpoints
- Template management
- Session tracking
- Respondent data
- Analytics and insights
- Survey generation
- Incentive management

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses ESLint for code quality and consistency. All components follow React best practices with functional components and hooks.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.