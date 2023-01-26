import { parse } from "csv-parse";
import fs from "fs";

function getData(file: string) {
    const orders: string[] = [];
    return new Promise<string[]>((res, rej) => {
        fs.createReadStream(file)
        .pipe(parse({ delimiter: ";", from_line: 2}))
        .on("data", (row) => {
            orders.push(row.toString())
        })
        .on("end", function () {
            console.log("finished");
            res(orders);
        })
        .on("error", function (error) {
            console.log(error);
            rej(error);
        });

    });
}

function countOrdersPerCompany(orders: string[]) {
    const ordersPerCompany = new Map<string, number>();
    orders.forEach((order) => {
        if (ordersPerCompany.has(order)) {
            //@ts-ignore
            ordersPerCompany.set(order, ordersPerCompany.get(order) + 1);
        } else {
            ordersPerCompany.set(order, 1);
        }
    });
    return ordersPerCompany;
}

function parseLine(line: string) {
    const [p1, _] = line.split(",");

    return p1
}

function sort(orders: Map<string, number>) {
    let unSortedarr = [...orders]
    const sortedArr = unSortedarr.sort(([_, v1], [__, v2]) => {
        if (v1 > v2) {
            return -1
        }
        if (v1 < v2) {
            return 1
        }
        return 0
    })
    return sortedArr;
}

async function run() {
    const awaitedData = await getData("src/car_orders.csv").then((res) => res)
    return awaitedData;
}

async function main() {
    const ordersPerCompany = await run().
        then((res) => res.
             map(x => parseLine(x)));
    return countOrdersPerCompany(ordersPerCompany);
}


main().then((res) => {
    const arr = sort(res)
    console.log(arr)
});





