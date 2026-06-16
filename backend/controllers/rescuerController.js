const { Rescuer } = require('../models');

const getAll = async (req, res) => {
  try {
    const rescuers = await Rescuer.findAll({ order: [['rescuer_id', 'ASC']] });
    res.json(rescuers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const rescuer = await Rescuer.findByPk(req.params.id);
    if (!rescuer) return res.status(404).json({ error: 'Rescuer not found' });
    res.json(rescuer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const rescuer = await Rescuer.create(req.body);
    res.status(201).json(rescuer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const rescuer = await Rescuer.findByPk(req.params.id);
    if (!rescuer) return res.status(404).json({ error: 'Rescuer not found' });
    await rescuer.update(req.body);
    res.json(rescuer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const rescuer = await Rescuer.findByPk(req.params.id);
    if (!rescuer) return res.status(404).json({ error: 'Rescuer not found' });
    await rescuer.destroy();
    res.json({ message: 'Rescuer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
