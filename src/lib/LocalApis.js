// Chat endpoints

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://74.225.157.233:8001',
});

export const createContext = async (
  maxMessages = 50,
  autoSummarize = false,
  summaryThreshold = 30,
) => {
  const response = await axiosInstance.post('/context/create', {
    max_messages: maxMessages,
    auto_summarize: autoSummarize,
    summary_threshold: summaryThreshold,
  });
  return response.data;
};

export const getContext = async contextId => {
  const response = await axiosInstance.get(`/context/${contextId}`);
  return response.data;
};

export const listContexts = async () => {
  const response = await axiosInstance.get('/context');
  return response.data;
};

export const deleteContext = async contextId => {
  const response = await axiosInstance.delete(`/context/${contextId}`);
  return response.data;
};

export const clearContext = async contextId => {
  const response = await axiosInstance.post(`/context/${contextId}/clear`);
  return response.data;
};

export const cleanupOldContexts = async () => {
  const response = await axiosInstance.post('/context/cleanup');
  return response.data;
};

export const sendChatMessage = async (contextId, messages) => {
  if (!contextId) {
    throw new Error('Context ID is required for chat messages');
  }
  const response = await axiosInstance.post(`/context/${contextId}/chat`, {
    messages,
  });
  return response.data;
};

// OCR endpoints
export const extractMedicines = async formData => {
  try {
    console.log('Sending prescription image to OCR service...');
    const response = await axiosInstance.post(
      '/ocr/extract-medicines',
      formData,
      {
        headers: {
          Accept: 'application/json',
          // Don't set Content-Type, let the browser set it with the correct boundary
        },
        // Ensure proper handling of FormData
        transformRequest: [data => data],
      },
    );
    console.log('OCR service response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in extractMedicines:', error);
    // throw error;
  }
};

// Model endpoints
export const getModelInfo = async () => {
  const response = await axiosInstance.get('/model/info');
  return response.data;
};

export const loadModel = async ({
  modelPath = 'models/llama.gguf',
  nCtx = 2048,
  nThreads = 4,
  nGpuLayers = 0,
  verbose = true,
  systemPrompt = 'You are a helpful assistant.',
} = {}) => {
  try {
    const response = await axiosInstance.post('/model/load', {
      model_path: '',
    });
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const unloadModel = async () => {
  const response = await axiosInstance.post('/model/unload');
  return response.data;
};
