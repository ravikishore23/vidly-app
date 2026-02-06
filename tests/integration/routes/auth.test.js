let server;

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
let request = require("supertest");
const { User } = require("../../../models/user");

describe("/api/auth", () => {
  let user;
  beforeAll(() => {
    server = require("../../../index");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash("123456789", salt);
    user =  new User({
      name: "kitchi",
      email: "kitchii@gmail.com",
      password: password,
    });
  });

  describe("POST /", () => {
    it("should return 400 if email is invalid", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({ email: "", password: "123456789" });
      expect(res.status).toBe(400);
    });
    it("should return 400 if password is invalid", async () => {
      const res = await request(server)
        .post("/api/auth")
        .send({ email: user.email, password: "12345689" });
      expect(res.status).toBe(400);
    });

    it("should return 200 if email and password is valid", async () => {
      const data = {
        email: "kitchii@gmail.com",
        password: "123456789",
      };
      const res = await request(server).post("/api/auth").send(data);
      expect(res.status).toBe(200);
    });
  });
});
