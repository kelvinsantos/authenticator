const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      index: true,
      unique: true,
      sparse: true,
      lowercase: true
    },
    last_name: String,
    first_name: String,
    password: String,
    tenant: { type: mongoose.Schema.ObjectId, ref: "Tenant" },
    external_id: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
