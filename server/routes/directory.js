const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const {
  getDirectory,
  getDirectoryTree,
  exportDirectory,
  addFaculty,
  swapHod,
} = require('../controllers/directoryController');

router.use(verifyToken);

router.get('/', getDirectory);
router.get('/tree', getDirectoryTree);
router.get('/export', exportDirectory);
router.post('/faculty', roleGuard('HOD', 'VC', 'SUPERADMIN'), addFaculty);
router.put('/swap-hod', roleGuard('VC', 'SUPERADMIN'), swapHod);

module.exports = router;
