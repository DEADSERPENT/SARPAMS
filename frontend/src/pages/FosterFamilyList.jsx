import React, { useEffect, useState } from 'react';
import { fosterFamiliesApi } from '../api/client';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = {
  family_name: '', address: '', city: '', phone: '', email: '',
  house_type: '', has_other_pets: false, is_approved: false, approval_date: ''
};

export default function FosterFamilyList() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fosterFamiliesApi.getAll()
      .then(setFamilies)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (f) => {
    setEditing(f);
    setForm({
      family_name: f.family_name, address: f.address, city: f.city, phone: f.phone, email: f.email || '',
      house_type: f.house_type || '', has_other_pets: !!f.has_other_pets, is_approved: !!f.is_approved,
      approval_date: f.approval_date || ''
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, email: form.email || null, approval_date: form.approval_date || null };
      if (editing) await fosterFamiliesApi.update(editing.foster_id, payload);
      else await fosterFamiliesApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this foster family?')) return;
    try { await fosterFamiliesApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Foster Families</h1>
          <p>{families.length} families registered</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Family</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Family Name', 'City', 'Phone', 'House Type', 'Has Pets', 'Approved', 'Approval Date', 'Actions']}>
          {families.map(f => (
            <tr key={f.foster_id}>
              <td className="muted">{f.foster_id}</td>
              <td><strong>{f.family_name}</strong></td>
              <td>{f.city}</td>
              <td className="muted">{f.phone}</td>
              <td className="muted">{f.house_type || '—'}</td>
              <td><Badge value={f.has_other_pets ? 'Yes' : 'No'} /></td>
              <td><Badge value={f.is_approved ? 'Approved' : 'Pending'} /></td>
              <td className="muted">{f.approval_date || '—'}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(f)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.foster_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Foster Family' : 'Add Foster Family'}
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
              <FormField label="Family Name" required className="full-width">
                <input name="family_name" value={form.family_name} onChange={handleChange} required />
              </FormField>
              <FormField label="Address" required className="full-width">
                <input name="address" value={form.address} onChange={handleChange} required />
              </FormField>
              <FormField label="City" required>
                <input name="city" value={form.city} onChange={handleChange} required />
              </FormField>
              <FormField label="Phone" required>
                <input name="phone" value={form.phone} onChange={handleChange} required />
              </FormField>
              <FormField label="Email">
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </FormField>
              <FormField label="House Type">
                <input name="house_type" value={form.house_type} onChange={handleChange} placeholder="e.g. Apartment" />
              </FormField>
              <FormField label="Approval Date">
                <input name="approval_date" type="date" value={form.approval_date} onChange={handleChange} />
              </FormField>
              <FormField label="Options">
                <div className="checkbox-row">
                  <input type="checkbox" name="has_other_pets" checked={form.has_other_pets} onChange={handleChange} id="hasPets" />
                  <label htmlFor="hasPets">Has Other Pets</label>
                </div>
                <div className="checkbox-row">
                  <input type="checkbox" name="is_approved" checked={form.is_approved} onChange={handleChange} id="isApproved" />
                  <label htmlFor="isApproved">Approved</label>
                </div>
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
