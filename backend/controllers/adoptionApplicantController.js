const { AdoptionApplicant } = require('../models');

const getAll = async (req, res) => {
  try {
    const applicants = await AdoptionApplicant.findAll({ order: [['applicant_id', 'ASC']] });
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const applicant = await AdoptionApplicant.findByPk(req.params.id);
    if (!applicant) return res.status(404).json({ error: 'Applicant not found' });
    res.json(applicant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const applicant = await AdoptionApplicant.create(req.body);
    res.status(201).json(applicant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const applicant = await AdoptionApplicant.findByPk(req.params.id);
    if (!applicant) return res.status(404).json({ error: 'Applicant not found' });
    await applicant.update(req.body);
    res.json(applicant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const applicant = await AdoptionApplicant.findByPk(req.params.id);
    if (!applicant) return res.status(404).json({ error: 'Applicant not found' });
    await applicant.destroy();
    res.json({ message: 'Applicant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
