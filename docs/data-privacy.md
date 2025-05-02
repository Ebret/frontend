# Data Privacy Components

This document provides detailed information about the data privacy components in the Credit Cooperative System.

## Table of Contents

1. [Introduction](#introduction)
2. [Components](#components)
   - [DataPrivacyAgreement](#dataprivacyagreement)
   - [EWalletDataPrivacyAgreement](#ewalletdataprivacyagreement)
   - [DataPrivacyFooter](#dataprivacyfooter)
3. [Integration](#integration)
4. [Compliance](#compliance)
5. [Testing](#testing)

## Introduction

The Credit Cooperative System includes several components for ensuring compliance with the Philippines Data Privacy Act of 2012 (RA 10173). These components provide a consistent and user-friendly way to present privacy information to users and obtain their consent.

## Components

### DataPrivacyAgreement

The `DataPrivacyAgreement` component displays the cooperative's data privacy agreement in a modal dialog. It is used throughout the application wherever user consent is required.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `cooperativeName` | `string` | The name of the cooperative |

#### Usage

```tsx
import DataPrivacyAgreement from '@/components/DataPrivacyAgreement';

// In your component
<DataPrivacyAgreement cooperativeName="Your Cooperative" />
```

#### Features

- Displays the complete data privacy agreement in a modal dialog
- Includes the Philippines Data Privacy Act logo
- Provides a compliance statement referencing RA 10173
- Formats the agreement content in a readable, structured way
- Supports dynamic insertion of the cooperative name

### EWalletDataPrivacyAgreement

The `EWalletDataPrivacyAgreement` component is a specialized version of the data privacy agreement for the E-Wallet feature. It includes additional information specific to e-wallet services.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `onAgree` | `() => void` | Optional callback function called when the user agrees to the terms |
| `standalone` | `boolean` | Whether to display the agreement in standalone mode with a checkbox |

#### Usage

```tsx
import EWalletDataPrivacyAgreement from '@/components/EWalletDataPrivacyAgreement';

// As a link in a form
<EWalletDataPrivacyAgreement />

// As a standalone component with agreement checkbox
<EWalletDataPrivacyAgreement 
  standalone={true} 
  onAgree={() => console.log('User agreed')} 
/>
```

#### Features

- Includes all features of the standard DataPrivacyAgreement
- Contains e-wallet specific privacy information
- Supports standalone mode with agreement checkbox
- Provides callback function for integration with forms

### DataPrivacyFooter

The `DataPrivacyFooter` component displays privacy information in a footer format. It is used at the bottom of forms and pages to provide consistent privacy messaging.

#### Usage

```tsx
import DataPrivacyFooter from '@/components/DataPrivacyFooter';

// In your component
<DataPrivacyFooter />
```

#### Features

- Displays the Philippines Data Privacy Act logo
- Includes a compliance statement
- Provides links to Privacy Policy and Terms of Service
- Shows copyright information
- Creates a consistent privacy presence across the application

## Integration

### Registration Form

The data privacy components are integrated into the registration form to obtain user consent during account creation:

```tsx
<div className="mb-4">
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        id="privacyAgreed"
        name="privacyAgreed"
        type="checkbox"
        checked={privacyAgreed}
        onChange={handleChange}
        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
        required
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor="privacyAgreed" className="font-medium text-gray-700">
        I agree to the <DataPrivacyAgreement cooperativeName={config.name} />
      </label>
      <p className="text-xs text-gray-500 mt-1 flex items-center">
        <img 
          src="/images/ph-data-privacy-logo.svg" 
          alt="Philippines Data Privacy Act Logo" 
          className="h-4 w-4 mr-1"
        />
        In compliance with Republic Act No. 10173 - Data Privacy Act of 2012
      </p>
    </div>
  </div>
</div>
```

### E-Wallet Registration

The E-Wallet registration form includes a specialized version of the data privacy agreement:

```tsx
<div className="mb-4">
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        id="privacyAgreed"
        name="privacyAgreed"
        type="checkbox"
        checked={privacyAgreed}
        onChange={handleChange}
        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
        required
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor="privacyAgreed" className="font-medium text-gray-700">
        I agree to the <EWalletDataPrivacyAgreement />
      </label>
      <p className="text-xs text-gray-500 mt-1 flex items-center">
        <img 
          src="/images/ph-data-privacy-logo.svg" 
          alt="Philippines Data Privacy Act Logo" 
          className="h-4 w-4 mr-1"
        />
        In compliance with Republic Act No. 10173 - Data Privacy Act of 2012
      </p>
    </div>
  </div>
</div>
```

### Admin User Creation

The admin user creation form includes the data privacy agreement to ensure compliance when creating users:

```tsx
<div className="mb-4">
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        id="privacyAgreed"
        name="privacyAgreed"
        type="checkbox"
        checked={privacyAgreed}
        onChange={handleChange}
        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
        required
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor="privacyAgreed" className="font-medium text-gray-700">
        I confirm that this user's data is collected in accordance with the <DataPrivacyAgreement cooperativeName={config.name} />
      </label>
      <p className="text-xs text-gray-500 mt-1 flex items-center">
        <img 
          src="/images/ph-data-privacy-logo.svg" 
          alt="Philippines Data Privacy Act Logo" 
          className="h-4 w-4 mr-1"
        />
        In compliance with Republic Act No. 10173 - Data Privacy Act of 2012
      </p>
    </div>
  </div>
</div>
```

## Compliance

The data privacy components are designed to ensure compliance with the Philippines Data Privacy Act of 2012 (RA 10173). They provide:

1. **Clear Information**: Users are provided with clear information about how their data will be collected, used, and shared.
2. **Explicit Consent**: Users must explicitly consent to the data privacy agreement before creating an account or using the e-wallet.
3. **Accessibility**: The agreement is presented in a user-friendly format with clear headings and sections.
4. **Visual Indicators**: The Philippines Data Privacy Act logo provides a visual indicator of compliance.
5. **Consistent Messaging**: The DataPrivacyFooter ensures consistent privacy messaging throughout the application.

## Testing

The data privacy components include comprehensive unit tests to ensure they function correctly:

### DataPrivacyAgreement Tests

- Renders the button to open the agreement
- Opens the modal when the button is clicked
- Displays the cooperative name in the agreement
- Closes the modal when the close button is clicked
- Displays the Philippines Data Privacy Act logo
- Displays the compliance statement

### EWalletDataPrivacyAgreement Tests

- Renders the button to open the agreement
- Opens the modal when the button is clicked
- Displays the e-wallet name in the agreement
- Closes the modal when the close button is clicked
- Displays the Philippines Data Privacy Act logo
- Displays the compliance statement
- Calls the onAgree callback when the agree button is clicked in standalone mode
- Disables the agree button when the checkbox is not checked in standalone mode

### DataPrivacyFooter Tests

- Renders the footer with the cooperative name
- Displays the Philippines Data Privacy Act logo
- Includes links to privacy policy and terms of service
- Displays the current year in the copyright notice
