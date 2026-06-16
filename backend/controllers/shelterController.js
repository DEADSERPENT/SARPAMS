const { Shelter } = require('../models');

const getAll = async (req, res) => {
  try {
    const shelters = await Shelter.findAll({ order: [['shelter_id', 'ASC']] });
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const shelter = await Shelter.findByPk(req.params.id);
    if (!shelter) return res.status(404).json({ error: 'Shelter not found' });
    res.json(shelter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const shelter = await Shelter.create(req.body);
    res.status(201).json(shelter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const shelter = await Shelter.findByPk(req.params.id);
    if (!shelter) return res.status(404).json({ error: 'Shelter not found' });
    await shelter.update(req.body);
    res.json(shelter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const shelter = await Shelter.findByPk(req.params.id);
    if (!shelter) return res.status(404).json({ error: 'Shelter not found' });
    await shelter.destroy();
    res.json({ message: 'Shelter deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
