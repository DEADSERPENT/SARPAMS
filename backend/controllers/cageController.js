const { Cage, Shelter } = require('../models');

const getAll = async (req, res) => {
  try {
    const cages = await Cage.findAll({
      order: [['cage_id', 'ASC']],
      include: [{ model: Shelter }]
    });
    res.json(cages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const cage = await Cage.findByPk(req.params.id, {
      include: [{ model: Shelter }]
    });
    if (!cage) return res.status(404).json({ error: 'Cage not found' });
    res.json(cage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const cage = await Cage.create(req.body);
    res.status(201).json(cage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const cage = await Cage.findByPk(req.params.id);
    if (!cage) return res.status(404).json({ error: 'Cage not found' });
    await cage.update(req.body);
    res.json(cage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const cage = await Cage.findByPk(req.params.id);
    if (!cage) return res.status(404).json({ error: 'Cage not found' });
    await cage.destroy();
    res.json({ message: 'Cage deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
