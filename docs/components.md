# Component Documentation

This document provides an overview of the key components in the Credit Cooperative System.

## Table of Contents

1. [Common Components](#common-components)
   - [AccessibilityMenu](#accessibilitymenu)
   - [ErrorBoundary](#errorboundary)
   - [FallbackUI](#fallbackui)
   - [MobileNavigation](#mobilenavigation)
   - [ResponsiveForm](#responsiveform)
   - [ResponsiveInputs](#responsiveinputs)
   - [ResponsiveWrapper](#responsivewrapper)
   - [SkipToContent](#skiptocontent)
2. [Admin Components](#admin-components)
   - [AdminLayout](#adminlayout)
   - [UnifiedDashboard](#unifieddashboard)
3. [Member Components](#member-components)
   - [MemberDashboard](#memberdashboard)

## Common Components

### AccessibilityMenu

A floating menu that provides accessibility options for users.

**Features:**
- Font size adjustment
- Contrast mode toggle (normal, high, low)
- Reduced motion toggle
- Settings saved to localStorage

**Usage:**
```jsx
import AccessibilityMenu from '@/components/common/AccessibilityMenu';

function MyPage() {
  return (
    <div>
      <AccessibilityMenu />
      {/* Page content */}
    </div>
  );
}
```

### ErrorBoundary

A component that catches JavaScript errors in its child component tree and displays a fallback UI.

**Features:**
- Catches and logs errors
- Displays a user-friendly fallback UI
- Provides a reset button to recover from errors
- Supports custom fallback UI
- Available as a higher-order component (HOC)

**Usage:**
```jsx
import ErrorBoundary, { withErrorBoundary } from '@/components/common/ErrorBoundary';

// As a component
function MyPage() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}

// As a HOC
const MyComponentWithErrorHandling = withErrorBoundary(MyComponent);
```

### FallbackUI

A collection of fallback UI components for different error scenarios.

**Components:**
- `ErrorFallback`: For general errors
- `NetworkErrorFallback`: For network connectivity issues
- `NotFoundFallback`: For 404 errors
- `UnauthorizedFallback`: For authentication/authorization errors
- `LoadingFallback`: For loading states
- `EmptyStateFallback`: For empty data states

**Usage:**
```jsx
import { 
  ErrorFallback, 
  NetworkErrorFallback, 
  LoadingFallback 
} from '@/components/common/FallbackUI';

// In an error boundary
<ErrorBoundary fallback={(error, resetErrorBoundary) => (
  <ErrorFallback 
    error={error} 
    resetErrorBoundary={resetErrorBoundary} 
  />
)}>
  <MyComponent />
</ErrorBoundary>

// For loading states
{isLoading ? <LoadingFallback /> : <MyComponent />}
```

### MobileNavigation

A responsive navigation component optimized for mobile devices.

**Features:**
- Responsive design that adapts to screen size
- Mobile menu with hamburger button
- Support for nested menu items
- Active link highlighting
- Optional sticky positioning
- Dark mode support
- Transparent mode with scroll behavior

**Usage:**
```jsx
import MobileNavigation from '@/components/common/MobileNavigation';

const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { 
    label: 'Services', 
    href: '/services',
    children: [
      { label: 'Service 1', href: '/services/1' },
      { label: 'Service 2', href: '/services/2' },
    ]
  },
];

function MyPage() {
  return (
    <MobileNavigation
      items={navigationItems}
      logo="/logo.png"
      logoAlt="Company Logo"
      sticky={true}
      rightContent={<button>Sign In</button>}
    />
  );
}
```

### ResponsiveForm

A form component that adapts to different screen sizes.

**Components:**
- `ResponsiveForm`: The main form container
- `FormGroup`: A group of form elements
- `FormLabel`: A label for a form element
- `FormControl`: A container for form controls

**Features:**
- Responsive layout that adapts to screen size
- Support for horizontal and vertical layouts
- Loading state with spinner
- Error and hint text display

**Usage:**
```jsx
import ResponsiveForm, { FormGroup, FormLabel, FormControl } from '@/components/common/ResponsiveForm';

function MyForm() {
  const handleSubmit = (e) => {
    // Handle form submission
  };

  return (
    <ResponsiveForm onSubmit={handleSubmit} submitText="Save Changes">
      <FormGroup>
        <FormLabel htmlFor="name" required>Name</FormLabel>
        <FormControl>
          <input id="name" name="name" type="text" required />
        </FormControl>
      </FormGroup>
      
      {/* More form groups */}
    </ResponsiveForm>
  );
}
```

### ResponsiveInputs

A collection of form input components that adapt to different screen sizes.

**Components:**
- `TextInput`: A text input field
- `TextArea`: A textarea field
- `Select`: A select dropdown
- `Checkbox`: A checkbox input

**Features:**
- Responsive design that adapts to screen size
- Consistent styling across input types
- Error and hint text display
- Accessibility attributes

**Usage:**
```jsx
import { 
  TextInput, 
  TextArea, 
  Select, 
  Checkbox 
} from '@/components/common/ResponsiveInputs';

function MyForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    agreeToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <form>
      <TextInput
        id="name"
        name="name"
        label="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      
      <TextArea
        id="description"
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
      />
      
      <Select
        id="category"
        name="category"
        label="Category"
        value={formData.category}
        onChange={handleChange}
        options={[
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ]}
      />
      
      <Checkbox
        id="agreeToTerms"
        name="agreeToTerms"
        label="I agree to the terms and conditions"
        checked={formData.agreeToTerms}
        onChange={handleChange}
        required
      />
    </form>
  );
}
```

### ResponsiveWrapper

A utility component that provides screen size information to its children.

**Features:**
- Detects screen size changes
- Provides screen size context to child components
- Supports custom breakpoints

**Usage:**
```jsx
import { ResponsiveProvider, useScreenSize } from '@/components/common/ResponsiveWrapper';

// At the app root
function MyApp() {
  return (
    <ResponsiveProvider>
      <MyComponent />
    </ResponsiveProvider>
  );
}

// In a component
function MyComponent() {
  const screenSize = useScreenSize();
  
  return (
    <div>
      Current screen size: {screenSize}
      {screenSize === 'mobile' && <MobileView />}
      {screenSize === 'desktop' && <DesktopView />}
    </div>
  );
}
```

### SkipToContent

A component that provides a skip link for keyboard users to bypass navigation.

**Features:**
- Visible only when focused
- Jumps to main content when activated
- Improves keyboard navigation accessibility

**Usage:**
```jsx
import SkipToContent from '@/components/common/SkipToContent';

function MyPage() {
  return (
    <div>
      <SkipToContent contentId="main-content" />
      <header>...</header>
      <main id="main-content">
        {/* Main content */}
      </main>
    </div>
  );
}
```

## Admin Components

### AdminLayout

A layout component for admin pages.

**Features:**
- Responsive sidebar navigation
- Mobile-friendly design
- User profile dropdown
- Breadcrumb navigation
- Accessibility features

**Usage:**
```jsx
import AdminLayout from '@/components/admin/AdminLayout';

function AdminPage() {
  return (
    <AdminLayout>
      {/* Page content */}
    </AdminLayout>
  );
}
```

### UnifiedDashboard

A dashboard component that adapts to different cooperative types.

**Features:**
- Supports both Credit and Multi-Purpose cooperative types
- Tabbed interface (Overview, Financial, Approvals, Activity)
- Key metrics display
- Responsive design

**Usage:**
```jsx
import UnifiedDashboard from '@/components/admin/dashboard/UnifiedDashboard';

function DashboardPage() {
  return (
    <AdminLayout>
      <UnifiedDashboard
        metrics={metrics}
        financialData={financialData}
        financialPeriod={financialPeriod}
        onFinancialPeriodChange={handleFinancialPeriodChange}
        pendingApprovals={pendingApprovals}
        recentActivity={recentActivity}
      />
    </AdminLayout>
  );
}
```

## Member Components

### MemberDashboard

A mobile-optimized dashboard for cooperative members.

**Features:**
- Account summary display
- Quick action buttons (Transfer, Withdraw, Deposit)
- Tabbed interface (Overview, Transactions, Notifications)
- Active loans display
- Recent transactions display
- Notifications display
- Responsive design

**Usage:**
```jsx
import MemberDashboard from '@/components/member/MemberDashboard';

function MemberHomePage() {
  return (
    <MemberDashboard
      user={user}
      accountSummary={accountSummary}
      recentTransactions={recentTransactions}
      activeLoans={activeLoans}
      notifications={notifications}
    >
      {/* Additional content */}
    </MemberDashboard>
  );
}
```
