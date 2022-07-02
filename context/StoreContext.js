import React, { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMoralis, useMoralisQuery, useMoralisWeb3Api } from "react-moralis";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { cartAtom } from "../atom/cartAtom";
import { escrowAbi, escrowAddress } from "../lib/constants";

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const {
    isAuthenticated,
    enableWeb3,
    Moralis,
    user,
    isWeb3Enabled,
    logout,
  } = useMoralis();

  const web3Api = useMoralisWeb3Api();

  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [amountDue, setAmountDue] = useState("");
  const [polygonScanLink, setPolygonScanLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState("0");

  const [isSeller, setIsSeller] = useState(false);
  const [cart, setCart] = useRecoilState(cartAtom);
  const [products, setProducts] = useState([]);
  const [txnUrls, setTxnUrls] = useState([]);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [orders, setOrders] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [listedProducts, setListedProducts] = useState([]);

  useEffect(() => {
    (async () => {
      await enableWeb3();
    })();
  }, [enableWeb3]);

  const getBalance = async () => {
    try {
      if (!isAuthenticated || !currentAccount) return;

      if (isWeb3Enabled) {
        const response = await web3Api.account.getNativeBalance({
          chain: "goerli",
          address: currentAccount,
        });
        const maticBalance = ethers.utils.formatEther(response.balance);
        setBalance(parseFloat(maticBalance).toFixed(5).toString());
      }
    } catch (err) {
      toast.error("Error Occurred");
      console.error(err);
    }
  };

  const getBSTBalance = useCallback(async () => {
    try {
      if (!isAuthenticated || !currentAccount) return;

      if (isWeb3Enabled) {
        const response = await web3Api.account.getNativeBalance({
          chain: "goerli",
          address: currentAccount,
        });
        const maticBalance = ethers.utils.formatEther(response.balance);
        setBalance(parseFloat(maticBalance).toFixed(5).toString());
      }
    } catch (err) {
      toast.error("Error Occurred");
      console.error(err);
    }
  }, [isAuthenticated, currentAccount, isWeb3Enabled]);

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        await enableWeb3();
        await getBSTBalance();
        const account = await user?.get("ethAddress");
        setCurrentAccount(account);
      }
    })();
  }, [isAuthenticated, user, currentAccount, getBSTBalance, enableWeb3]);

  const logOut = async () => {
    setCurrentAccount("");
    setBalance("0");
    setCart([]);
    await logout();
    toast.success("Logged out successfully");
  };

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useMoralisQuery("Product");

  useEffect(() => {
    const getProducts = async () => {
      try {
        await enableWeb3();
        setProducts(productData);
      } catch (err) {
        console.error(err);
      }
    };
    (async () => {
      if (isWeb3Enabled) {
        await getProducts();
      }
    })();
  }, [enableWeb3, isWeb3Enabled, productData]);

  useEffect(() => {
    const getListedProducts = async () => {
      try {
        await enableWeb3();
        const listed = products?.filter(
          (product) =>
            product?.attributes?.seller.toLowerCase() === currentAccount
        );
        setListedProducts(listed);
      } catch (err) {
        console.error(err);
      }
    };
    (async () => {
      await getListedProducts();
    })();
  }, [enableWeb3, isWeb3Enabled, products, currentAccount]);

  const buyProducts = () => {
    try {
      cart?.map(async (cartItem, idx) => {
        try {
          const amt = (cartItem?.price * cartItem?.qty).toString();
          const msgVal = ethers.utils.parseEther(amt);
          const options = {
            contractAddress: escrowAddress,
            abi: escrowAbi,
            functionName: "initializeEscrowAccount",
            msgValue: msgVal,
            params: {
              _seller: cartItem?.seller,
              amount: ethers.utils.parseEther(amt),
            },
          };
          let txn = await Moralis.executeFunction(options);
          let result = await txn.wait(1);
          const escrowId = parseInt(result?.events[0]?.args[0]);
          setTxnUrls((txnUrls) => [
            ...txnUrls,
            `https://goerli.etherscan.com/tx/${result?.transactionHash}`,
          ]);
          const order = new Moralis.Object("Order");
          order.set("product", cartItem?.id);
          order.set("user", currentAccount);
          order.set("qty", cartItem?.qty);
          order.set("escrowId", escrowId.toString());
          order.set("txnHash", result?.transactionHash);
          order.set("seller", cartItem?.seller);
          const res = await order.save();
          await getBSTBalance();
          setIsLoading(false);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
          setError(true);
          var errorMessageInJson = JSON.parse(err.message.slice(149, -417));
          var errorMessageToShow = errorMessageInJson?.message;
          setErrorMsg(errorMessageToShow);
        }
      });
    } catch {
      setIsLoading(false);
      setError(true);
    }
  };

  const listProduct = async (data) => {
    const notification = toast.loading("Listing Product...");
    try {
      if (
        !data?.name ||
        !data?.price ||
        !data?.description ||
        !data?.image ||
        !data?.brand ||
        !data?.category ||
        !isAuthenticated ||
        !currentAccount
      ) {
        toast.error("Please fill all the fields", { id: notification });
        return;
      }
      const product = new Moralis.Object("Product");
      product.set("name", data?.name);
      product.set("description", data?.description);
      product.set("price", parseFloat(data?.price));
      product.set("seller", currentAccount);
      product.set("brand", data?.brand);
      product.set("image", data?.image);
      product.set("rating", 3.0);
      product.set("category", data?.category);
      const res = await product.save();
      toast.success("Product Listed Successfully", { id: notification });
    } catch (err) {
      console.error(err);
      toast.error("Error Occurred", { id: notification });
    }
  };

  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
  } = useMoralisQuery("Order", (query) => query.descending("createdAt"));

  useEffect(() => {
    const getOrders = async () => {
      try {
        await enableWeb3();
        const orderBySeller = orderData?.filter((order) => {
          return (
            order?.attributes?.seller.toLowerCase() ===
            currentAccount.toLowerCase()
          );
        });
        setOrders(orderBySeller);
      } catch (err) {
        console.error(err);
      }
    };
    (async () => {
      if (isWeb3Enabled) {
        await getOrders();
      }
    })();
  }, [enableWeb3, isWeb3Enabled, currentAccount, orderData, productData]);

  useEffect(() => {
    const getOrderByCustomer = async () => {
      try {
        await enableWeb3();
        const orderByCustomer = orderData?.filter(
          (order) => order?.attributes?.user === currentAccount
        );
        setCustomerOrders(orderByCustomer);
      } catch (err) {
        console.error(err);
      }
    };
    (async () => {
      if (isWeb3Enabled) {
        await getOrderByCustomer();
      }
    })();
  }, [currentAccount, enableWeb3, isWeb3Enabled, orderData]);

  const markAsShipped = async (orderId, escrowId) => {
    const notification = toast.loading("Marking as Shipped...");
    try {
      const options = {
        contractAddress: escrowAddress,
        abi: escrowAbi,
        functionName: "markShipped",
        params: {
          escrowId,
        },
      };
      if (isWeb3Enabled) {
        const res = await Moralis.executeFunction(options);
        await res.wait(2);
        const order = orderData?.find((order) => order?.id === orderId);
        order.set("status", "Shipped");
        await order?.save();
        toast.success("Order Marked as Shipped Successfully", {
          id: notification,
        });
      } else {
        toast.error("Web 3 is not enabled", { id: notification });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error Occurred", { id: notification });
    }
  };

  const markAsDelivered = async (orderId, escrowId) => {
    const notification = toast.loading("Marking as Delivered...");
    try {
      const options = {
        contractAddress: escrowAddress,
        abi: escrowAbi,
        functionName: "markDelivered",
        params: {
          escrowId,
        },
      };
      if (isWeb3Enabled) {
        const res = await Moralis.executeFunction(options);
        await res.wait(2);
        const order = orderData?.find((order) => order?.id === orderId);
        order.set("status", "Delivered");
        await order?.save();
        toast.success("Order Delivered Successfully", {
          id: notification,
        });
      } else {
        toast.error("Web 3 is not enabled", { id: notification });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error Occurred", { id: notification });
    }
  };

  const releaseFunds = async (orderId, escrowId) => {
    const notification = toast.loading(
      `Releasing Funds from Escrow #${escrowId}...`
    );
    try {
      const options = {
        contractAddress: escrowAddress,
        abi: escrowAbi,
        functionName: "releaseFunds",
        params: {
          escrowId,
        },
      };
      if (isWeb3Enabled) {
        const res = await Moralis.executeFunction(options);
        await res.wait(2);
        const order = orderData?.find((order) => order?.id === orderId);
        order.set("status", "Completed");
        await order?.save();
        toast.success("Funds Release Successful! Check your account", {
          id: notification,
        });
      } else {
        toast.error("Web 3 is not enabled", { id: notification });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error Occurred", { id: notification });
    }
  };

  useEffect(() => {
    (async () => {
      if (isWeb3Enabled) {
        const productQuery = new Moralis.Query("Product");
        let productSubscription = await productQuery.subscribe();
        productSubscription.on("create", (object) => {
          setProducts((oldProductData) => {
            oldProductData.concat(object);
            return oldProductData;
          });
        });

        return () => productSubscription.unsubscribe();
      }
    })();
  }, [Moralis.Query, isWeb3Enabled]);

  useEffect(() => {
    (async () => {
      if (isWeb3Enabled) {
        const orderQuery = new Moralis.Query("Order");
        let orderSubscription = await orderQuery.subscribe();
        orderSubscription.on("create", (object) => {
          setOrders((oldOrderData) => {
            oldOrderData.concat(object);
            return oldOrderData;
          });
        });

        return () => orderSubscription.unsubscribe();
      }
    })();
  }, [Moralis.Query, isWeb3Enabled]);

  const refund = async (orderId, escrowId) => {
    const notification = toast.loading(
      `Processing Refund for Order #${orderId}...`
    );
    try {
      const options = {
        contractAddress: escrowAddress,
        abi: escrowAbi,
        functionName: "refund",
        params: {
          escrowId,
        },
      };
      if (isWeb3Enabled) {
        const res = await Moralis.executeFunction(options);
        await res.wait(2);
        const order = orderData?.find((order) => order?.id === orderId);
        order.set("status", "Refunded");
        await order?.save();
        toast.success("Refund Successful! Check your account", {
          id: notification,
        });
      } else {
        toast.error("Web 3 is not enabled", { id: notification });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error Occurred", { id: notification });
    }
  };

  const {
    data: reviewData,
    isLoading: reviewDataLoading,
    error: reviewError,
  } = useMoralisQuery("Review", (query) => query.descending("createdAt"));

  useEffect(() => {
    (async () => {
      if (isWeb3Enabled) {
        const reviewQuery = new Moralis.Query("Review");
        let reviewSubscription = await reviewQuery.subscribe();
        reviewSubscription.on("create", (object) => {
          setReviews((oldReviews) => {
            oldReviews.concat(object);
            return oldReviews;
          });
        });

        return () => reviewSubscription.unsubscribe();
      }
    })();
  }, [Moralis.Query, isWeb3Enabled]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        await enableWeb3();
        setReviews(reviewData);
      } catch (err) {
        console.log(err);
      }
    };

    (async () => {
      if (isWeb3Enabled) {
        await getReviews();
      }
    })();
  }, [enableWeb3, isWeb3Enabled, reviewData]);

  const postReview = async (productId, data) => {
    if (!data || !productId) return;
    const notification = toast.loading("Posting Review...");
    try {
      const newReview = new Moralis.Object("Review");
      if (!data?.text || !data?.title || !data?.rating) {
        toast.error("Please Fill all Fields...", { id: notification });
        return;
      }
      newReview.set("productId", productId);
      newReview.set("user", currentAccount);
      newReview.set("text", data?.text);
      newReview.set("title", data?.title);
      newReview.set("rating", data?.rating);
      await newReview.save();
      const product = productData.find((prod) => prod?.id === productId);
      product.set("rating", (product?.attributes?.rating + data?.rating) / 2);
      await product.save();
      toast.success("Review Posted Successfully", { id: notification });
    } catch (err) {
      console.error(err);
      toast.error("Error Occurred", { id: notification });
    }
  };

  const deleteFromCart = (productId) => {
    setCart(cart.filter((product) => product.id !== productId));
    toast.success("Item removed from cart");
  };

  return (
    <StoreContext.Provider
      value={{
        isAuthenticated,
        user,
        currentAccount,
        logOut,
        balance,
        isLoading,
        setIsLoading,
        polygonScanLink,
        setPolygonScanLink,
        amountDue,
        setAmountDue,
        tokenAmount,
        setTokenAmount,
        cart,
        setCart,
        products,
        buyProducts,
        txnUrls,
        setTxnUrls,
        listedProducts,
        isSeller,
        setIsSeller,
        listProduct,
        orders,
        setOrders,
        markAsShipped,
        markAsDelivered,
        releaseFunds,
        customerOrders,
        setCustomerOrders,
        getBalance,
        refund,
        error,
        setError,
        errorMsg,
        setErrorMsg,
        postReview,
        deleteFromCart,
        reviews,
        setReviews,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
