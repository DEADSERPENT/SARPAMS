const { Animal, Cage, Shelter } = require('../models');

const getAll = async (req, res) => {
  try {
    const animals = await Animal.findAll({
      order: [['animal_id', 'ASC']],
      include: [{
        model: Cage,
        required: false,
        include: [{ model: Shelter }]
      }]
    });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id, {
      include: [{
        model: Cage,
        required: false,
        include: [{ model: Shelter }]
      }]
    });
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    await animal.update(req.body);
    res.json(animal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id);
    if (!animal) return res.status(404).json({ error: 'Animal not found' });
    await animal.destroy();
    res.json({ message: 'Animal deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
