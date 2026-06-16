
const { Veterinarian } = require('../models');

const getAll = async (req, res) => {
  try {
    const vets = await Veterinarian.findAll({ order: [['vet_id', 'ASC']] });
    res.json(vets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const vet = await Veterinarian.findByPk(req.params.id);
    if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });
    res.json(vet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const vet = await Veterinarian.create(req.body);
    res.status(201).json(vet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const vet = await Veterinarian.findByPk(req.params.id);
    if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });
    await vet.update(req.body);
    res.json(vet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const vet = await Veterinarian.findByPk(req.params.id);
    if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });
    await vet.destroy();
    res.json({ message: 'Veterinarian deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
