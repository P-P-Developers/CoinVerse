
module.exports = function (app) {
    
    app.use(require("./Superadmins/Superadmin.routes"));
    app.use(require("./Auth/Auth.routes"));


};