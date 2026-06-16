import React, { useEffect, useState } from 'react';
import { fosterPlacementsApi, animalsApi, fosterFamiliesApi } from '../api/client';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = {
  animal_id: '', foster_id: '', start_date: '',
  expected_end: '', actual_end: '', outcome: ''
};

export default function FosterPlacementList() {
  const [placements, setPlacements] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([fosterPlacementsApi.getAll(), animalsApi.getAll(), fosterFamiliesApi.getAll()])
      .then(([p, a, f]) => { setPlacements(p); setAnimals(a); setFamilies(f); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      animal_id: p.animal_id, foster_id: p.foster_id, start_date: p.start_date,
      expected_end: p.expected_end || '', actual_end: p.actual_end || '', outcome: p.outcome || ''
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
        foster_id: parseInt(form.foster_id),
        expected_end: form.expected_end || null,
        actual_end: form.actual_end || null
      };
      if (editing) await fosterPlacementsApi.update(editing.placement_id, payload);
      else await fosterPlacementsApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this placement?')) return;
    try { await fosterPlacementsApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Foster Placements</h1>
          <p>{placements.length} placements recorded</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Placement</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Animal', 'Foster Family', 'Start Date', 'Expected End', 'Actual End', 'Outcome', 'Actions']}>
          {placements.map(p => (
            <tr key={p.placement_id}>
              <td className="muted">{p.placement_id}</td>
              <td><strong>{p.Animal?.name || '—'}</strong></td>
              <td>{p.FosterFamily?.family_name || '—'}</td>
              <td className="muted">{p.start_date}</td>
              <td className="muted">{p.expected_end || '—'}</td>
              <td className="muted">{p.actual_end || '—'}</td>
              <td>{p.outcome ? <Badge value={p.outcome} /> : '—'}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.placement_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Foster Placement' : 'Add Foster Placement'}
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
              <FormField label="Foster Family" required>
                <select name="foster_id" value={form.foster_id} onChange={handleChange} required>
                  <option value="">— Select Family —</option>
                  {families.map(f => <option key={f.foster_id} value={f.foster_id}>{f.family_name}</option>)}
                </select>
              </FormField>
              <FormField label="Start Date" required>
                <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
              </FormField>
              <FormField label="Expected End Date">
                <input name="expected_end" type="date" value={form.expected_end} onChange={handleChange} />
              </FormField>
              <FormField label="Actual End Date">
                <input name="actual_end" type="date" value={form.actual_end} onChange={handleChange} />
              </FormField>
              <FormField label="Outcome">
                <input name="outcome" value={form.outcome} onChange={handleChange} placeholder="e.g. Ongoing, Returned, Adopted" />
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
