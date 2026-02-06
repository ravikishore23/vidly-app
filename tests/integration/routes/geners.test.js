let server;
const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");

describe("/api/genres", () => {
  let token;
  let name;
  const exec = async () => {
    return await request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name });
  };

  //beforeAll runs once to start sever , connect mongodb
  beforeAll(() => {
    server = require("../../../index");
  });

  //afterALl runs onces at end of all test , to close server and db
  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    //beforeEach runs for every test
    beforeEach(async () => {
      token = new User().generateAuthToken();
      name = "genre1";

      //here remove exixting data and create new 2 data
      await Genre.deleteMany({});
      await Genre.collection.insertMany([
        { name: "genres1" },
        {
          name: "genres2",
        },
      ]);
    });

    it("should return a all genres", async () => {
      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.some((g) => g.name === "genres1")).toBeTruthy;
      expect(res.body.some((g) => g.name === "genres2")).toBeTruthy;
    });

    describe("GET /:id", () => {
      it("should return Genres if valid id is passed", async () => {
        const genre = new Genre({ name: "genre1" });
        genre.save();

        const res = await request(server).get("/api/genres/" + genre._id);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", genre.name);
      });
    });

    describe("GET /:id", () => {
      it("should return 404 erro if invalid id is passed", async () => {
        const res = await request(server).get("/api/genres/1");
        expect(res.status).toBe(404);
      });

      describe("POST /", () => {
        token = "";
        it("it should throw 401 error if user is not logged in", async () => {
          const res = await request(server)
            .post("/api/genres")
            .send({ name: "kitchi" });

          expect(res.status).toBe(401);
        });

        it("it should return 400 if genre is less than 5 characters", async () => {
          /*
            const token = new User().generateAuthToken();
            it generate by default
          {
           _id: ObjectId("65f..."),
           isAdmin: false // default (if defined in schema)}
           */
          name = "a";
          const res = await exec();

          expect(res.status).toBe(400);
        });

        it("it should return 400 if genre is Greater than 50 characters", async () => {
          name = new Array(70).join("x");
          const res = await exec();

          expect(res.status).toBe(400);
        });

        it("should Save a genres if it is valid", async () => {
          await exec();
          const genre = Genre.find({ name });
          expect(genre).not.toBeNull();
        });

        it("should return genre if it is valid ", async () => {
          const res = await exec();

          expect(res.body).toHaveProperty("_id");
          expect(res.body).toHaveProperty("name", "GENRE1");
        });

        describe("PUT/:id", () => {
          it("it should retun 200 error if id is valid", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const res = await request(server)
              .put("/api/genres/" + genre._id)
              .send({
                name: "updatedg",
              });
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "UPDATEDG");
          });

          it("it should retun 400 error if Genres name is less than 3character", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const res = await request(server)
              .put("/api/genres/" + genre._id)
              .send({
                name: "g",
              });
            expect(res.status).toBe(400);
          });
          it("it should retun 400 error if Genres name is Greater than 10 character", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const name = new Array(20).join("x");
            const res = await request(server)
              .put("/api/genres/" + genre._id)
              .send({
                name,
              });
            expect(res.status).toBe(400);
          });

          it("it should retun 404  error if id is invalid", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();

            const id = new mongoose.Types.ObjectId();

            const res = await request(server)
              .put("/api/genres/" + id)
              .send({
                name: "genre2",
              });
            expect(res.status).toBe(404);
          });
        });

        describe("DELETE/:id", () => {
          it("should return 403 if user is not admin ", async () => {
            const token = new User().generateAuthToken();
            const genre = new Genre({ name: "genre1" });
            await genre.save();
            const user = { name: "kitchi", isAdmin: false };

            const res = await request(server)
              .delete("/api/genres/" + genre._id)
              .set("x-auth-token", token)
              .send(user);

            expect(res.status).toBe(403);
          });

          it("should return 404 if id is invalid ", async () => {
            const token = new User({ isAdmin: true }).generateAuthToken();
            const genre = new Genre({ name: "genre1" });
            await genre.save();

            const id = new mongoose.Types.ObjectId();

            const res = await request(server)
              .delete("/api/genres/" + id)
              .set("x-auth-token", token);

            expect(res.status).toBe(404);
          });

          it("should return 200 if genre is  deleted successfully ", async () => {
            const token = new User({ isAdmin: true }).generateAuthToken();
            const genre = new Genre({ name: "genre1" });
            await genre.save();

            const res = await request(server)
              .delete("/api/genres/" + genre._id)
              .set("x-auth-token", token);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id", genre._id.toHexString());
            expect(res.body).toHaveProperty("name", genre.name);
          });
        });
      });
    });
  });
});
