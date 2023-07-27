import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (): Promise<GraphData[]> => {
  const paidOrders = await prismadb.orderBill.findMany({
    where: {
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  // Grouping the orders by month and summing the revenue
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth(); // 0 for Jan, 1 for Feb, ...
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price.toNumber();
    }

    // Adding the revenue for this order to the respective month
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  // Converting the grouped data into the format expected by the graph
  const graphData: GraphData[] = [
    { name: "tháng 1", total: 0 },
    { name: "tháng 2", total: 0 },
    { name: "tháng 3", total: 0 },
    { name: "tháng 4", total: 0 },
    { name: "tháng 5", total: 0 },
    { name: "tháng 6", total: 0 },
    { name: "tháng 7", total: 0 },
    { name: "tháng 8", total: 0 },
    { name: "tháng 9", total: 0 },
    { name: "tháng 10", total: 0 },
    { name: "tháng 11", total: 0 },
    { name: "tháng 12", total: 0 },
  ];

  // Filling in the revenue data
  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};
