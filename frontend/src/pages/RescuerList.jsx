import React, { useEffect, useState } from 'react';
import { rescuersApi } from '../api/client';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = {
  first_name: '', last_name: '', phone: '', email: '',
  zone_area: '', certification_level: 'Basic', is_available: true, join_date: ''
};

export default function RescuerList() {
  const [rescuers, setRescuers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    rescuersApi.getAll()
      .then(setRescuers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({
      first_name: r.first_name, last_name: r.last_name, phone: r.phone, email: r.email || '',
      zone_area: r.zone_area, certification_level: r.certification_level, is_available: !!r.is_available, join_date: r.join_date
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, email: form.email || null };
      if (editing) await rescuersApi.update(editing.rescuer_id, payload);
      else await rescuersApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this rescuer?')) return;
    try { await rescuersApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Rescuers</h1>
          <p>{rescuers.length} rescuers registered</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Rescuer</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Name', 'Phone', 'Email', 'Zone Area', 'Certification', 'Available', 'Join Date', 'Actions']}>
          {rescuers.map(r => (
            <tr key={r.rescuer_id}>
              <td className="muted">{r.rescuer_id}</td>
              <td><strong>{r.first_name} {r.last_name}</strong></td>
              <td className="muted">{r.phone}</td>
              <td className="muted">{r.email || '—'}</td>
              <td>{r.zone_area}</td>
              <td><Badge value={r.certification_level} /></td>
              <td><Badge value={r.is_available ? 'Available' : 'Unavailable'} /></td>
              <td className="muted">{r.join_date}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.rescuer_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Rescuer' : 'Add Rescuer'}
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
              <FormField label="First Name" required>
                <input name="first_name" value={form.first_name} onChange={handleChange} required />
              </FormField>
              <FormField label="Last Name" required>
                <input name="last_name" value={form.last_name} onChange={handleChange} required />
              </FormField>
              <FormField label="Phone" required>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="e.g. 9876543210" />
              </FormField>
              <FormField label="Email">
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rescuer@example.com" />
              </FormField>
              <FormField label="Zone Area" required>
                <input name="zone_area" value={form.zone_area} onChange={handleChange} required placeholder="e.g. North Bengaluru" />
              </FormField>
              <FormField label="Certification Level" required>
                <select name="certification_level" value={form.certification_level} onChange={handleChange}>
                  <option>Basic</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </FormField>
              <FormField label="Join Date" required>
                <input name="join_date" type="date" value={form.join_date} onChange={handleChange} required />
              </FormField>
              <FormField label="Availability">
                <div className="checkbox-row">
                  <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} id="avail" />
                  <label htmlFor="avail">Currently Available</label>
                </div>
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
