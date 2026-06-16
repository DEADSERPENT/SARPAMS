import React, { useEffect, useState } from 'react';
import { animalsApi, cagesApi } from '../api/client';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import Table from '../components/Table';
import FormField from '../components/FormField';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = {
  name: '', species: '', breed: '', age_years: '', sex: 'U',
  colour: '', weight_kg: '', microchip_no: '', intake_date: '',
  health_status: 'Unknown', is_vaccinated: false, is_neutered: false, cage_id: ''
};

export default function AnimalList() {
  const [animals, setAnimals] = useState([]);
  const [cages, setCages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([animalsApi.getAll(), cagesApi.getAll()])
      .then(([a, c]) => { setAnimals(a); setCages(c); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (a) => {
    setEditing(a);
    setForm({
      name: a.name || '', species: a.species || '', breed: a.breed || '',
      age_years: a.age_years || '', sex: a.sex || 'U', colour: a.colour || '',
      weight_kg: a.weight_kg || '', microchip_no: a.microchip_no || '',
      intake_date: a.intake_date || '', health_status: a.health_status || 'Unknown',
      is_vaccinated: !!a.is_vaccinated, is_neutered: !!a.is_neutered,
      cage_id: a.cage_id || ''
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
        age_years: form.age_years !== '' ? parseFloat(form.age_years) : null,
        weight_kg: form.weight_kg !== '' ? parseFloat(form.weight_kg) : null,
        cage_id: form.cage_id !== '' ? parseInt(form.cage_id) : null,
        microchip_no: form.microchip_no || null
      };
      if (editing) await animalsApi.update(editing.animal_id, payload);
      else await animalsApi.create(payload);
      setShowModal(false);
      load();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this animal?')) return;
    try { await animalsApi.remove(id); load(); }
    catch (err) { alert('Error: ' + err.message); }
  };

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading...</span></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Animals</h1>
          <p>{animals.length} animals registered</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Add Animal
        </button>
      </div>

      {error && <div className="error-state">{error}</div>}

      <div className="card">
        <Table headers={['#', 'Name', 'Species', 'Breed', 'Age', 'Sex', 'Health', 'Vaccinated', 'Intake Date', 'Cage / Shelter', 'Actions']}>
          {animals.map(a => (
            <tr key={a.animal_id}>
              <td className="muted">{a.animal_id}</td>
              <td><strong>{a.name}</strong></td>
              <td>{a.species}</td>
              <td className="muted">{a.breed || '—'}</td>
              <td className="muted">{a.age_years ? `${a.age_years} yr` : '—'}</td>
              <td className="muted">{a.sex}</td>
              <td><Badge value={a.health_status} /></td>
              <td><Badge value={a.is_vaccinated ? 'Yes' : 'No'} /></td>
              <td className="muted">{a.intake_date}</td>
              <td className="muted">
                {a.Cage ? `${a.Cage.cage_number}` : '—'}
                {a.Cage?.Shelter ? ` / ${a.Cage.Shelter.shelter_name}` : ''}
              </td>
              <td>
                <div className="actions-cell">
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}><Pencil size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.animal_id)}><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Animal' : 'Add Animal'}
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
              <FormField label="Name" required>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Bruno" />
              </FormField>
              <FormField label="Species" required>
                <input name="species" value={form.species} onChange={handleChange} required placeholder="e.g. Dog" />
              </FormField>
              <FormField label="Breed">
                <input name="breed" value={form.breed} onChange={handleChange} placeholder="e.g. Labrador Mix" />
              </FormField>
              <FormField label="Age (years)">
                <input name="age_years" type="number" step="0.1" min="0" value={form.age_years} onChange={handleChange} placeholder="e.g. 3.0" />
              </FormField>
              <FormField label="Sex" required>
                <select name="sex" value={form.sex} onChange={handleChange}>
                  <option value="M">Male (M)</option>
                  <option value="F">Female (F)</option>
                  <option value="U">Unknown (U)</option>
                </select>
              </FormField>
              <FormField label="Colour" required>
                <input name="colour" value={form.colour} onChange={handleChange} required placeholder="e.g. Golden Brown" />
              </FormField>
              <FormField label="Weight (kg)">
                <input name="weight_kg" type="number" step="0.01" min="0" value={form.weight_kg} onChange={handleChange} placeholder="e.g. 28.5" />
              </FormField>
              <FormField label="Microchip No.">
                <input name="microchip_no" value={form.microchip_no} onChange={handleChange} placeholder="e.g. MC001234" />
              </FormField>
              <FormField label="Intake Date" required>
                <input name="intake_date" type="date" value={form.intake_date} onChange={handleChange} required />
              </FormField>
              <FormField label="Health Status" required>
                <select name="health_status" value={form.health_status} onChange={handleChange}>
                  <option>Unknown</option>
                  <option>Healthy</option>
                  <option>Under Treatment</option>
                  <option>Recovered</option>
                  <option>Critical</option>
                  <option>Adopted</option>
                </select>
              </FormField>
              <FormField label="Cage">
                <select name="cage_id" value={form.cage_id} onChange={handleChange}>
                  <option value="">— No cage assigned —</option>
                  {cages.map(c => (
                    <option key={c.cage_id} value={c.cage_id}>
                      {c.cage_number} ({c.size_category}) {c.Shelter ? `– ${c.Shelter.shelter_name}` : ''}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Options">
                <div className="checkbox-row">
                  <input type="checkbox" name="is_vaccinated" checked={form.is_vaccinated} onChange={handleChange} id="vax" />
                  <label htmlFor="vax">Vaccinated</label>
                </div>
                <div className="checkbox-row">
                  <input type="checkbox" name="is_neutered" checked={form.is_neutered} onChange={handleChange} id="neu" />
                  <label htmlFor="neu">Neutered</label>
                </div>
              </FormField>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
