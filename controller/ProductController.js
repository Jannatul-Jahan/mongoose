const ProductModel = require("../model/Product");
const { success, failure } = require("../util/common");
const {validationResult} = require("express-validator");

class Product {
  async getAll(req, res) {
    try {
      const products = await ProductModel.getAll();
      return res.status(200).send(success("Successfully received all products", products));
    } catch (error) {
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async getOneById(req, res){
    try{
      const {id} = req.params;
      const products = await ProductModel.getOneById(id);
      if(products.success){
        return res.status(200).send(success("Successfully received the product", products));
      } else{
        return res.status(400).send(failure("Failed to receive the product"));
      }
    } catch(error){
      return res.status(500).send(failure("Internal server error!"));
    }
  }

  async deleteById(req, res) {
    try {
      const { id } = req.query;
      const products = await ProductModel.deleteById(id);
      if (products.success) {
        return res.status(200).send(success("Successfully deleted the product"));
      } else {
        return res.status(401).send(failure("Product couldn't be found!"));
      }
    } catch (error) {
      return res.status(500).send(failure("Internal server error!"));
    }
  }

  async create(req, res) {
    try {
      const validation = validationResult(req).array();
      console.log(validation);
      if(validation.length>0){
        return res.status(422).send(failure("Invalid Inputs provided", validation));
      } else{
        const newProductData = req.body;
        console.log(newProductData);
        const products = await ProductModel.create(newProductData);
        return res.status(200).send(success("Successfully received all products", products));
      }
    } catch (error) {
      return res.status(500).send(failure("Internal server error"));
    }
  }

  async update(req, res){
    try{
      const {id} = req.params;
      const updatedProductData = req.body;
        
      const products = await ProductModel.update(id, updatedProductData);
      if(products.success){
        return res.status(200).send(success("Successfully updated the product", products));
      } else{
        return res.status(402).send(failure("Failed to update the product"));
      }
    } catch(error){
      return res.status(500).send(failure("Internal server error!"));
    }
  }

  async querySearch(req, res) {
    try {
      const queryParams = req.query;
      const products = await ProductModel.querySearch(queryParams);
      if (products.success) {
        return res.status(200).send(success("Successfully got the product.", products.data));
      } else {
        return res.status(401).send(failure("Product couldn't be found!"));
      }
    } catch (error) {
      return res.status(500).send(failure("Internal server error!"));
    }
  }

}

module.exports = new Product();