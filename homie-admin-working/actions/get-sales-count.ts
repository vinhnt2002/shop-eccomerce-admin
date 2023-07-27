import prismadb from "@/lib/prismadb";

export const getSalesCount = async () => {
  const salesCount = await prismadb.orderBill.count({
    where: {
      isPaid: true
    },
  });

  return salesCount;
};
