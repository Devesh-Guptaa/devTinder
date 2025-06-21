console.log('Hekllo World');

const express = require('express');

const app = express();

app.use((req, res) => {
  res.end('Heelo from server');
});

app.use("/test", (req, res) => {
  res.end('Heelo from server');
});

app.listen(3000, () => {
  console.log('Successfully running on port 3000');
});
