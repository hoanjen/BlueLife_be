const express = require('express')
const { auth, authorize } = require('../middleware/auth.middleware')
const { createNewRole, getRole, queryRoles, deleteRole } = require('../controllers/role.controller')
const router = express.Router()
require('express-async-errors')

router.post('/createNewRole', auth, authorize(['admin']) ,createNewRole);
router.get('/queryRoles', auth, authorize(['admin']), queryRoles);
router.get('/getRole', auth, getRole);
router.get('/deleteRole', auth, authorize(['admin']), deleteRole);

module.exports = router