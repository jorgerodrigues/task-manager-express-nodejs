const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const { userOneId, userOne, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From test 1",
    })
    .expect(201);
  const task = Task.findById(response.body._id);
  expect(task).not.toBeNull();
});

test("Should only get tasks owner by the user", async () => {
  const response = await request(app).get("/tasks").set("Authorization", `Bearer ${userOne.tokens[0].token}`).send().expect(200);
  expect(response.body.length).toEqual(2);
});

test("Should not be able to delete task owned by another user", async () => {
  const response = await request(app).delete(`/tasks/${taskOne._id}`).set("Authorization", `Bearer ${userTwo.tokens[0].token}`).send().expect(404);
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
