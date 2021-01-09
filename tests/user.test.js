const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Jorge",
      email: "jorge@lopes.com",
      password: "PassMy444!",
    })
    .expect(201);
});

test("Should login successfully", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "nonexistent@hey.com",
      password: "12314123DDDDd",
    })
    .expect(400);
});

test("Should get profile for user", async () => {
  await request(app).get("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete account for the user", async () => {
  await await request(app).delete("/users/me").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBe(null);
});

test("Should not delete account for the user", async () => {
  await await request(app).delete("/users/me").send().expect(401);
});

test("Should upload avatar image", async () => {
  await request(app).post("/users/me/avatar").set("Authorization", `Bearer ${userOne.tokens[0].token}`).attach("avatar", "tests/fixtures/profile.jpg").expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "maria@maria.com",
    })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.email).toEqual("maria@maria.com");
});

test("Should not update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "maria@maria.com",
    })
    .expect(400);
});
