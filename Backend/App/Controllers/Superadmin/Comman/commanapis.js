
const db = require("../../../Models");
const User_model = db.user;

class CommanApis {

    async GetAdminUserName(req, res) {
        try {
            const {parent_id} = req.body;
            const adminNames = await User_model.findAll({
                where: {
                    parent_id: parent_id
                },
            });
            return res.status(200).json(adminNames);
        } catch (error) {
            console.error("Error fetching admin names:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }




}
module.exports = new CommanApis();