import React, { useEffect, useState } from 'react';
import { medicalRecordsApi, animalsApi, veterinariansApi } from '../api/client';
import Modal from '../components/Modal';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = {
  animal_id: '', vet_id: '', exam_date: '', diagnosis: '',
  treatment: '', medication: '', next_checkup_date: '', notes: ''
};

export default function MedicalRecordList() {
  const [records, setRecords] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([medicalRecordsApi.getAll(), animalsApi.getAll(), veterinariansApi.getAll()])
      .then(([r, a, v]) => { setRecords(r); setAnimals(a); setVets(v); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (r) => {
    setEditing(r);
    setForm({
      animal_id: r.animal_id, vet_id: r.vet_id, exam_date: r.exam_date,
      diagnosis: r.diagnosis || '', treatment: r.treatment || '',
      medication: r.medication || '', next_checkup_date: r.next_checkup_date || '', notes: r.notes || ''
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
        animal_id: parseInt(form.animal_id),
        vet_id: parseInt(form.vet_id),
        next_checkup_date: form.next_checkup_date || null
      };
      if (editing) await medicalRecordsApi.update(editing.record_id, payload);
      else await medicalRecordsApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this medical record?')) return;
    try { await medicalRecordsApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Medical Records</h1>
          <p>{records.length} records</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Record</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Animal', 'Veterinarian', 'Exam Date', 'Diagnosis', 'Medication', 'Next Checkup', 'Actions']}>
          {records.map(r => (
            <tr key={r.record_id}>
              <td className="muted">{r.record_id}</td>
              <td><strong>{r.Animal?.name || '—'}</strong></td>
              <td>{r.Veterinarian ? `${r.Veterinarian.first_name} ${r.Veterinarian.last_name}` : '—'}</td>
              <td className="muted">{r.exam_date}</td>
              <td className="muted" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.diagnosis || '—'}</td>
              <td className="muted">{r.medication || '—'}</td>
              <td className="muted">{r.next_checkup_date || '—'}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.record_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Medical Record' : 'Add Medical Record'}
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
              <FormField label="Veterinarian" required>
                <select name="vet_id" value={form.vet_id} onChange={handleChange} required>
                  <option value="">— Select Vet —</option>
                  {vets.map(v => <option key={v.vet_id} value={v.vet_id}>{v.first_name} {v.last_name}</option>)}
                </select>
              </FormField>
              <FormField label="Exam Date" required>
                <input name="exam_date" type="date" value={form.exam_date} onChange={handleChange} required />
              </FormField>
              <FormField label="Next Checkup Date">
                <input name="next_checkup_date" type="date" value={form.next_checkup_date} onChange={handleChange} />
              </FormField>
              <FormField label="Diagnosis" className="full-width">
                <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="Diagnosis details..." />
              </FormField>
              <FormField label="Treatment" className="full-width">
                <textarea name="treatment" value={form.treatment} onChange={handleChange} placeholder="Treatment prescribed..." />
              </FormField>
              <FormField label="Medication">
                <input name="medication" value={form.medication} onChange={handleChange} placeholder="e.g. Amoxicillin 50mg x7d" />
              </FormField>
              <FormField label="Notes">
                <input name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes..." />
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
