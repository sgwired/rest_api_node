const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  //   res.send(req.params.id);
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");
  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.sendStatus(400).send(result.error.details);

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  //look up course if not found, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send("The course with the given ID was not found")
      .res.send(course);

  // validate if invalid, return 400 - bad request
  const { error } = validateCourse(req.body);
  if (error) res.sendStatus(400).send(result.error.details);

  //update course and return the updated course
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course)
    return res
      .status(404)
      .send("The course with the given ID was not found")
      .res.send(course);
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

// app.get("/api/posts/:year/:month", (req, res) => {
//   //   res.send(req.params);
//   res.send(req.query);
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
}
