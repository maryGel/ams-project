// services/evaluationService.js
import axios from 'axios';



export const evaluateJO = async (JO_No, selectedItems, eval_status, eval_remarks, userInfo) => {
  try {
    // selectedItems already contains the simplified structure
    const response = await axios.put(`/jo_evalRoute/evaluate/${encodeURIComponent(JO_No)}`, {
      selectedItems: selectedItems, // Already in correct format
      eval_status,
      eval_remarks,
      userInfo
    });

    return response.data;
  } catch (error) {
    console.error('Error evaluating JO:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to evaluate JO');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Failed to evaluate JO');
    }
  }
};

export const getJOEvaluationStatus = async (JO_No) => {
  try {
    const response = await axios.get(`/jo_evalRoute/status/${encodeURIComponent(JO_No)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching evaluation status:', error);
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch evaluation status');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'Failed to fetch evaluation status');
    }
  }
};