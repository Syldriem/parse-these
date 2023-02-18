import { getData } from "./teleservice"

type Line = {
    id: string,
    brand: string,
}
function parseLine(line: string) {
    const [id, _, brand, v] = line.split(",");

    return {id, brand} as Line
}


async function run() {
    const awaitedData = await getData("src/car_orders.csv").then((res) => res)
    return awaitedData;
}

function countOrdersPerCarBrand(orders: Line[]) {
    const ordersPerBrand = new Map<Line, number>();
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

function sort(orders: Map<Line, number>) {
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
async function main() {
    return await run().
        then((res) => res.
             map(x => parseLine(x)));
}

main().then(res => console.log(sort(countOrdersPerCarBrand(res))))
