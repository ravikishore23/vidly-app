const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const request = require("supertest");
let server;

describe("auth middleware", () => {
  let name;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  beforeAll(() => {
    server = require("../../../index");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  it("should retun 401 if no token is provided", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should  return  the  400  when token is invalid ", async () => {
    token = "123";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should  return  the  200  when token is valid ", async () => {
    name = "genres1";
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
