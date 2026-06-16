import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../api/client';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import {
  PawPrint, Building2, ShieldCheck, Stethoscope,
  Home, HeartHandshake, Siren, FileHeart
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi.get()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-state">
      <div className="spinner" />
      <span>Loading dashboard...</span>
    </div>
  );

  if (error) return <div className="error-state">Error: {error}</div>;

  const { stats, recentAnimals, recentRescues, shelterOccupancy } = data;

  const statCards = [
    { icon: PawPrint,       value: stats.totalAnimals,        label: 'Total Animals',       color: 'navy' },
    { icon: Building2,      value: stats.totalShelters,       label: 'Shelters',            color: 'sky' },
    { icon: ShieldCheck,    value: stats.totalRescuers,       label: 'Rescuers',            color: 'green' },
    { icon: Stethoscope,    value: stats.totalVets,           label: 'Veterinarians',       color: 'purple' },
    { icon: Home,           value: stats.totalFosterFamilies, label: 'Foster Families',     color: 'orange' },
    { icon: HeartHandshake, value: stats.totalAdoptions,      label: 'Total Adoptions',     color: 'pink' },
    { icon: Siren,          value: stats.openRequests,        label: 'Open Rescue Requests',color: 'red' },
    { icon: FileHeart,      value: stats.totalMedicalRecords, label: 'Medical Records',     color: 'teal' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to SARPAMS — Stray Animals Rescue &amp; Pet Adoption Management System</p>
        </div>
      </div>

      <div className="stat-grid">
        {statCards.map((sc, i) => (
          <StatCard key={i} icon={sc.icon} value={sc.value} label={sc.label} colorClass={sc.color} />
        ))}
      </div>

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Recent Animals */}
          <div className="card">
            <div className="card-header">
              <h2>Recent Animals</h2>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Species</th>
                    <th>Breed</th>
                    <th>Health</th>
                    <th>Intake Date</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnimals.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No animals yet</td></tr>
                  ) : recentAnimals.map(a => (
                    <tr key={a.animal_id}>
                      <td><strong>{a.name}</strong></td>
                      <td>{a.species}</td>
                      <td className="muted">{a.breed || '—'}</td>
                      <td><Badge value={a.health_status} /></td>
                      <td className="muted">{a.intake_date}</td>
                      <td className="muted">
                        {a.Cage?.Shelter?.shelter_name || '—'}
                        {a.Cage ? ` / ${a.Cage.cage_number}` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Rescue Requests */}
          <div className="card">
            <div className="card-header">
              <h2>Recent Rescue Requests</h2>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Citizen</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Rescuer</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRescues.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>No requests yet</td></tr>
                  ) : recentRescues.map(r => (
                    <tr key={r.request_id}>
                      <td><strong>{r.citizen_name}</strong></td>
                      <td className="muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.location_address}</td>
                      <td><Badge value={r.status} /></td>
                      <td className="muted">{r.report_date}</td>
                      <td className="muted">
                        {r.Rescuer ? `${r.Rescuer.first_name} ${r.Rescuer.last_name}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Shelter Occupancy */}
        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header">
            <h2>Shelter Occupancy</h2>
          </div>
          <div className="card-body">
            {shelterOccupancy.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No shelters yet</p>
            ) : shelterOccupancy.map(s => {
              const pct = s.occupancy_pct;
              const fillClass = pct >= 80 ? 'high' : pct >= 50 ? 'medium' : 'low';
              return (
                <div key={s.shelter_id} className="occupancy-item">
                  <div className="occupancy-label">
                    <span>{s.shelter_name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{s.occupied_cages}/{s.total_cages} cages ({pct}%)</span>
                  </div>
                  <div className="occupancy-bar">
                    <div className={`occupancy-fill ${fillClass}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
