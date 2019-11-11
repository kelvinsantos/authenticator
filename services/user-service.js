'use strict';
const bcrypt = require("bcrypt");

// Schemas
let User = require("../schemas/user");

module.exports = {
  getUser: async (payload) => {
    let email = payload.email.toLowerCase();
    let clearPassword = payload.password;

    let user = await User.findOne({ "email": email }).populate("tenant");
    if (user == null) {
      return Promise.reject("incorrect email or password");
    }

    let compareRes = await bcrypt.compare(clearPassword, user.password);
    if (compareRes == false) {
      return Promise.reject("incorrect email or password");
    }

    return user;
  },
};
