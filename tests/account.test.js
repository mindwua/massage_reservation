// import request from "supertest";
// import app from "../src/server.js";

// describe("POST /api/v1/register", () => {
//   it("should create a new account and return 201 status", async () => {
//     const res = await request(app).post("/api/v1/register").send({
//       name: "testuser",
//       email: "test@example.com",
//       password: "Test@1234",
//       telephone: "0909877913",
//     });

//     expect(res.statusCode).toBe(201);
//     expect(res.body).toHaveProperty("status", true);
//     w;
//     expect(res.body).toHaveProperty("code", "AC-001");
//     expect(res.body).toHaveProperty("message", "Account created");
//     expect(res.body).toHaveProperty(
//       "data",
//       '{"name":"testuser","password":"Test@1234","email":"test@example.com","telephone":"0909877913"}'
//     );
//   });
// });
