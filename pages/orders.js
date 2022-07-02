import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import CustomerOrderCard from "../components/CustomerOrderCard";
import { StoreContext } from "../context/StoreContext";

const OrdersPage = () => {
  const { customerOrders: orders, products } = useContext(StoreContext);
  const [amount, setAmount] = useState([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);

  useEffect(() => {
    let amt = 0.0;
    orders.forEach((order) => {
      const prods = products.filter(
        (prod) => prod.id === order.attributes?.product
      );
      prods.forEach((p) => {
        amt += p.attributes?.price * order.attributes?.qty;
      });
    });
    setAmount((prevAmt) => prevAmt.concat(amt));
  }, [orders, products]);

  useEffect(() => {
    if (search.length === 0) setResult(orders);
    setResult(
      orders?.filter((order) =>
        order.id.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, orders]);
  return (
    <div className="flex flex-col space-y-4">
      <Head>
        <title>Blockstore | Orders</title>
      </Head>
      <div className="items-center flex flex-col justify-center space-y-2 w-full">
        <h3 className="text-center text-white text-2xl">Orders</h3>
        <div className="flex form-control">
          <label className="input-group">
            <span>
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Search for Orders"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-[200px] md:w-[400px]"
            />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-2">
        {result?.map((orderItem, idx) => (
          <CustomerOrderCard
            key={idx}
            customer={true}
            id={orderItem?.id}
            order={{
              ...orderItem?.attributes,
              product: products?.find(
                (prod) => prod.id === orderItem?.attributes?.product
              ),
              amount: amount[idx],
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
