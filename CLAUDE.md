# AI4DM Frontend Architecture Guidelines

## Project Overview
AI4DM is an enterprise-level web application for AI-powered data management tools, built with modern software engineering patterns and strict TypeScript standards.

## Core Architectural Principles

### 1. Technology Stack
- **Build Tool**: Vite with TypeScript
- **UI Framework**: React with TypeScript
- **Styling**: TailwindCSS (utility-first)
- **State Management**: Context API with domain-driven patterns
- **Build Output**: Optimized production bundle

### 2. TypeScript Configuration
```typescript
// tsconfig.json strict settings
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 3. Project Structure
```
/src
  /components     // Presentational components (pure UI)
  /containers     // Container components (logic + state)
  /contexts       // React Context providers
  /domain         // Domain models and business logic
  /hooks          // Custom React hooks
  /ui             // Custom UI components (Toast, Modal, etc.)
  /utils          // Utility functions
  /types          // TypeScript type definitions
  /services       // API and external service integrations
```

## Domain-Driven Design Patterns

### Domain Models
```typescript
// Example domain interface structure
interface AgentRequest {
  id: string;
  instructions: string;
  attachedFiles: File[];
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface AgentResponse {
  requestId: string;
  outputFiles: ProcessedFile[];
  logs: string[];
  timestamp: Date;
}

interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  content: string | Blob;
  metadata: FileMetadata;
}
```

## Component Architecture

### Container/Presentational Pattern
- **Containers**: Handle business logic, state management, API calls
- **Presentational**: Pure components focused on UI rendering
- **Custom Hooks**: Extract reusable logic from containers

### Component Composition Rules
1. Interface-first design for all props
2. Generic types for reusable components
3. Explicit prop spreading control
4. No default exports (named exports only)

## Custom UI System Implementation

### Toast Notification System
```typescript
// Core toast types and interfaces
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type: Toast['type'], options?: ToastOptions) => void;
  removeToast: (id: string) => void;
}
```

### Toast System Requirements
- Auto-dismiss with configurable duration (default 5000ms)
- Duplicate prevention using ID system
- Fixed positioning: bottom-4 right-4
- Stacked layout with space-y-2
- Z-index: 50 for overlay
- Color coding by type:
  - Success: green (bg-green-500)
  - Error: red (bg-red-500)
  - Warning: amber (bg-amber-500)
  - Info: blue (bg-blue-500)

## State Management Architecture

### Context-Driven Approach
1. **AppContext**: Global application state
2. **ToastContext**: Notification management
3. **FileContext**: File upload/download management
4. **AgentContext**: AI agent interaction state

### State Persistence
- localStorage for critical state
- Auto-save functionality with debouncing
- Graceful fallbacks for storage failures

## UI/UX Requirements

### Main Interface Components
1. **Instruction Input**
   - Multiline text area with auto-resize
   - Character count and validation
   - Clear button with confirmation

2. **File Management**
   - Drag-and-drop file upload zone
   - File preview with metadata
   - Progress indicators for uploads
   - List of uploaded files with delete option

3. **Output Display**
   - Tabbed interface for multiple outputs
   - Download individual or all files
   - Preview capabilities for text/code files
   - Processing status indicators

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interactions
- Accessibility standards (WCAG 2.1 AA)

## Build Configuration

### Vite Configuration Requirements
```javascript
// vite.config.ts key settings
{
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  }
}
```

### Production Build
- Optimized bundle with code splitting
- Tree-shaking for minimal bundle size
- Asset optimization and compression
- Fast loading and runtime performance

## Development Workflow

### Commands
- `npm run dev`: Development server with HMR
- `npm run build`: Production build
- `npm run preview`: Preview production build
- `npm run type-check`: TypeScript validation
- `npm run lint`: ESLint validation

### Code Quality Standards
1. No `any` types (use `unknown` if needed)
2. Explicit return types for all functions
3. Comprehensive error handling
4. Loading states for all async operations
5. Meaningful variable and function names
6. Comments for complex logic only

## Error Handling Patterns

### Error Boundaries
- Wrap major sections in error boundaries
- Graceful fallback UI
- Error reporting to console (dev) or logging service (prod)

### User Feedback
- Clear error messages
- Actionable recovery suggestions
- Retry mechanisms where appropriate
- Progress indicators for long operations

## Performance Considerations

### Bundle Size Optimization
- Tree shaking for unused code
- Dynamic imports for heavy components
- Lazy loading for non-critical features
- No external UI libraries (build custom)

### Runtime Performance
- React.memo for expensive components
- useMemo/useCallback for expensive computations
- Virtual scrolling for long lists
- Debounced inputs and searches

## Security Considerations

### File Handling
- Client-side validation of file types/sizes
- Sanitization of file names
- Memory management for large files
- Secure temporary storage

### Data Protection
- No sensitive data in localStorage
- Input sanitization
- XSS prevention
- Content Security Policy headers

## Future Extensibility

### Planned Features
1. Multi-agent system coordination
2. Real-time collaboration
3. Advanced file processing pipelines
4. Integration with external AI services
5. Offline-first PWA capabilities

### API Integration Preparation
- Service layer abstraction
- Mock data for development
- Interface-based service contracts
- Environment-based configuration

## Testing Strategy

### Unit Testing
- Jest for logic testing
- React Testing Library for components
- 80% coverage target

### Integration Testing
- End-to-end user flows
- File upload/download cycles
- Error recovery scenarios

## Deployment Considerations

### Static Hosting
- Standard static site deployment
- CDN-friendly distribution
- No server-side requirements
- Version control through file naming

## Maintenance Guidelines

### Code Review Checklist
1. TypeScript strict mode compliance
2. Component composition patterns followed
3. Error handling implemented
4. Loading states present
5. Accessibility standards met
6. Performance impact assessed

### Documentation Requirements
- Component prop documentation
- Complex logic explanation
- API contract documentation
- Deployment procedures

## References
- [AI4DM Project Overview](README.md)
- [Single Agent Systems](01_single_ai_data_agent)
- [Multi-Agent Systems](02_multi_ai_data_agent_system)
- [Regulatory Support](03_ai_agent_regulatory_support)
- [Community Tools](04_ai_agent_tools)