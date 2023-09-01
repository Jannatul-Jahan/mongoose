const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const { success, failure } = require("../util/common");

class Product {
  async getAll() {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "manga.json"), { encoding: "utf-8" })
      .then((data) => {
        return JSON.parse(data);
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  }

  async getOneById(id) {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "manga.json"), { encoding: "utf-8" })
      .then((data) => {
        const findData = JSON.parse(data).filter((element) => {
          return element.id === Number(id);
        })[0];
        if (findData) {
          return { success: true, data: findData };
        } else {
          return { success: false };
        }
      });
  }

  async deleteById(id) {
    try {
      const data = await fsPromise.readFile(path.join(__dirname, "..", "data", "manga.json"), { encoding: "utf-8" });
      const allData = JSON.parse(data);

      const indexToRemove = allData.findIndex(product => product.id === Number(id));
      if (indexToRemove !== -1) {
        const removedProduct = allData.splice(indexToRemove, 1)[0];
        await fsPromise.writeFile(path.join(__dirname, "..", "data", "manga.json"), JSON.stringify(allData, null, 2), { encoding: "utf-8" });
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  }

  async create(newProductData) {
    try {
      const data = await fsPromise.readFile(path.join(__dirname, "..", "data", "manga.json"), { encoding: "utf-8" });
      const allData = JSON.parse(data);

      let newProductId;
      if (allData.length > 0) {
        newProductId = allData[allData.length - 1].id + 1;
      } else {
        newProductId = 1;
      }
      const newProduct = { id: newProductId, ...newProductData };
      allData.push(newProduct);

      await fsPromise.writeFile(path.join(__dirname, "..", "data", "manga.json"), JSON.stringify(allData, null, 2), { encoding: "utf-8" });
      return { success: true, data: newProduct };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
}

async update(id, updatedProductData) {
  try {
    const data = await fsPromise.readFile(path.join(__dirname, "..", "data", "manga.json"), { encoding: "utf-8" });
    const allData = JSON.parse(data);

    const indexToUpdate = allData.findIndex(product => product.id === Number(id));
    if (indexToUpdate !== -1) {
      allData[indexToUpdate] = { ...allData[indexToUpdate], ...updatedProductData };
      await fsPromise.writeFile(path.join(__dirname, "..", "data", "manga.json"), JSON.stringify(allData, null, 2), { encoding: "utf-8" });
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}


async sortData(data, sortBy, sortOrder) {
  try {
    let sortedData = [...data];

    if (sortBy === "price") {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (sortBy === "stock") {
      sortedData.sort((a, b) => a.stock - b.stock);
    } else if (sortBy === "id") {
      sortedData.sort((a, b) => a.id - b.id);
    } else if (sortBy === "author") {
      sortedData.sort((a, b) => a.author.localeCompare(b.author));
    }

    if (sortOrder === "desc") {
      sortedData.reverse();
    }

    return sortedData;
  } catch (error) {
    console.error(error);
    return [];
  }
}


async querySearch(queryParams) {
  try {
    const data = await fsPromise.readFile(
      path.join(__dirname, "..", "data", "manga.json"),
      { encoding: "utf-8" }
    );
    const allData = JSON.parse(data);
    if (queryParams.sortBy && queryParams.sortOrder) {
      const sortedData = await this.sortData(allData, queryParams.sortBy, queryParams.sortOrder);
      return { success: true, data: sortedData };
    } else if (queryParams.minPrice) {
      const minPrice = parseFloat(queryParams.minPrice);
      return { success: true, data: (allData.filter(product => product.price >= minPrice)) };
    } else if (queryParams.maxPrice && queryParams.maxStock) {
      const maxPrice = parseFloat(queryParams.maxPrice);
      const maxStock = parseFloat(queryParams.maxStock);
      return { success: true, data: (allData.filter(product => product.price <= maxPrice && product.stock <= maxStock)) };
    } else if (queryParams.maxPrice) {
      const maxPrice = parseFloat(queryParams.maxPrice);
      return { success: true, data: (allData.filter(product => product.price <= maxPrice)) };
    } else if (queryParams.price) {
      const price = parseFloat(queryParams.price);
      return { success: true, data: (allData.filter(product => product.price === price)) };
    } else if (queryParams.minStock) {
      const minStock = parseFloat(queryParams.minStock);
      return { success: true, data: (allData.filter(product => product.stock >= minStock)) };
    } else if (queryParams.maxStock) {
      const maxStock = parseFloat(queryParams.maxStock);
      return { success: true, data: (allData.filter(product => product.stock <= maxStock)) };
    } else if (queryParams.stock) {
      const stock = parseFloat(queryParams.stock);
      return { success: true, data: (allData.filter(product => product.stock === stock)) };
    } else if (queryParams.maxId && queryParams.maxPrice && queryParams.maxStock) {
      const maxId = parseFloat(queryParams.maxid);
      const maxPrice = parseFloat(queryParams.maxPrice);
      const maxStock = parseFloat(queryParams.maxStock);
      return { success: true, data: (allData.filter(product => product.id <= maxId && product.price <= maxPrice && product.stock <= maxStock)) };
    } else if (queryParams.maxId && queryParams.maxStock) {
      const maxId = parseFloat(queryParams.maxid);
      const maxStock = parseFloat(queryParams.maxStock);
      return { success: true, data: (allData.filter(product => product.id <= maxId && product.stock <= maxStock)) };
    } else if (queryParams.maxId && queryParams.maxPrice) {
      const maxId = parseFloat(queryParams.maxid);
      const maxPrice = parseFloat(queryParams.maxPrice);
      return { success: true, data: (allData.filter(product => product.id <= maxId && product.price <= maxPrice)) };
    } else if (queryParams.maxId) {
      const maxId = parseFloat(queryParams.maxId);
      return { success: true, data: (allData.filter(product => product.id <= maxId)) };
    } else if (queryParams.author) {
      const author = queryParams.author;
      return { success: true, data: (allData.filter(product => product.author.toLowerCase() === author.toLowerCase())) };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

}

module.exports = new Product();