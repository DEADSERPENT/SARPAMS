require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/shelters', require('./routes/shelters'));
app.use('/api/cages', require('./routes/cages'));
app.use('/api/animals', require('./routes/animals'));
app.use('/api/rescuers', require('./routes/rescuers'));
app.use('/api/rescue-requests', require('./routes/rescueRequests'));
app.use('/api/veterinarians', require('./routes/veterinarians'));
app.use('/api/medical-records', require('./routes/medicalRecords'));
app.use('/api/foster-families', require('./routes/fosterFamilies'));
app.use('/api/foster-placements', require('./routes/fosterPlacements'));
app.use('/api/adoption-applicants', require('./routes/adoptionApplicants'));
app.use('/api/adoptions', require('./routes/adoptions'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SARPAMS API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SARPAMS backend running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
    process.exit(1);
  });
