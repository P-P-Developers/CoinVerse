db.users.updateMany(
  { limit: { $exists: true } },
  [
    {
      $set: {
        holding_limit: "$limit"
      }
    }
  ]
)



