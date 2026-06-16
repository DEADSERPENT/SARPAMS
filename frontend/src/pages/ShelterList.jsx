import React, { useEffect, useState } from 'react';
import { sheltersApi } from '../api/client';
import Modal from '../components/Modal';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = { shelter_name: '', address: '', city: '', capacity: '', contact_phone: '', manager_name: '' };

export default function ShelterList() {
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    sheltersApi.getAll()
      .then(setShelters)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ shelter_name: s.shelter_name, address: s.address, city: s.city, capacity: s.capacity, contact_phone: s.contact_phone, manager_name: s.manager_name });
    setShowModal(true);
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, capacity: parseInt(form.capacity) };
      if (editing) await sheltersApi.update(editing.shelter_id, payload);
      else await sheltersApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this shelter?')) return;
    try { await sheltersApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Shelters</h1>
          <p>{shelters.length} shelters registered</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Shelter</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Shelter Name', 'Address', 'City', 'Capacity', 'Phone', 'Manager', 'Actions']}>
          {shelters.map(s => (
            <tr key={s.shelter_id}>
              <td className="muted">{s.shelter_id}</td>
              <td><strong>{s.shelter_name}</strong></td>
              <td className="muted">{s.address}</td>
              <td>{s.city}</td>
              <td>{s.capacity}</td>
              <td className="muted">{s.contact_phone}</td>
              <td>{s.manager_name}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.shelter_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Shelter' : 'Add Shelter'}
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
              <FormField label="Shelter Name" required className="full-width">
                <input name="shelter_name" value={form.shelter_name} onChange={handleChange} required placeholder="e.g. Happy Paws Shelter" />
              </FormField>
              <FormField label="Address" required className="full-width">
                <input name="address" value={form.address} onChange={handleChange} required placeholder="Street address" />
              </FormField>
              <FormField label="City" required>
                <input name="city" value={form.city} onChange={handleChange} required placeholder="e.g. Bengaluru" />
              </FormField>
              <FormField label="Capacity" required>
                <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} required placeholder="e.g. 80" />
              </FormField>
              <FormField label="Contact Phone" required>
                <input name="contact_phone" value={form.contact_phone} onChange={handleChange} required placeholder="e.g. 080-12345678" />
              </FormField>
              <FormField label="Manager Name" required>
                <input name="manager_name" value={form.manager_name} onChange={handleChange} required placeholder="e.g. Ravi Kumar" />
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
