
module.exports = function (app) {
    
    app.use(require("./Superadmins/Superadmin.routes"));
    app.use(require("./Auth/Auth.routes"));
    app.use(require("./Admins/Admins.routes"))
    app.use(require("./Users/Userorder.routes"))
    app.use(require("../Routes/Employees/Employee.routes"))
    app.use(require("./Admins/Broadcastmessage.routes"))
};