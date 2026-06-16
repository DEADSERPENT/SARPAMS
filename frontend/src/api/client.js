import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Generic CRUD factory
function resource(path) {
  return {
    getAll: () => api.get(`/${path}`).then(r => r.data),
    getOne: (id) => api.get(`/${path}/${id}`).then(r => r.data),
    create: (data) => api.post(`/${path}`, data).then(r => r.data),
    update: (id, data) => api.put(`/${path}/${id}`, data).then(r => r.data),
    remove: (id) => api.delete(`/${path}/${id}`).then(r => r.data)
  };
}

export const dashboardApi = {
  get: () => api.get('/dashboard').then(r => r.data)
};

export const sheltersApi = resource('shelters');
export const cagesApi = resource('cages');
export const animalsApi = resource('animals');
export const rescuersApi = resource('rescuers');
export const rescueRequestsApi = resource('rescue-requests');
export const veterinariansApi = resource('veterinarians');
export const medicalRecordsApi = resource('medical-records');
export const fosterFamiliesApi = resource('foster-families');
export const fosterPlacementsApi = resource('foster-placements');
export const adoptionApplicantsApi = resource('adoption-applicants');
export const adoptionsApi = resource('adoptions');

export default api;
