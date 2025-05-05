import api from './api';

/**
 * Get all Damayan funds
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - List of funds
 */
export const getAllDamayanFunds = async (params = {}) => {
  try {
    const response = await api.get('/damayan/funds', { params });
    return response.data.data.funds;
  } catch (error) {
    console.error('Error fetching Damayan funds:', error);
    throw error;
  }
};

/**
 * Get Damayan fund by ID
 * @param {number} id - Fund ID
 * @returns {Promise<Object>} - Fund details
 */
export const getDamayanFundById = async (id) => {
  try {
    const response = await api.get(`/damayan/funds/${id}`);
    return response.data.data.fund;
  } catch (error) {
    console.error('Error fetching Damayan fund:', error);
    throw error;
  }
};

/**
 * Get Damayan fund statistics
 * @param {number} fundId - Fund ID
 * @returns {Promise<Object>} - Fund statistics
 */
export const fetchDamayanFundStatistics = async (fundId) => {
  try {
    const response = await api.get(`/damayan/funds/${fundId}/statistics`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Damayan fund statistics:', error);
    throw error;
  }
};

/**
 * Make a contribution to Damayan fund
 * @param {Object} contributionData - Contribution data
 * @returns {Promise<Object>} - Created contribution
 */
export const makeContribution = async (contributionData) => {
  try {
    const response = await api.post('/damayan/contributions', contributionData);
    return response.data.data.contribution;
  } catch (error) {
    console.error('Error making Damayan contribution:', error);
    throw error;
  }
};

/**
 * Get user's contributions
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - List of contributions
 */
export const fetchUserContributions = async (userId) => {
  try {
    const response = await api.get(`/damayan/users/${userId}/contributions`);
    return response.data.data.contributions;
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    throw error;
  }
};

/**
 * Get fund contributions
 * @param {number} fundId - Fund ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Contributions with pagination
 */
export const fetchFundContributions = async (fundId, params = {}) => {
  try {
    const response = await api.get(`/damayan/funds/${fundId}/contributions`, { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching fund contributions:', error);
    throw error;
  }
};

/**
 * Request assistance from Damayan fund
 * @param {Object} requestData - Assistance request data
 * @returns {Promise<Object>} - Created assistance request
 */
export const requestAssistance = async (requestData) => {
  try {
    const response = await api.post('/damayan/assistance', requestData);
    return response.data.data.assistanceRequest;
  } catch (error) {
    console.error('Error requesting Damayan assistance:', error);
    throw error;
  }
};

/**
 * Get user's assistance requests
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - List of assistance requests
 */
export const fetchUserAssistanceRequests = async (userId) => {
  try {
    const response = await api.get(`/damayan/users/${userId}/assistance`);
    return response.data.data.requests;
  } catch (error) {
    console.error('Error fetching user assistance requests:', error);
    throw error;
  }
};

/**
 * Get pending assistance requests
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Requests with pagination
 */
export const fetchPendingAssistanceRequests = async (params = {}) => {
  try {
    const response = await api.get('/damayan/assistance/pending', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching pending assistance requests:', error);
    throw error;
  }
};

/**
 * Review assistance request
 * @param {number} requestId - Request ID
 * @param {Object} reviewData - Review data
 * @returns {Promise<Object>} - Updated assistance request
 */
export const reviewAssistanceRequest = async (requestId, reviewData) => {
  try {
    const response = await api.put(`/damayan/assistance/${requestId}/review`, reviewData);
    return response.data.data.assistanceRequest;
  } catch (error) {
    console.error('Error reviewing assistance request:', error);
    throw error;
  }
};

/**
 * Disburse approved assistance
 * @param {number} requestId - Request ID
 * @param {Object} disbursementData - Disbursement data
 * @returns {Promise<Object>} - Updated assistance request
 */
export const disburseAssistance = async (requestId, disbursementData) => {
  try {
    const response = await api.put(`/damayan/assistance/${requestId}/disburse`, disbursementData);
    return response.data.data.assistanceRequest;
  } catch (error) {
    console.error('Error disbursing assistance:', error);
    throw error;
  }
};

/**
 * Get user's Damayan summary
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - User's Damayan summary
 */
export const fetchUserDamayanSummary = async (userId) => {
  try {
    const response = await api.get(`/damayan/users/${userId}/summary`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user Damayan summary:', error);
    throw error;
  }
};

/**
 * Get user's Damayan settings
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - User's Damayan settings
 */
export const getUserDamayanSettings = async (userId) => {
  try {
    const response = await api.get(`/damayan/users/${userId}/settings`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user Damayan settings:', error);
    throw error;
  }
};

/**
 * Update user's Damayan settings
 * @param {number} userId - User ID
 * @param {Object} settingsData - Settings data
 * @returns {Promise<Object>} - Updated settings
 */
export const updateUserDamayanSettings = async (userId, settingsData) => {
  try {
    const response = await api.put(`/damayan/users/${userId}/settings`, settingsData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user Damayan settings:', error);
    throw error;
  }
};

/**
 * Generate Damayan report
 * @param {Object} params - Report parameters
 * @returns {Promise<Object>} - Report data
 */
export const generateDamayanReport = async (params) => {
  try {
    const response = await api.get('/damayan/reports/generate', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error generating Damayan report:', error);
    throw error;
  }
};

/**
 * Fetch member participation data for a fund
 * @param {number} fundId - Fund ID
 * @returns {Promise<Object>} - Member participation data
 */
export const fetchMemberParticipation = async (fundId) => {
  try {
    const response = await api.get(`/damayan/funds/${fundId}/members`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching member participation:', error);
    throw error;
  }
};
