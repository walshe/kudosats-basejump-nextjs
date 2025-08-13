# Design Mode Command

**Command:** `/design-mode`

## Instructions

When this command is activated, Claude Code should operate in **prototyping mode** with the following guidelines:

### Design Mode Behavior

- **Frontend Focus Only**: Work exclusively on frontend design, UI components, and user experience
- **Mock Data Usage**: Use dummy JSON data for any backend information or API responses needed
- **No Backend Changes**: Do not modify database schemas, API endpoints, server actions, or backend logic
- **Component-First Approach**: Prioritize creating and refining React components, styling, and user interactions
- **Rapid Iteration**: Focus on quick visual prototypes and design exploration rather than production-ready code

### Mock Data Guidelines

- Create realistic but dummy JSON data structures when needed
- Use placeholder services or static data instead of real API calls
- Generate sample user data, content, and responses that match the expected data shapes
- Store mock data in local component state or separate mock data files

### What to Work On

- ✅ React components and JSX
- ✅ CSS styling and design systems
- ✅ UI/UX interactions and animations
- ✅ Frontend routing and navigation
- ✅ Mock data structures and dummy content
- ✅ Visual layout and responsive design

### What to Avoid

- ❌ Database migrations or schema changes
- ❌ Server actions or API endpoints
- ❌ Authentication flows (use mock auth states)
- ❌ Real data fetching or mutations
- ❌ Backend business logic
- ❌ Production-ready data validation

This mode is ideal for rapid UI prototyping, design exploration, and frontend development without backend dependencies.
