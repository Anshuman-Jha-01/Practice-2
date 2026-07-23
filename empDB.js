// const mongoose = require("mongoose");
// const Student = require("./model/Student");
// const Course = require("./model/Course");

const { default: axios } = require("axios");

// async function connect() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/practice");
// }

// connect()
//   .then((res) => {
//     console.log("Connection Established");
//   })
//   .catch((err) => {
//     console.log(err);
//   });


// const st = new Student({name: "Ajay", age: 22});
// const c1 = new Course({name: "Java", price: 21.23});
// const c2 = new Course({name: "Python", price: 29.23});

// st.courses.push(c1);
// st.courses.push(c2);

// c1.student = st.name;
// c2.student = st.name;

// c1.save();
// c2.save();
// st.save();

async function data(params) {
  // let res = await fetch("http://localhost:3000/data", {
  //   method: "PUT",
  //   headers: {
  //     "content-type": "application/json"
  //   },
  //   body: JSON.stringify({name: "Ajay", age: 21})
  // });
  // let data = await res.json();
  // console.log(data);
  let res = await axios("http://localhost:3000/data", {
    method: "PUT",
    headers: {
      'Content-Type': "application/json"
    },
    data: {name: "Ajay"}
  });
  console.log(res.data);
  
}

data();