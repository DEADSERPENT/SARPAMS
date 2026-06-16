const { sequelize, Shelter, Cage, Animal, Rescuer, RescueRequest, Veterinarian, MedicalRecord, FosterFamily, FosterPlacement, AdoptionApplicant, Adoption } = require('../models');

const getDashboard = async (req, res) => {
  try {
    const [
      totalAnimals,
      totalShelters,
      totalRescuers,
      totalVets,
      totalFosterFamilies,
      totalAdoptions,
      openRequests,
      totalMedicalRecords
    ] = await Promise.all([
      Animal.count(),
      Shelter.count(),
      Rescuer.count(),
      Veterinarian.count(),
      FosterFamily.count(),
      Adoption.count(),
      RescueRequest.count({ where: { status: 'Open' } }),
      MedicalRecord.count()
    ]);

    const recentAnimals = await Animal.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      include: [{ model: Cage, include: [{ model: Shelter }] }]
    });

    const recentRescues = await RescueRequest.findAll({
      order: [['created_at', 'DESC']],
      limit: 5,
      include: [
        { model: Rescuer, required: false },
        { model: Animal, required: false }
      ]
    });

    const shelters = await Shelter.findAll({
      include: [{ model: Cage, attributes: ['cage_id', 'is_occupied'] }]
    });

    const shelterOccupancy = shelters.map(s => {
      const total = s.Cages ? s.Cages.length : 0;
      const occupied = s.Cages ? s.Cages.filter(c => c.is_occupied).length : 0;
      return {
        shelter_id: s.shelter_id,
        shelter_name: s.shelter_name,
        city: s.city,
        capacity: s.capacity,
        total_cages: total,
        occupied_cages: occupied,
        free_cages: total - occupied,
        occupancy_pct: total > 0 ? Math.round((occupied / total) * 100) : 0
      };
    });

    res.json({
      stats: {
        totalAnimals,
        totalShelters,
        totalRescuers,
        totalVets,
        totalFosterFamilies,
        totalAdoptions,
        openRequests,
        totalMedicalRecords
      },
      recentAnimals,
      recentRescues,
      shelterOccupancy
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboard };
