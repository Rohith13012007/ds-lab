const express = require('express');
const router = express.Router();
const {
  getExperiments,
  getExperimentById,
  createExperiment,
  updateExperiment,
  deleteExperiment,
  deleteSubExperiment,
  batchMigrate
} = require('../controllers/experimentController');

router.get('/', getExperiments);
router.post('/', createExperiment);
router.post('/batch-migrate', batchMigrate);
router.get('/:id', getExperimentById);
router.put('/:id', updateExperiment);
router.delete('/:id', deleteExperiment);
router.delete('/:id/sub/:subId', deleteSubExperiment);

module.exports = router;
