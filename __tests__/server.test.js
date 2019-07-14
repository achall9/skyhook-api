import request from "supertest";
import app from "../app";

describe("Server Tests", () => {
  test("GET method should respond with 200", () => {
    request(app)
      .get("/api")
      .expect(200);
  });
});
