var cron = require("node-cron");
const db = require("../../Models");
const Company = db.Company;

const UpdateCompany = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const updateResult = await Company.updateMany(
      {}, 
      { $set: { startOfDay: startOfDay, endOfDay: endOfDay } } 
    );

  } catch (err) {
    console.log("Error:", err);
  }
};

cron.schedule("1 5 * * *", () => {
  UpdateCompany();
});
