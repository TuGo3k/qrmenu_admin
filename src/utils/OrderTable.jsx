"use client";
import { DataGrid } from "@mui/x-data-grid";
import getRequest from "./api/getRequest";
import deleteRequest from "./api/deleteRequest";
import React, { useState, useEffect } from "react";
import OrderContainer from "@/components/Order/OrderCard";
import dayjs from "dayjs";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Add, Paragliding } from "@mui/icons-material";

const OrderTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalfoodprice, setTotalFoodPrice] = useState(0);
  const [tables , setTables] = useState([])
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

useEffect(() => {
  if (selectedOrder && selectedOrder.products && products.length > 0) {
    const total = selectedOrder.products.reduce((sum, item) => {
      const matched = products.find((p) => p._id === item.product);
      return sum + (matched?.price || 0);
    }, 0);
    setTotalFoodPrice(total);
  }
}, [selectedOrder, products]);

  const handleClickOpen = () => {
    setEditingId(null);
    setOpen(true);
  };

  useEffect(() => {
    if (isLoading) {
      Promise.all([
        getRequest({
          route: "/order",
          setValue: setOrder,
          setIsLoading,
          errorFunction: () => console.error("Failed to fetch data"),
        }),
        getRequest({
          route: "/product",
          setValue: setProducts,
          setIsLoading,
          errorFunction: () => console.error("Failed to fetch data"),
        }),
        getRequest({
          route: "/table",
          setValue: setTables,
          setIsLoading,
          errorFunction: () => console.error("Failed to fetch data"),
        }),
      ]);
    }
  }, [isLoading]);

  console.log(selectedOrder, "orderorder");

  // const handleEdit = (row) => {
  //   const subcat = subTitles.find((item) => item.title === row.subcategory);

  //   setFormData({
  //     title: row.title,

  //     price: row.price,
  //   });
  //   setEditingId(row.id);
  //   setOpen(true);
  // };

  const closeDetail = () => {
    setSelectedOrder(null);
  };

  const detail = (e) => {
    const filtered = order.find((pro) => pro._id === e.id);
    if (!filtered) return;
    setSelectedOrder(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ///////---------УСТГАХ ХЭСЭГ------------//////////////
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
      setDeleteModalOpen(false); // Close the modal
      setDeleteRowId(null); // Clear the row ID
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error("Failed to delete the product:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false); // Close the modal
    setDeleteRowId(null); // Clear the row ID
  };

  const columns = [
    {
      field: "index",
      headerName: "№",
      flex: 0,
      align: "center",
      headerAlign: "center",
      width: 50
    },
    {
      field: "tableId",
      headerName: "Ширээний дугаар",
      flex: 1,
      renderCell: (params) => {
        const table = tables.find((e) => e._id === params.value);
        return <span>{table?.name || "-"}</span>;
      },
    },
    {
      field: "isPaid",
      headerName: "Төлөв",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <span style={{ color: params.value ? "green" : "red" }}>
          {params.value ? "Төлөгдсөн" : "Төлөгдөөгүй"}
        </span>
      ),
    },
    {field: "createdAt",
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
        <span
          onClick={() => detail(params.row)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Дэлгэрэнгүй
        </span>
      ),
    },  
  ];

  const rows = order.map((order, index) => ({
    id: order._id,
    index: index + 1,
    tableId: order.tableId,
    isPaid: order.isPaid,
    createdAt: dayjs(order.createdAt).format("YYYY-MM-DD HH:mm"),
    price: order.price,
  }));
  return (
    <Card>
      <CardHeader
        title="Захиалгууд"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleClickOpen}
          >
            Нэмэх
          </Button>
        }
      />
      <CardContent>
        <div className="w-full h-screen">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={7}
            getRowHeight={(params) => {
              if (
                params.model.description &&
                params.model.description.length > 50
              ) {
                return 100;
              }
              return 80; 
            }}
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
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={closeDetail} 
        >
          <div
            style={{ position: "relative", zIndex: 1000 }}
            onClick={(e) => e.stopPropagation()} 
          >
            <OrderContainer
              orderNumber={3}
              tableNumber={selectedOrder.table}
              items={selectedOrder.products.map((el) => {
                const matchedProduct = products.find(
                  (p) => p._id === el.product
                );
                return {
                  name: matchedProduct?.title || "Unknown",
                  price: matchedProduct?.price || 0,
                  image: matchedProduct?.cover || "no-jpg",
                };
              })}
              totalprice={totalfoodprice}
            />
          </div>
        </div>
      )}

      {/* //////----------УСТГАХ ХЭСЭГ-----------/////// */}
      {/* <Dialog open={deleteModalOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Баталгаажуулалт</DialogTitle>
        <DialogContent>
          Та энэ мөрийг устгахдаа итгэлтэй байна уу?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Болих
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="secondary"
            variant="contained"
          >
            Устгах
          </Button>
        </DialogActions>
      </Dialog> */}
    </Card>
  );
};

export default OrderTable;
