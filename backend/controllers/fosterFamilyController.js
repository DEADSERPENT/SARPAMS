const { FosterFamily } = require('../models');

const getAll = async (req, res) => {
  try {
    const families = await FosterFamily.findAll({ order: [['foster_id', 'ASC']] });
    res.json(families);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const family = await FosterFamily.findByPk(req.params.id);
    if (!family) return res.status(404).json({ error: 'Foster family not found' });
    res.json(family);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const family = await FosterFamily.create(req.body);
    res.status(201).json(family);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const family = await FosterFamily.findByPk(req.params.id);
    if (!family) return res.status(404).json({ error: 'Foster family not found' });
    await family.update(req.body);
    res.json(family);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const family = await FosterFamily.findByPk(req.params.id);
    if (!family) return res.status(404).json({ error: 'Foster family not found' });
    await family.destroy();
    res.json({ message: 'Foster family deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
