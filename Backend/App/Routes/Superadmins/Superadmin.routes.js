"use strict"

const router = require("express").Router()

const {AddAdmin ,addRoles } = require("../../Controllers/Superadmin/Admins/admin")




router.post('/admin/add', AddAdmin);
router.post('/admin/addRoles', addRoles);





module.exports = router;