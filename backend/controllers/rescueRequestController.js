const { RescueRequest, Rescuer, Animal } = require('../models');

const getAll = async (req, res) => {
  try {
    const requests = await RescueRequest.findAll({
      order: [['request_id', 'ASC']],
      include: [
        { model: Rescuer, required: false },
        { model: Animal, required: false }
      ]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOne = async (req, res) => {
  try {
    const request = await RescueRequest.findByPk(req.params.id, {
      include: [
        { model: Rescuer, required: false },
        { model: Animal, required: false }
      ]
    });
    if (!request) return res.status(404).json({ error: 'Rescue request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const request = await RescueRequest.create(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const request = await RescueRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Rescue request not found' });
    await request.update(req.body);
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const request = await RescueRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Rescue request not found' });
    await request.destroy();
    res.json({ message: 'Rescue request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getOne, create, update, remove };
