import React, { useEffect, useState } from 'react';
import { adoptionApplicantsApi } from '../api/client';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = {
  first_name: '', last_name: '', dob: '', address: '', city: '',
  phone: '', email: '', occupation: '', has_previous_pets: false, living_situation: ''
};

export default function AdoptionApplicantList() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adoptionApplicantsApi.getAll()
      .then(setApplicants)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({
      first_name: a.first_name, last_name: a.last_name, dob: a.dob || '', address: a.address, city: a.city,
      phone: a.phone, email: a.email || '', occupation: a.occupation || '',
      has_previous_pets: !!a.has_previous_pets, living_situation: a.living_situation || ''
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
      const payload = { ...form, email: form.email || null, dob: form.dob || null };
      if (editing) await adoptionApplicantsApi.update(editing.applicant_id, payload);
      else await adoptionApplicantsApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this applicant?')) return;
    try { await adoptionApplicantsApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Adoption Applicants</h1>
          <p>{applicants.length} applicants registered</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Applicant</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Name', 'City', 'Phone', 'Occupation', 'Previous Pets', 'Living Situation', 'Actions']}>
          {applicants.map(a => (
            <tr key={a.applicant_id}>
              <td className="muted">{a.applicant_id}</td>
              <td><strong>{a.first_name} {a.last_name}</strong></td>
              <td>{a.city}</td>
              <td className="muted">{a.phone}</td>
              <td className="muted">{a.occupation || '—'}</td>
              <td><Badge value={a.has_previous_pets ? 'Yes' : 'No'} /></td>
              <td className="muted">{a.living_situation || '—'}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.applicant_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Applicant' : 'Add Applicant'}
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
              <FormField label="Date of Birth">
                <input name="dob" type="date" value={form.dob} onChange={handleChange} />
              </FormField>
              <FormField label="Phone" required>
                <input name="phone" value={form.phone} onChange={handleChange} required />
              </FormField>
              <FormField label="Email">
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </FormField>
              <FormField label="Occupation">
                <input name="occupation" value={form.occupation} onChange={handleChange} placeholder="e.g. Software Engineer" />
              </FormField>
              <FormField label="City" required>
                <input name="city" value={form.city} onChange={handleChange} required />
              </FormField>
              <FormField label="Living Situation">
                <input name="living_situation" value={form.living_situation} onChange={handleChange} placeholder="e.g. Independent House" />
              </FormField>
              <FormField label="Address" required className="full-width">
                <input name="address" value={form.address} onChange={handleChange} required />
              </FormField>
              <FormField label="Options">
                <div className="checkbox-row">
                  <input type="checkbox" name="has_previous_pets" checked={form.has_previous_pets} onChange={handleChange} id="prevPets" />
                  <label htmlFor="prevPets">Has Previously Owned Pets</label>
                </div>
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
