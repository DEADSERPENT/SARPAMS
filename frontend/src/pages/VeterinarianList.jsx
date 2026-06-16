import React, { useEffect, useState } from 'react';
import { veterinariansApi } from '../api/client';
import Modal from '../components/Modal';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = { first_name: '', last_name: '', specialisation: '', phone: '', email: '', license_no: '' };

export default function VeterinarianList() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    veterinariansApi.getAll()
      .then(setVets)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (v) => {
    setEditing(v);
    setForm({ first_name: v.first_name, last_name: v.last_name, specialisation: v.specialisation || '', phone: v.phone, email: v.email || '', license_no: v.license_no });
    setShowModal(true);
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, email: form.email || null };
      if (editing) await veterinariansApi.update(editing.vet_id, payload);
      else await veterinariansApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this veterinarian?')) return;
    try { await veterinariansApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Veterinarians</h1>
          <p>{vets.length} veterinarians registered</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Veterinarian</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Name', 'Specialisation', 'Phone', 'Email', 'License No.', 'Actions']}>
          {vets.map(v => (
            <tr key={v.vet_id}>
              <td className="muted">{v.vet_id}</td>
              <td><strong>{v.first_name} {v.last_name}</strong></td>
              <td>{v.specialisation || '—'}</td>
              <td className="muted">{v.phone}</td>
              <td className="muted">{v.email || '—'}</td>
              <td className="muted">{v.license_no}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(v)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.vet_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Veterinarian' : 'Add Veterinarian'}
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
                <input name="first_name" value={form.first_name} onChange={handleChange} required placeholder="e.g. Dr. Anil" />
              </FormField>
              <FormField label="Last Name" required>
                <input name="last_name" value={form.last_name} onChange={handleChange} required />
              </FormField>
              <FormField label="Specialisation">
                <input name="specialisation" value={form.specialisation} onChange={handleChange} placeholder="e.g. Small Animals" />
              </FormField>
              <FormField label="Phone" required>
                <input name="phone" value={form.phone} onChange={handleChange} required placeholder="e.g. 9811234567" />
              </FormField>
              <FormField label="Email">
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </FormField>
              <FormField label="License No." required>
                <input name="license_no" value={form.license_no} onChange={handleChange} required placeholder="e.g. VET-KA-001" />
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
