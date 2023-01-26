import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as path from 'path';

interface Order {
  company_id: string;
  region: string;
  car_brand: string;
  order_date: string;
}

// Define a function to parse the CSV file
async function parseCsv(filePath: string): Promise<Order[]> {
  const orders: Order[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: Order) => orders.push(data))
      .on('end', () => {
        resolve(orders);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

parseCsv("src/car_orders.csv");

// Define a function to calculate the number of orders per company
function countOrdersPerCompany(orders: Order[]): Map<string, number> {
  const ordersPerCompany = new Map<string, number>();
  orders.forEach((order) => {
    if (ordersPerCompany.has(order.company_id)) {
      ordersPerCompany.set(order.company_id, ordersPerCompany.get(order.company_id) + 1);
    } else {
      ordersPerCompany.set(order.company_id, 1);
    }
  });
  return ordersPerCompany;
}

// Define a function to calculate the number of orders per car brand
function countOrdersPerBrand(orders: Order[]): Map<string, number> {
  const ordersPerBrand = new Map<string, number>();
  orders.forEach((order) => {
    if (ordersPerBrand.has(order.car_brand)) {
      ordersPerBrand.set(order.car_brand, ordersPerBrand.get(order.car_brand) + 1);
    } else {
      ordersPerBrand.set(order.car_brand, 1);
    }
  });
  return ordersPerBrand;
}

// Define a function to calculate the most popular car brands per company
function mostPopularBrandsPerCompany(orders: Order[]): Map<string, Map<string, number>> {
  const brandsPerCompany = new Map<string, Map<string, number>>();
  orders.forEach((order) => {
    if (brandsPerCompany.has(order.company_id)) {
      if(brandsPerCompany.get(order.company_id).has(order.car_brand)){
        brandsPerCompany.get(order.company_id).set(order.car_brand,
            brandsPerCompany.get(order.company_id).get(order.car_brand) + 1);
      }else {
        brandsPerCompany.get(order.company_id).set(order.car_brand, 1);
      }
    } else {
      brandsPerCompany.set(order.company_id, new Map<string, number>().set(order.car_brand, 1));
    }
  });
  return brandsPerCompany;
}
