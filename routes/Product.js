const express = require("express");
const routes = express();
const ProductController = require("../controller/ProductController");
const createValidation = require("../middleware/validation");
const updateValidation = require("../middleware/validation1");

routes.get("/all", ProductController.getAll);
routes.get("/details/:id", ProductController.getOneById);
routes.get("/search", ProductController.querySearch);
routes.delete("/details", ProductController.deleteById);
routes.post("/add", createValidation.create , ProductController.create);
routes.patch("/details/:id", updateValidation, ProductController.update);



module.exports = routes;