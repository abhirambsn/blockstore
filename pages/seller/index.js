import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { FaPlus, FaSearch } from "react-icons/fa";
import Head from "next/head";
import SellerProductCard from "../../components/SellerProductCard";
import CustomerOrderCard from "../../components/CustomerOrderCard";

const SellerDashboard = () => {
  const { listedProducts, listProduct, orders } = useContext(StoreContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [cogs, setCogs] = useState(0);

  const [orderSearch, setOrderSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [orderResult, setOrderResult] = useState([]);
  const [productResult, setProductResult] = useState([]);

  useEffect(() => {
    const calcCOGS = () => {
      let total = 0;
      orders.forEach((order) => {
        listedProducts?.forEach((prod) => {
          if (prod.id === order?.attributes?.product) {
            total += prod?.attributes?.price * parseInt(order?.attributes?.qty);
          }
        });
      });
      setCogs(total);
    };
    calcCOGS();
  }, [listedProducts, orders]);

  useEffect(() => {
    if (orderSearch.length === 0) {
      setOrderResult(orders);
      return;
    }
    setOrderResult(
      orders?.filter((order) =>
        order.id.toLowerCase().includes(orderSearch.toLowerCase())
      )
    );
  }, [orderSearch, orders]);

  useEffect(() => {
    if (productSearch.length === 0) {
      setProductResult(listedProducts);
      return;
    }
    setProductResult(
      listedProducts?.filter((prod) =>
        prod.attributes.name.toLowerCase().includes(productSearch.toLowerCase())
      )
    );
  }, [listedProducts, productSearch]);

  return (
    <div className="flex flex-col space-y-7">
      <Head>
        <title>Blockstore | Seller Dashboard</title>
      </Head>
      <h3 className="text-center text-3xl font-bold text-white">
        Seller Dashboard
      </h3>

      <div className="stats stats-vertical lg:stats-horizontal shadow">
        <div className="stat place-items-center">
          <div className="stat-title">Products Listed</div>
          <div className="stat-value text-success">
            {listedProducts?.length}
          </div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Products Sold</div>
          <div className="stat-value text-warning">{orders?.length}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Cost of Goods Sold</div>
          <div className="stat-value text-info">{cogs} ETH</div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-10">
            <h3 className="text-center text-white text-2xl">All Products</h3>
            <label
              htmlFor="addProduct-modal"
              className="flex items-center modal-button justify-start space-x-4 btn btn-success btn-outline rounded-full"
            >
              <FaPlus />
              <span className="hidden md:inline">Add Product</span>
            </label>
          </div>
          <div className="flex form-control">
            <label className="input-group">
              <span>
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search for Products"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="input input-bordered w-[200px] md:w-[400px]"
              />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-2">
          {productResult?.map((listItem, idx) => (
            <SellerProductCard product={listItem?.attributes} id={listItem?.id} key={idx} />
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-center justify-evenly space-y-2">
          <h3 className="text-center text-white text-2xl">Orders</h3>
          <div className="flex form-control">
            <label className="input-group">
              <span>
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search for Orders"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="input input-bordered w-[200px] md:w-[400px]"
              />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-2">
          {orderResult?.map((orderItem, idx) => (
            <CustomerOrderCard
              order={{
                ...orderItem?.attributes,
                product: listedProducts?.find(
                  (prod) => prod.id === orderItem?.attributes?.product
                ),
              }}
              customer={false}
              id={orderItem?.id}
              key={idx}
            />
          ))}
        </div>
      </div>
      <input type="checkbox" id="addProduct-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Add Product</h3>
          <div className="py-4 flex flex-col items-start justify-start">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="url"
                placeholder="https:// or ipfs://"
                className="input input-bordered"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Name.."
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Brand</span>
              </label>
              <input
                type="text"
                placeholder="Brand"
                className="input input-bordered"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <input
                type="text"
                placeholder="Category"
                className="input input-bordered"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter price</span>
              </label>
              <label className="input-group">
                <input
                  type="text"
                  placeholder="0.01"
                  className="input w-full input-bordered"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <span>ETH</span>
              </label>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="modal-action flex justify-between items-center">
            <label htmlFor="addProduct-modal" className="btn btn-error">
              Close
            </label>
            <label
              onClick={() =>
                listProduct({
                  name,
                  brand,
                  category,
                  price,
                  description,
                  image,
                })
              }
              htmlFor="addProduct-modal"
              className="btn btn-success flex items-center justify-center space-x-2"
            >
              <FaPlus />
              <span>Add Product</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
