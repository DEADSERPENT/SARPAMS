import React, { useEffect, useState } from 'react';
import { cagesApi, sheltersApi } from '../api/client';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = { shelter_id: '', cage_number: '', size_category: 'Medium', is_occupied: false, notes: '' };

export default function CageList() {
  const [cages, setCages] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([cagesApi.getAll(), sheltersApi.getAll()])
      .then(([c, s]) => { setCages(c); setShelters(s); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ shelter_id: c.shelter_id, cage_number: c.cage_number, size_category: c.size_category, is_occupied: !!c.is_occupied, notes: c.notes || '' });
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
      const payload = { ...form, shelter_id: parseInt(form.shelter_id) };
      if (editing) await cagesApi.update(editing.cage_id, payload);
      else await cagesApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) { alert('Error: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this cage?')) return;
    try { await cagesApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Cages</h1>
          <p>{cages.length} cages registered</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Cage</button>
      </div>
      {error && <div className="error-state">{error}</div>}
      <div className="card">
        <Table headers={['#', 'Cage No.', 'Shelter', 'City', 'Size', 'Occupied', 'Notes', 'Actions']}>
          {cages.map(c => (
            <tr key={c.cage_id}>
              <td className="muted">{c.cage_id}</td>
              <td><strong>{c.cage_number}</strong></td>
              <td>{c.Shelter?.shelter_name || '—'}</td>
              <td className="muted">{c.Shelter?.city || '—'}</td>
              <td><Badge value={c.size_category} /></td>
              <td><Badge value={c.is_occupied ? 'Yes' : 'No'} /></td>
              <td className="muted">{c.notes || '—'}</td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.cage_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Cage' : 'Add Cage'}
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
              <FormField label="Shelter" required>
                <select name="shelter_id" value={form.shelter_id} onChange={handleChange} required>
                  <option value="">— Select Shelter —</option>
                  {shelters.map(s => <option key={s.shelter_id} value={s.shelter_id}>{s.shelter_name}</option>)}
                </select>
              </FormField>
              <FormField label="Cage Number" required>
                <input name="cage_number" value={form.cage_number} onChange={handleChange} required placeholder="e.g. C-01" />
              </FormField>
              <FormField label="Size Category" required>
                <select name="size_category" value={form.size_category} onChange={handleChange}>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </FormField>
              <FormField label="Status">
                <div className="checkbox-row">
                  <input type="checkbox" name="is_occupied" checked={form.is_occupied} onChange={handleChange} id="occ" />
                  <label htmlFor="occ">Currently Occupied</label>
                </div>
              </FormField>
              <FormField label="Notes" className="full-width">
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes about this cage..." />
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
