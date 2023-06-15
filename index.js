import fetch from "node-fetch";

const getData = async () => {
  try {
    const [res, curre] = await Promise.all([
      fetch("https://api.escuelajs.co/api/v1/products?offset=1&limit=3"),
      fetch("https://api.exchangerate.host/convert?from=USD&to=EGP"),
    ]);
    if (!res.ok) {
      throw new Error("Request failed with status: " + res.status);
    }
    const data = await res.json();
    const { result: conversionRate } = await curre.json();

    const transformedData = {};

    data.forEach((product) => {
      const categoryId = product.category?.id;
      const categoryName = product.category?.name;

      if (!transformedData[categoryId]) {
        transformedData[categoryId] = {
          category: {
            id: categoryId,
            name: categoryName,
          },
          products: [],
        };
      }

      const transformedProduct = { ...product };
      transformedProduct.price *= conversionRate;

      transformedData[categoryId].products.push(transformedProduct);
    });

    const jsonData = JSON.stringify(Object.values(transformedData), null, 2);
    console.log(jsonData);
  } catch (error) {
    console.log(error);
  }
};

getData();
