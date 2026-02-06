const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth Middleware", () => {
  it("should retun  a req.user with the payload of valid jwt", () => {
    const user = { _id: mongoose.Types.ObjectId.toHexaString, isAdmin: true };
    const token = new User(user).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };

    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toHaveProperty('_id');
    expect(req.user).toHaveProperty('isAdmin',true);
  });
});
