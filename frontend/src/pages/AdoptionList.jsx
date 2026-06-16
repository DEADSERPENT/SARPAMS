import React, { useEffect, useState } from 'react';
import { adoptionsApi, animalsApi, adoptionApplicantsApi, rescuersApi } from '../api/client';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = {
  animal_id: '', applicant_id: '', officer_id: '', application_date: '',
  approval_date: '', adoption_date: '', status: 'Pending',
  agreement_signed: false, notes: ''
};

export default function AdoptionList() {
  const [adoptions, setAdoptions] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [rescuers, setRescuers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      adoptionsApi.getAll(),
      animalsApi.getAll(),
      adoptionApplicantsApi.getAll(),
      rescuersApi.getAll()
    ])
      .then(([ad, an, ap, re]) => { setAdoptions(ad); setAnimals(an); setApplicants(ap); setRescuers(re); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({
      animal_id: a.animal_id, applicant_id: a.applicant_id, officer_id: a.officer_id,
      application_date: a.application_date, approval_date: a.approval_date || '',
      adoption_date: a.adoption_date || '', status: a.status,
      agreement_signed: !!a.agreement_signed, notes: a.notes || ''
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
      const payload = {
        ...form,
        animal_id: parseInt(form.animal_id),
        applicant_id: parseInt(form.applicant_id),
        officer_id: parseInt(form.officer_id),
        approval_date: form.approval_date || null,
        adoption_date: form.adoption_date || null
      };
      if (editing) await adoptionsApi.update(editing.adoption_id, payload);
      else await adoptionsApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this adoption record?')) return;
    try { await adoptionsApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Adoptions</h1>
          <p>{adoptions.length} adoption records</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> New Adoption</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Animal', 'Applicant', 'Officer', 'Applied', 'Approved', 'Adopted', 'Status', 'Agreement', 'Actions']}>
          {adoptions.map(a => (
            <tr key={a.adoption_id}>
              <td className="muted">{a.adoption_id}</td>
              <td><strong>{a.Animal?.name || '—'}</strong></td>
              <td>{a.AdoptionApplicant ? `${a.AdoptionApplicant.first_name} ${a.AdoptionApplicant.last_name}` : '—'}</td>
              <td className="muted">{a.Officer ? `${a.Officer.first_name} ${a.Officer.last_name}` : '—'}</td>
              <td className="muted">{a.application_date}</td>
              <td className="muted">{a.approval_date || '—'}</td>
              <td className="muted">{a.adoption_date || '—'}</td>
              <td><Badge value={a.status} /></td>
              <td><Badge value={a.agreement_signed ? 'Yes' : 'No'} /></td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.adoption_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Adoption' : 'New Adoption'}
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
              <FormField label="Animal" required>
                <select name="animal_id" value={form.animal_id} onChange={handleChange} required>
                  <option value="">— Select Animal —</option>
                  {animals.map(a => <option key={a.animal_id} value={a.animal_id}>{a.name} ({a.species})</option>)}
                </select>
              </FormField>
              <FormField label="Applicant" required>
                <select name="applicant_id" value={form.applicant_id} onChange={handleChange} required>
                  <option value="">— Select Applicant —</option>
                  {applicants.map(ap => <option key={ap.applicant_id} value={ap.applicant_id}>{ap.first_name} {ap.last_name}</option>)}
                </select>
              </FormField>
              <FormField label="Officer (Rescuer)" required>
                <select name="officer_id" value={form.officer_id} onChange={handleChange} required>
                  <option value="">— Select Officer —</option>
                  {rescuers.map(r => <option key={r.rescuer_id} value={r.rescuer_id}>{r.first_name} {r.last_name}</option>)}
                </select>
              </FormField>
              <FormField label="Status" required>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Completed</option>
                </select>
              </FormField>
              <FormField label="Application Date" required>
                <input name="application_date" type="date" value={form.application_date} onChange={handleChange} required />
              </FormField>
              <FormField label="Approval Date">
                <input name="approval_date" type="date" value={form.approval_date} onChange={handleChange} />
              </FormField>
              <FormField label="Adoption Date">
                <input name="adoption_date" type="date" value={form.adoption_date} onChange={handleChange} />
              </FormField>
              <FormField label="Options">
                <div className="checkbox-row">
                  <input type="checkbox" name="agreement_signed" checked={form.agreement_signed} onChange={handleChange} id="agreement" />
                  <label htmlFor="agreement">Agreement Signed</label>
                </div>
              </FormField>
              <FormField label="Notes" className="full-width">
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes..." />
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
