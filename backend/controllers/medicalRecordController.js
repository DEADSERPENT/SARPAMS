const { MedicalRecord, Animal, Veterinarian } = require('../models');

const getAll = async (req, res) => {
  try {
    const records = await MedicalRecord.findAll({
      order: [['record_id', 'ASC']],
      include: [
        { model: Animal },
        { model: Veterinarian }
      ]
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id, {
      include: [
        { model: Animal },
        { model: Veterinarian }
      ]
    });
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const record = await MedicalRecord.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    await record.update(req.body);
    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const record = await MedicalRecord.findByPk(req.params.id);
    if (!record) return res.status(404).json({ error: 'Medical record not found' });
    await record.destroy();
    res.json({ message: 'Medical record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
