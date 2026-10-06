const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch wrapper with timeout & error handling
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `HTTP ${res.status}: API Request Failed`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API SERVICE] Connection to ${url} failed:`, err.message);
    throw err;
  }
}

// Health Check
export async function checkHealthApi() {
  return request('/health');
}

// Get all experiments from MongoDB
export async function fetchExperimentsApi() {
  const res = await request('/experiments');
  return res.data || [];
}

// Get single experiment
export async function getExperimentByIdApi(id) {
  const res = await request(`/experiments/${id}`);
  return res.data;
}

// Create new experiment
export async function createExperimentApi(expData) {
  const res = await request('/experiments', {
    method: 'POST',
    body: JSON.stringify(expData)
  });
  return res.data;
}

// Update existing experiment
export async function updateExperimentApi(id, expData) {
  const res = await request(`/experiments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(expData)
  });
  return res.data;
}

// Delete experiment
export async function deleteExperimentApi(id) {
  return request(`/experiments/${id}`, {
    method: 'DELETE'
  });
}

// Delete sub-experiment
export async function deleteSubExperimentApi(id, subId) {
  const res = await request(`/experiments/${id}/sub/${subId}`, {
    method: 'DELETE'
  });
  return res.data;
}

// Batch migrate local custom experiments to MongoDB
export async function migrateLocalExperimentsApi(localList) {
  return request('/experiments/batch-migrate', {
    method: 'POST',
    body: JSON.stringify({ localExperiments: localList })
  });
}
