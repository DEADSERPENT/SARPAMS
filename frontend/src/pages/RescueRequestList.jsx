import React, { useEffect, useState } from 'react';
import { rescueRequestsApi, rescuersApi, animalsApi } from '../api/client';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = {
  report_date: '', report_time: '', location_address: '',
  latitude: '', longitude: '', status: 'Open',
  citizen_name: '', citizen_phone: '', rescuer_id: '', animal_id: ''
};

export default function RescueRequestList() {
  const [requests, setRequests] = useState([]);
  const [rescuers, setRescuers] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([rescueRequestsApi.getAll(), rescuersApi.getAll(), animalsApi.getAll()])
      .then(([r, res, an]) => { setRequests(r); setRescuers(res); setAnimals(an); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({
      report_date: r.report_date, report_time: r.report_time, location_address: r.location_address,
      latitude: r.latitude || '', longitude: r.longitude || '', status: r.status,
      citizen_name: r.citizen_name, citizen_phone: r.citizen_phone,
      rescuer_id: r.rescuer_id || '', animal_id: r.animal_id || ''
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        latitude: form.latitude !== '' ? parseFloat(form.latitude) : null,
        longitude: form.longitude !== '' ? parseFloat(form.longitude) : null,
        rescuer_id: form.rescuer_id !== '' ? parseInt(form.rescuer_id) : null,
        animal_id: form.animal_id !== '' ? parseInt(form.animal_id) : null
      };
      if (editing) await rescueRequestsApi.update(editing.request_id, payload);
      else await rescueRequestsApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this rescue request?')) return;
    try { await rescueRequestsApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Rescue Requests</h1>
          <p>{requests.length} requests total</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Request</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Citizen', 'Phone', 'Location', 'Date', 'Time', 'Status', 'Rescuer', 'Animal', 'Actions']}>
          {requests.map(r => (
            <tr key={r.request_id}>
              <td className="muted">{r.request_id}</td>
              <td><strong>{r.citizen_name}</strong></td>
              <td className="muted">{r.citizen_phone}</td>
              <td className="muted" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.location_address}</td>
              <td className="muted">{r.report_date}</td>
              <td className="muted">{r.report_time}</td>
              <td><Badge value={r.status} /></td>
              <td className="muted">{r.Rescuer ? `${r.Rescuer.first_name} ${r.Rescuer.last_name}` : '—'}</td>
              <td className="muted">{r.Animal ? r.Animal.name : '—'}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.request_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Rescue Request' : 'New Rescue Request'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </>
          }
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormField label="Citizen Name" required>
                <input name="citizen_name" value={form.citizen_name} onChange={handleChange} required />
              </FormField>
              <FormField label="Citizen Phone" required>
                <input name="citizen_phone" value={form.citizen_phone} onChange={handleChange} required placeholder="e.g. 9900123456" />
              </FormField>
              <FormField label="Report Date" required>
                <input name="report_date" type="date" value={form.report_date} onChange={handleChange} required />
              </FormField>
              <FormField label="Report Time" required>
                <input name="report_time" type="time" value={form.report_time} onChange={handleChange} required />
              </FormField>
              <FormField label="Location Address" required className="full-width">
                <input name="location_address" value={form.location_address} onChange={handleChange} required placeholder="Full address" />
              </FormField>
              <FormField label="Latitude">
                <input name="latitude" type="number" step="0.000001" value={form.latitude} onChange={handleChange} placeholder="e.g. 12.9716" />
              </FormField>
              <FormField label="Longitude">
                <input name="longitude" type="number" step="0.000001" value={form.longitude} onChange={handleChange} placeholder="e.g. 77.5946" />
              </FormField>
              <FormField label="Status" required>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option>Open</option>
                  <option>Assigned</option>
                  <option>Closed</option>
                </select>
              </FormField>
              <FormField label="Assign Rescuer">
                <select name="rescuer_id" value={form.rescuer_id} onChange={handleChange}>
                  <option value="">— Unassigned —</option>
                  {rescuers.map(r => <option key={r.rescuer_id} value={r.rescuer_id}>{r.first_name} {r.last_name}</option>)}
                </select>
              </FormField>
              <FormField label="Link Animal">
                <select name="animal_id" value={form.animal_id} onChange={handleChange}>
                  <option value="">— None —</option>
                  {animals.map(a => <option key={a.animal_id} value={a.animal_id}>{a.name} ({a.species})</option>)}
                </select>
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
