const mongoose = require("mongoose");
const Course = require("./Course");

const stdSchema = new mongoose.Schema({
  name: String,
  age: Number, 
  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Course"
  }
});

// stdSchema.pre("find", () => {
//   console.log("Before Find Query");
// });

stdSchema.post("findOneAndDelete", async (res) => {
  let courses = res.courses;
  for(const courseId of courses) {
    await Course.findByIdAndDelete(courseId);
  }
});

const Student = mongoose.model("Student", stdSchema);

module.exports = Student;