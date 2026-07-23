const express = require("express");
const router = express.Router({ mergeParams: true });

router
  .route("/view")
  .get((req, res) => {
    let { id } = req.params;
    res.send(`GET: Product Details for PID: ${id}`);
  })
  .post((req, res) => {
    let { id } = req.params;
    res.send(`POST: Product Details for PID: ${id}`);
  });

router.post("/add", (req, res) => {
  let { id } = req.params;
  res.send(`Product with PID ${id} was added.`);
});

router.put("/update", (req, res) => {
  let { id } = req.params;
  res.send(`Product Details updated for PID: ${id}`);
});

router.delete("/delete", (req, res) => {
  let { id } = req.params;
  res.send(`Product with PID ${id} was removed`);
});

module.exports = router;
