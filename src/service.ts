import { getData } from "./teleservice"
import { sort } from "./teleservice"

function parseLine(line: string) {
    const [_, k, p1, v] = line.split(",");

    return p1
}


async function run() {
    const awaitedData = await getData("src/car_orders.csv").then((res) => res)
    return awaitedData;
}

function countOrdersPerCarBrand(orders: string[]) {
    const ordersPerBrand = new Map<string, number>();
    orders.forEach((order) => {
        if (ordersPerBrand.has(order)) {
            //@ts-ignore
            ordersPerBrand.set(order, ordersPerBrand.get(order) + 1);
        } else {
            ordersPerBrand.set(order, 1);
        }
    });
    return ordersPerBrand;
}

async function main() {
    return await run().
        then((res) => res.
             map(x => parseLine(x)));
}

main().then(res => console.log(sort(countOrdersPerCarBrand(res))))


