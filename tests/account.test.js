// import request from "supertest";
// import app from "../src/server.js";
// import { Enums, Codes, Messages } from "../src/enums/enums.js";

// describe("POST /api/v1/register", () => {
//   it("should create a duplucation account and return 400 status", async () => {
//     const res = await request(app).post("/api/v1/register").send({
//       name: "testuser",
//       email: "test@example.com",
//       password: "Test@1234",
//       telephone: "0909877913",
//     });

//     expect(res.statusCode).toBe(400);
//     expect(res.body).toHaveProperty("status", Enums.FAILED);
//     expect(res.body).toHaveProperty("code", Codes.AC_005);
//     expect(res.body).toHaveProperty("message", Messages.AC_005);
//   });
// });
