"use client";
import { DataGrid } from "@mui/x-data-grid";
import getRequest from "./api/getRequest";
import deleteRequest from "./api/deleteRequest";
import React, { useState, useEffect } from "react";
import OrderContainer from "@/components/Order/OrderTable";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
const OrderTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  //   const [formData, setFormData] = useState({
  //     title: "",
  //     description: "",
  //     price: "",
  //     subcategory: "",
  //   });

  //   console.log(order, "order");

  const handleClickOpen = () => {
    setEditingId(null);
    // setOrder({
    //   title: "",
    //   description: "",
    //   //   price: "",
    //   //   subcategory: "",
    // });
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
          })
    ])
    }
  }, [isLoading]);

  const handleEdit = (row) => {
    // console.log(row)
    const subcat = subTitles.find((item) => item.title === row.subcategory);

    setFormData({
      title: row.title,
      description: row.description,
      price: row.price,

      subcategory: subcat?._id || "",
    });
    // setCover(row.cover);
    setEditingId(row.id);
    setOpen(true);
    // console.log("FormData:", formData);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      cover: "",
      subcategory: "",
    });
  };

  const handleSubmit = async () => {
    const form = new FormData();
    // form.append("title", formData.title);

    try {
      if (editingId) {
        await axios.put(`${apiData.api_url}/product/${editingId}`, form);
      } else {
        await axios.post(`${apiData.api_url}/product`, form);
      }
      handleClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  const closeDetail = () => {
    setSelectedOrder(null);
  };

  const detail = (e) => {
    const filtered = order.find((pro) => pro._id === e.id);
    if (!filtered) return;
    setSelectedOrder(filtered);
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 220, maxWidth: 220 },
    // { field: "products", headerName: "", width: 200, maxWidth: 250 },
    // { field: "price", headerName: "Үнэ", width: 150, maxWidth: 180 },

    { field: "index", headerName: "№", width: 50, maxWidth: 70 },
    {
      field: "table",
      headerName: "Ширээний дугаар",
      width: 200,
      maxWidth: 250,
    },
    {
      field: "isPaid",
      headerName: "Төлөв",
      width: 180,
      maxWidth: 200,
      valueGetter: (params) => (params ? "Төлөгдөөгүй" : "Төлөгдсөн"),
    },
    {
      field: "detail",
      headerName: "Дэлгэрэнгүй",
      width: 140,
      maxWidth: 150,
      renderCell: (params) => (
        <>
          <button
            onClick={() => detail(params.row)}
            className="p-2 bg-white text-black"
          >
            Дэлгэрэнгүй
          </button>
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Үйлдэл",
      width: 250,
      maxWidth: 250,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)} color="primary">
            Засах
          </Button>

          <Button
            //   onClick={() => handleEdit(params.row)}
            color="primary"
          >
            Архивт хийх
          </Button>

          {/* <Button
            // onClick={() => handleDeleteClick(params.row.id)}
            color="secondary"
          >
            Устгах
          </Button> */}
        </>
      ),
    },
  ];

  const rows = order.map((order, index) => ({
    id: order._id,
    index: index + 1,
    table: order.table,
    isPaid: order.isPaid,
    price: order.price,
    createdAt: order.createdAt,
    // subcategory:
    //   subTitles.find((item) => item._id === product.subcategory)?.title || "",
    // cover: product.cover,
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
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={7}
            // getRowHeight={() => 80}
            getRowHeight={(params) => {
              // Example: Set a taller height for rows with long descriptions
              // console.log(params.model.description)
              if (
                params.model.description &&
                params.model.description.length > 50
              ) {
                return 100; // Taller height for long descriptions
              }
              return 80; // Default height
            }}
            sx={{
              "& .MuiDataGrid-row": {
                alignItems: "center", // Center content vertically
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
          onClick={closeDetail} // click outside to close
        >
          <div
            style={{ position: "relative", zIndex: 1000 }}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <OrderContainer
              orderNumber={3}
              tableNumber={selectedOrder.table}
              items={selectedOrder.products.map((el) => ({
                name: el.product,
                //   quantity: el.quantity,
                price: el.price,
                image: el.image || "",
              }))}
            />
          </div>
        </div>
      )}

      <Dialog
        open={open}
        // onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{"Захиалга үүсгэх"}</DialogTitle>
        <FormControl fullWidth margin="dense">
        <InputLabel id="subcategory-label">ширээ сонго</InputLabel>
        <Select
          labelId="subcategory-label"
          name="table"
          value={order.table}
          // onChange={handleInputChange}
          fullWidth
        >
          {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </Select>
        </FormControl>
        <DialogContent dividers>
          <TextField
            margin="dense"
            name="title"
            label="Гарчиг"
            //   value={formData.title}
            //   onChange={handleInputChange}
            fullWidth
          />

       

          <FormControl fullWidth margin="dense">
            <InputLabel id="subcategory-label">Хоолоо сонгоно уу</InputLabel>
            <Select
              labelId="subcategory-label"
              name="subcategory"
              // value={formData.subcategory}
              // onChange={handleInputChange}
              fullWidth
            >
              {products.map((el) => (
                      <MenuItem key={el._id} value={el._id}>
                        {el.title}
                      </MenuItem>
                    ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="price"
            label="Үнэ"
            type="number"
            //   value={formData.price}
            //   onChange={handleInputChange}
            fullWidth
          />
          {/* <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                  Зураг сонгох
                  <input
                    type="file"
                    name="cover"
                    hidden
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                </Button> */}
        </DialogContent>
        <DialogActions>
          <Button
          // onClick={handleClose}
          >
            Болих
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            Хадгалах
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default OrderTable;
