"use client";
import { DataGrid } from "@mui/x-data-grid";
import getRequest from "./api/getRequest";
import deleteRequest from "./api/deleteRequest";
import React, { useState, useEffect } from "react";
import OrderContainer from "@/components/Order/OrderCard";
import dayjs from "dayjs";
import {
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
} from "@mui/material";
import { useAuth } from "@/components/Context/AuthProvider";
import axios from "axios";
import { DeleteIcon, EyeIcon, Trash } from "lucide-react";
import { Alert } from "flowbite-react";
import toast from "react-hot-toast";
import socket from "../utils/socket/socket";


const OrderTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalfoodprice, setTotalFoodPrice] = useState(0);
  const [tables, setTables] = useState([]);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const { user, loading } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [newOrderCount, setNewOrderCount] = useState(0);


  useEffect(() => {
    socket.on("new-order", (newOrder) => {
      console.log("order:", newOrder);
      setOrder((prevOrders) => [newOrder, ...prevOrders]);
      toast.success('Захиалга орж ирлээ')
    });

    return () => {
      socket.off("new-order");
    };
  }, [socket]);

  useEffect(() => {
    if (selectedOrder && selectedOrder.products && products.length > 0) {
      const total = selectedOrder.products.reduce((sum, item) => {
        const matched = products.find((p) => p._id === item.product);
        return sum + (matched?.price || 0);
      }, 0);
      setTotalFoodPrice(total);
    }
  }, [selectedOrder, products]);

  const handleCheckout = async (orderId) => {
    try {
      await axios.put(
        `https://qmenubackender.onrender.com/api/v1/order/checkout/${orderId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setOrder((prevOrders) =>
        prevOrders.map((o) => (o._id === orderId ? { ...o, isPaid: true } : o))
      );
      setSelectedOrder(null);
    } catch (error) {
      console.error("Checkout алдаа:", error);
    }
  };

  useEffect(() => {
    if (isLoading && user && !loading) {
      Promise.all([
        getRequest({
          route: `/order?merchantId=${
            user.isMerchant ? user._id : user.merchantId
          }`,
          setValue: setOrder,
        }),
        getRequest({
          route: `/product?merchantId=${
            user.isMerchant ? user._id : user.merchantId
          }`,
          setValue: setProducts,
        }),
        getRequest({
          route: `/table?user=${user.isMerchant ? user._id : user.merchantId}`,
          setValue: setTables,
        }),
      ]).finally(() => {
        setIsLoading(false);
        if (order.length > 0) {
          toast.success("Захиалга орж ирлээ");
        }
      });
    }
  }, [isLoading, user, loading, order]);

  useEffect(() => {
    if (!isLoading && order.length > 0) {
      setRows(
        order.map((order, index) => ({
          id: order._id,
          index: index + 1,
          tableId: order.tableId,
          isPaid: Boolean(order.isPaid),
          createdAt: dayjs(order.createdAt).format("YYYY-MM-DD HH:mm"),
          price: order.price,
          user: user?._id || "-",
          merchantId: user?.merchantId || "-",
        }))
      );
    }
  }, [order, isLoading, user]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const detail = (e) => {
    const filtered = order.find((pro) => pro._id === e.id);
    if (filtered) {
      setSelectedOrder(filtered);
    }
  };

  const closeDetail = () => {
    setSelectedOrder(null);
  };

  const handleDeleteClick = (rowId) => {
    setDeleteRowId(rowId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRequest({
        route: `/order/${deleteRowId}`,
        setIsLoading,
      });
      setOrder((prev) => prev.filter((o) => o._id !== deleteRowId));
      setDeleteModalOpen(false);
      toast.success("Захиалга амжилттай устгагдлаа");
      setDeleteRowId(null);
    } catch (error) {
      console.error("Failed to delete the order:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteRowId(null);
  };

  const columns = [
    {
      field: "index",
      headerName: "№",
      width: 60,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "tableId",
      headerName: "Ширээ",
      flex: 1,
      renderCell: (params) => {
        const table = tables.find((e) => e._id === params?.value);
        return <span>{table?.name || "-"}</span>;
      },
    },
    {
      field: "isPaid",
      headerName: "Төлөв",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const isPaid = params?.value;
        const orderId = params?.row.id;
        return isPaid ? (
          <span className="text-green-600 font-bold">Төлөгдсөн</span>
        ) : (
          <div className="flex items-center gap-4">
            <button
              className="text-white bg-blue-500 hover:bg-blue-600 text-xs px-3 py-1 rounded"
              onClick={() => handleCheckout(orderId)}
            >
              Төлөх
            </button>
            <span className="text-red-600 font-bold">Төлөгдөөгүй</span>
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Огноо",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "detail",
      headerName: "Дэлгэрэнгүй",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <button
          onClick={() => detail(params?.row)}
          className="px-4 py-2 text-blue-600 hover:text-white rounded hover:bg-blue-600"
        >
          <EyeIcon />
        </button>
      ),
    },
    {
      field: "delete",
      headerName: "Устгах",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <button
          onClick={() => handleDeleteClick(params?.row.id)}
          className="px-4 py-2 text-white rounded hover:bg-red-600"
        >
          <Trash color="red"/>
        </button>
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        <div className="w-full h-screen">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={15}
            getRowHeight={() => 100}
            sx={{
              "& .MuiDataGrid-row": {
                alignItems: "center",
              },
            }}
          />
        </div>
      </CardContent>

      {selectedOrder && (
        <div
          className="fixed top-0 left-0 w-full h-full  backdrop-blur-sm flex justify-center items-center z-[999]"
          onClick={closeDetail}
        >
          <div
            className="relative z-[1000]"
            onClick={(e) => e.stopPropagation()}
          >
            <OrderContainer
              items={selectedOrder.products.map((el) => {
                const matchedProduct = products.find(
                  (p) => p._id === el.product
                );
                return {
                  name: matchedProduct?.title || "Unknown",
                  price: matchedProduct?.price || el.price || 0,
                  image: matchedProduct?.cover || "no-jpg",
                  total: el.total || 1,
                };
              })}
              onCheckout={() => handleCheckout(selectedOrder._id)}
              totalPrice={totalfoodprice}
            />
          </div>
        </div>
      )}

      <Dialog open={deleteModalOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Устгах</DialogTitle>
        <DialogContent>
          Та энэ захиалгыг устгахдаа итгэлтэй байна уу?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Болих</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
              Устгах
          </Button> 
        </DialogActions>
      </Dialog>

      <div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{
              width: "100%",
              backgroundColor: "yellow",
              color: "black",
            }}
          >
            Шинэ захиалга орж ирлээ!
          </Alert>
        </Snackbar>
      </div>
    </Card>
  );
};

export default OrderTable;
