const express = require("express");

const routesV1 = require("./.vscode/routes/v1");

const app = express();

routesV1(app);

app.listen(3304, () => {
  console.log("running on 3304");
});
