const { FosterPlacement, Animal, FosterFamily } = require('../models');

const getAll = async (req, res) => {
  try {
    const placements = await FosterPlacement.findAll({
      order: [['placement_id', 'ASC']],
      include: [
        { model: Animal },
        { model: FosterFamily }
      ]
    });
    res.json(placements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const placement = await FosterPlacement.findByPk(req.params.id, {
      include: [
        { model: Animal },
        { model: FosterFamily }
      ]
    });
    if (!placement) return res.status(404).json({ error: 'Foster placement not found' });
    res.json(placement);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const placement = await FosterPlacement.create(req.body);
    res.status(201).json(placement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const placement = await FosterPlacement.findByPk(req.params.id);
    if (!placement) return res.status(404).json({ error: 'Foster placement not found' });
    await placement.update(req.body);
    res.json(placement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const placement = await FosterPlacement.findByPk(req.params.id);
    if (!placement) return res.status(404).json({ error: 'Foster placement not found' });
    await placement.destroy();
    res.json({ message: 'Foster placement deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
