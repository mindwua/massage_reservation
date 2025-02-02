exports.createAccount = (req, res, next) => {
  res.status(201).json({ success: true, msg: "Create new account" });
};
