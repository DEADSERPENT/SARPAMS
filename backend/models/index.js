const sequelize = require('../config/database');

const Shelter = require('./Shelter');
const Cage = require('./Cage');
const Animal = require('./Animal');
const Rescuer = require('./Rescuer');
const RescueRequest = require('./RescueRequest');
const Veterinarian = require('./Veterinarian');
const MedicalRecord = require('./MedicalRecord');
const FosterFamily = require('./FosterFamily');
const FosterPlacement = require('./FosterPlacement');
const AdoptionApplicant = require('./AdoptionApplicant');
const Adoption = require('./Adoption');

// Cage belongs to Shelter
Shelter.hasMany(Cage, { foreignKey: 'shelter_id', onDelete: 'RESTRICT' });
Cage.belongsTo(Shelter, { foreignKey: 'shelter_id' });

// Animal belongs to Cage (nullable)
Cage.hasMany(Animal, { foreignKey: 'cage_id', onDelete: 'SET NULL' });
Animal.belongsTo(Cage, { foreignKey: 'cage_id' });

// RescueRequest belongs to Rescuer (nullable)
Rescuer.hasMany(RescueRequest, { foreignKey: 'rescuer_id', onDelete: 'SET NULL' });
RescueRequest.belongsTo(Rescuer, { foreignKey: 'rescuer_id' });

// RescueRequest belongs to Animal (nullable)
Animal.hasMany(RescueRequest, { foreignKey: 'animal_id', onDelete: 'SET NULL' });
RescueRequest.belongsTo(Animal, { foreignKey: 'animal_id' });

// MedicalRecord belongs to Animal and Veterinarian
Animal.hasMany(MedicalRecord, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
MedicalRecord.belongsTo(Animal, { foreignKey: 'animal_id' });

Veterinarian.hasMany(MedicalRecord, { foreignKey: 'vet_id', onDelete: 'RESTRICT' });
MedicalRecord.belongsTo(Veterinarian, { foreignKey: 'vet_id' });

// FosterPlacement belongs to Animal and FosterFamily
Animal.hasMany(FosterPlacement, { foreignKey: 'animal_id', onDelete: 'CASCADE' });
FosterPlacement.belongsTo(Animal, { foreignKey: 'animal_id' });

FosterFamily.hasMany(FosterPlacement, { foreignKey: 'foster_id', onDelete: 'RESTRICT' });
FosterPlacement.belongsTo(FosterFamily, { foreignKey: 'foster_id' });

// Adoption belongs to Animal, AdoptionApplicant, Rescuer (as officer)
Animal.hasMany(Adoption, { foreignKey: 'animal_id', onDelete: 'RESTRICT' });
Adoption.belongsTo(Animal, { foreignKey: 'animal_id' });

AdoptionApplicant.hasMany(Adoption, { foreignKey: 'applicant_id', onDelete: 'RESTRICT' });
Adoption.belongsTo(AdoptionApplicant, { foreignKey: 'applicant_id' });

Rescuer.hasMany(Adoption, { foreignKey: 'officer_id', onDelete: 'RESTRICT', as: 'OfficeredAdoptions' });
Adoption.belongsTo(Rescuer, { foreignKey: 'officer_id', as: 'Officer' });

module.exports = {
  sequelize,
  Shelter,
  Cage,
  Animal,
  Rescuer,
  RescueRequest,
  Veterinarian,
  MedicalRecord,
  FosterFamily,
  FosterPlacement,
  AdoptionApplicant,
  Adoption
};
