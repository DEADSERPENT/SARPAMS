const { Adoption, Animal, AdoptionApplicant, Rescuer } = require('../models');

const getAll = async (req, res) => {
  try {
    const adoptions = await Adoption.findAll({
      order: [['adoption_id', 'ASC']],
      include: [
        { model: Animal },
        { model: AdoptionApplicant },
        { model: Rescuer, as: 'Officer' }
      ]
    });
    res.json(adoptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id, {
      include: [
        { model: Animal },
        { model: AdoptionApplicant },
        { model: Rescuer, as: 'Officer' }
      ]
    });
    if (!adoption) return res.status(404).json({ error: 'Adoption not found' });
    res.json(adoption);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const adoption = await Adoption.create(req.body);
    res.status(201).json(adoption);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id);
    if (!adoption) return res.status(404).json({ error: 'Adoption not found' });
    await adoption.update(req.body);
    res.json(adoption);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const adoption = await Adoption.findByPk(req.params.id);
    if (!adoption) return res.status(404).json({ error: 'Adoption not found' });
    await adoption.destroy();
    res.json({ message: 'Adoption deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
