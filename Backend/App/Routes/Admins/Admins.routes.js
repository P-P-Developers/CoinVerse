"use strict"

const router = require("express").Router()

const { GetDashboardData } = require("../../Controllers/Admins/AdminDashboard/Dashboard");


router.post('/admin/GetDashboardData', GetDashboardData);
     




module.exports = router;