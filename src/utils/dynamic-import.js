/**
 * Dynamic Import Utility for Code Splitting
 * 
 * This utility provides functions for dynamically importing components
 * and modules to enable code splitting and lazy loading.
 */

import React, { lazy, Suspense } from 'react';

/**
 * Create a lazy-loaded component with a loading fallback
 * @param {Function} importFunc - Dynamic import function
 * @param {React.Component} [LoadingComponent] - Component to show while loading
 * @returns {React.Component} - Lazy-loaded component with Suspense
 */
export const lazyLoad = (importFunc, LoadingComponent = null) => {
  const LazyComponent = lazy(importFunc);
  
  // Default loading component if none provided
  const DefaultLoading = () => (
    <div className="lazy-loading">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
  
  const FallbackComponent = LoadingComponent || DefaultLoading;
  
  return props => (
    <Suspense fallback={<FallbackComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Preload a component or module
 * @param {Function} importFunc - Dynamic import function
 * @returns {Promise} - Promise that resolves when the module is loaded
 */
export const preload = importFunc => {
  return importFunc();
};

/**
 * Create a route configuration with lazy loading
 * @param {string} path - Route path
 * @param {Function} importFunc - Dynamic import function for the component
 * @param {Object} [options={}] - Additional route options
 * @returns {Object} - Route configuration object
 */
export const lazyRoute = (path, importFunc, options = {}) => {
  return {
    path,
    element: lazyLoad(importFunc, options.loading),
    ...options
  };
};

/**
 * Dynamically import multiple modules in parallel
 * @param {Object} imports - Object with keys as module names and values as import functions
 * @returns {Promise<Object>} - Promise that resolves to an object with the loaded modules
 */
export const importMultiple = async (imports) => {
  const keys = Object.keys(imports);
  const importPromises = keys.map(key => imports[key]());
  
  const modules = await Promise.all(importPromises);
  
  return keys.reduce((acc, key, index) => {
    acc[key] = modules[index].default || modules[index];
    return acc;
  }, {});
};

/**
 * Create a component that dynamically loads based on a condition
 * @param {Function} condition - Function that returns true/false to determine which component to load
 * @param {Function} trueImport - Import function for the component to load when condition is true
 * @param {Function} falseImport - Import function for the component to load when condition is false
 * @param {React.Component} [LoadingComponent] - Component to show while loading
 * @returns {React.Component} - Component that dynamically loads based on condition
 */
export const conditionalLoad = (condition, trueImport, falseImport, LoadingComponent = null) => {
  return props => {
    const shouldLoadTrue = condition(props);
    const importFunc = shouldLoadTrue ? trueImport : falseImport;
    const LazyComponent = lazyLoad(importFunc, LoadingComponent);
    
    return <LazyComponent {...props} />;
  };
};

/**
 * Create a component that dynamically loads based on a feature flag
 * @param {string} featureFlag - Name of the feature flag
 * @param {Function} enabledImport - Import function for the component when feature is enabled
 * @param {Function} disabledImport - Import function for the component when feature is disabled
 * @param {Object} [featureFlags={}] - Object containing feature flags
 * @returns {React.Component} - Component that dynamically loads based on feature flag
 */
export const featureFlagLoad = (featureFlag, enabledImport, disabledImport, featureFlags = {}) => {
  return conditionalLoad(
    () => featureFlags[featureFlag] === true,
    enabledImport,
    disabledImport
  );
};

/**
 * Create a component that dynamically loads based on user role
 * @param {string[]} allowedRoles - Array of roles that can access the component
 * @param {Function} authorizedImport - Import function for the component when user is authorized
 * @param {Function} unauthorizedImport - Import function for the component when user is unauthorized
 * @returns {React.Component} - Component that dynamically loads based on user role
 */
export const roleBasedLoad = (allowedRoles, authorizedImport, unauthorizedImport) => {
  return props => {
    const { user } = props;
    const isAuthorized = user && allowedRoles.includes(user.role);
    
    return conditionalLoad(
      () => isAuthorized,
      authorizedImport,
      unauthorizedImport
    )(props);
  };
};
