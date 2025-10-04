# AI4DM - AI Agents for Data Management

## Overview
AI4DM (AI Agents 4 Data Management) is an open-source project aimed at maturing the data management community through the innovative application of AI agents. This React-based frontend application serves as the interface for AI-powered data management tools and workflows.

**Purpose**: To bridge the gap between Theory, Context, and Execution in data management practice using AI agents

**Current State**: Frontend application running successfully on Replit with React + TypeScript + Vite

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Language**: TypeScript 5.8.3
- **Styling**: TailwindCSS 3.4.17
- **Dev Server**: Running on port 5000

### Project Structure
```
frontend/
├── src/
│   ├── components/     # React components (Login, Dashboard, Chat, etc.)
│   ├── contexts/       # React contexts (Auth, Chat, Dashboard, etc.)
│   ├── domain/         # Domain models and business logic
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   ├── ui/             # UI components (Toast, etc.)
│   └── utils/          # Utility functions
├── public/             # Static assets
└── vite.config.ts      # Vite configuration
```

### Key Features
- Authentication system with social login (Google, LinkedIn)
- AI-powered chat workspace
- Knowledge base management
- File upload and management
- Dashboard with assessments and notifications
- Tool catalog and modal system
- **Data Quality Assessment Agent** - Automated data quality analysis across 5 dimensions (NEW)

## Recent Changes

### October 4, 2025 - Data Quality Assessment Feature
1. Implemented Data Quality Assessment Agent (Priority 2.1)
2. Created quality analysis engine (`frontend/src/utils/dataQualityAnalysis.ts`)
   - Analyzes 5 quality dimensions: completeness, consistency, validity, accuracy, uniqueness
   - Provides scores (0-100) for each dimension
   - Detects specific issues: missing values, duplicates, outliers, format errors
   - Generates actionable recommendations
3. Built DataQualityDashboard component (`frontend/src/components/DataQualityDashboard.tsx`)
   - Visual quality indicators with color-coded progress bars
   - Expandable drill-down for detailed issue inspection
   - Professional design with gradients and animations
4. Integrated into existing Tools system
   - Added to Analytics category
   - Works with CSV file uploads
   - Results display in chat interface

### October 3, 2025 - Initial Replit Setup

### Replit Setup
1. Installed Node.js 20 and npm dependencies
2. Configured Vite to run on 0.0.0.0:5000 for Replit proxy compatibility
3. Set up development workflow for hot module reloading
4. Created .gitignore for Node.js project
5. Configured autoscale deployment for production

### Configuration Files
- `vite.config.ts`: Updated to bind to 0.0.0.0:5000 with proper HMR settings
- `.gitignore`: Added Node.js ignore patterns
- Deployment config: Uses `vite preview` for production serving

## Four Strategic Workstreams

1. **Single-Agent Systems**: Building specialized AI agents for core data management functions
2. **Multi-Agent Systems**: Architecting virtual data management teams
3. **Regulatory & Compliance Agents**: Training AI agents on international best practices
4. **Community Tooling & Infrastructure**: Creating open-source data management tools

## Development

### Running Locally
The dev server is configured to run automatically via the "Server" workflow:
```bash
cd frontend && npm run dev
```
Server runs on http://0.0.0.0:5000

### Building for Production
```bash
cd frontend && npm run build
```

### Deployment
Configured for Replit autoscale deployment:
- Build: `npm run build --prefix frontend`
- Run: `npx vite preview --host 0.0.0.0 --port 5000 --strictPort`

## Environment Setup

### Prerequisites
- Node.js 20+ (installed via Replit)
- npm (comes with Node.js)

### Dependencies
All frontend dependencies are managed in `frontend/package.json` including React, Vite, TypeScript, and TailwindCSS.

## User Preferences
- None recorded yet

## Notes
- The application is frontend-only with no backend server in this repository
- Port 5000 is used for both development and production to maintain consistency
- Vite HMR (Hot Module Replacement) is configured for proper Replit proxy support
