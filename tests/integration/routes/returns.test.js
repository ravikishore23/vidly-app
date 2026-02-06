const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { Rental } = require("../../../models/rental");
const moment = require("moment");
const { Movie } = require("../../../models/movie");

let server;

describe("api/returns", () => {
  let rental;
  let movie;
  let token;
  let customerId;
  let movieId;
  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeAll(() => {
    server = require("../../../index");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    token = new User().generateAuthToken();
    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();

    movie = new Movie({
      _id: movieId,
      title: "hoory",
      genre: {
        name: "horror",
      },
      numberInStock: 10,
      dailyRentalRate: 2,
    });

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "kitchic",
        phone: "123445",
      },
      movie: {
        _id: movieId,
        title: "i",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
    await movie.save();
  });

  it("should retun 401 if client not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should retun 400 if customerId is not provided", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should retun 400 if MovieId is not provided", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should retun 404 if no rental  is not found for the customer / movie", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should retun 400 if rental already processed", async () => {
    rental.dateReturned = new Date();
    rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should retun 200 if request is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should set the return date if input is valid", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.dateReturned).toBeDefined();
  });

  it("should  return rental free ", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it("should increase stock if movie is returned", async () => {
    const res = await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  } );
  

  it("should return rental if input is valid", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
        "_id",
      ]),
    );
  });
});
