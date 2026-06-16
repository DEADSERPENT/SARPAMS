import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AnimalList from './pages/AnimalList';
import CageList from './pages/CageList';
import ShelterList from './pages/ShelterList';
import RescuerList from './pages/RescuerList';
import RescueRequestList from './pages/RescueRequestList';
import VeterinarianList from './pages/VeterinarianList';
import MedicalRecordList from './pages/MedicalRecordList';
import FosterFamilyList from './pages/FosterFamilyList';
import FosterPlacementList from './pages/FosterPlacementList';
import AdoptionApplicantList from './pages/AdoptionApplicantList';
import AdoptionList from './pages/AdoptionList';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/animals" element={<AnimalList />} />
        <Route path="/cages" element={<CageList />} />
        <Route path="/shelters" element={<ShelterList />} />
        <Route path="/rescuers" element={<RescuerList />} />
        <Route path="/rescue-requests" element={<RescueRequestList />} />
        <Route path="/veterinarians" element={<VeterinarianList />} />
        <Route path="/medical-records" element={<MedicalRecordList />} />
        <Route path="/foster-families" element={<FosterFamilyList />} />
        <Route path="/foster-placements" element={<FosterPlacementList />} />
        <Route path="/adoption-applicants" element={<AdoptionApplicantList />} />
        <Route path="/adoptions" element={<AdoptionList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
