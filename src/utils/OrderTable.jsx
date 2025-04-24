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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";
import apiData from "@/data/apidata";
const OrderTable = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalfoodprice, setTotalFoodPrice] = useState(0);

  const [deleteRowId, setDeleteRowId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    table: "",
    products: [],
    price: "",
  });

  //   console.log(order, "order");
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
        }),
      ]);
    }
  }, [isLoading]);
  console.log(selectedOrder, "orderorder");
  const handleEdit = (row) => {
    // console.log(row)
    const subcat = subTitles.find((item) => item.title === row.subcategory);

    setFormData({
      title: row.title,

      price: row.price,
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
      table: "",
      products: [],
      price: "",
    });
  };
  console.log("table", typeof formData.table);
  console.log("products", typeof formData.products);
  console.log("price", typeof formData.price);
  const handleSubmit = async () => {
    const form = new FormData();
    form.append("table", formData.table);
    // formData.products.forEach((productId, index) => {
    //   form.append(`products[${index}]`, productId);
    // });

    form.append(
      "products",
      formData.products.map((id) => ({ product: id }))
    );

    form.append("price", formData.price);
    // const form = [
    //   {
    //     table: formData.table,
    //     products: [formData.products],
    //     price: Number(formData.price),
    //   },
    // ];
    try {
      if (editingId) {
        await axios.put(`${apiData.api_url}/product/${editingId}`, form);
      } else {
        await axios.post(`${apiData.api_url}/order`, {
          table: formData.table,
          products: formData.products.map((id) => ({ product: id })),
          price: formData.price,
        });
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ///////---------УСТГАХ ХЭСЭГ------------//////////////
  const handleDeleteClick = (rowId) => {
    setDeleteRowId(rowId); // Store the row ID to delete
    setDeleteModalOpen(true); // Open the modal
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
    // { field: "id", headerName: "ID", width: 220, maxWidth: 220 },
    // { field: "products", headerName: "", width: 200, maxWidth: 250 },
    // { field: "price", headerName: "Үнэ", width: 150, maxWidth: 180 },

    {
      field: "index",
      headerName: "№",
      flex: 0,
      align: "center",
      headerAlign: "center",
      width: 50
    },
    {
      field: "table",
      headerName: "Ширээний дугаар",
      flex: 2,
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
    // {
    //   field: "actions",
    //   headerName: "Үйлдэл",
    //   flex: 3,
    //   renderCell: (params) => (
    //     <>
    //       <Button onClick={() => handleEdit(params.row)} color="primary">
    //         Засах
    //       </Button>
    //       <Button color="primary">Архивт хийх</Button>
    //       <Button onClick={() => handleDeleteClick(params.id)} color="secondary">
    //         Устгах
    //       </Button>
    //     </>
    //   ),
    // }
    
  ];

  const rows = order.map((order, index) => ({
    id: order._id,
    index: index + 1,
    table: order.table,
    isPaid: order.isPaid,
    createdAt: dayjs(order.createdAt).format("YYYY-MM-DD HH:mm"),
    price: order.price,
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
        <div className="w-full h-screen">
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
      <Dialog open={deleteModalOpen} onClose={handleDeleteCancel}>
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
      </Dialog>

      {/* //////------ЗАХИАЛГА ҮҮСГЭХ ХЭСЭГ------/////// */}
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
            value={formData.table}
            onChange={handleInputChange}
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="subcategory-label">Хоолоо сонгоно уу</InputLabel>
            <Select
              labelId="subcategory-label"
              name="products"
              value={formData.products}
              onChange={
                (e) => {
                  const selectedProductIds = e.target.value;

                  const selectedProducts = products.filter((product) =>
                    selectedProductIds.includes(product._id)
                  );

                  const totalfoodprice = selectedProducts.reduce(
                    (total, product) => total + product.price,
                    0
                  );

                  setFormData({
                    ...formData,
                    products: selectedProductIds,
                    price: totalfoodprice,
                  });
                  
                }

                // setFormData({
                //   ...formData,
                //   products: e.target.value,
                // })
              }
              multiple
              fullWidth
            >
              {products.map((el) => (
                <MenuItem key={el._id} value={el._id}>
                  {el.title}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Нийт үнэ: {formData.price.toLocaleString()}₮
            </Typography>
          </FormControl>
          {/* <TextField
            margin="dense"
            name="price"
            label="Үнэ"
            disabled
            type="number"
            value={formData.price}
            // onChange={(e) => {
            //   const selectedProductIds = e.target.value;

            //   const selectedProducts = products.filter((product) =>
            //     selectedProductIds.includes(product._id)
            //   );

            //   const totalfoodprice = selectedProducts.reduce(
            //     (total, product) => total + product.price,
            //     0
            //   );

            //   setFormData({
            //     ...formData,
            //     products: selectedProductIds,
            //     price: totalfoodprice,
            //   });
            // }}
            fullWidth
          /> */}
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
          <Button onClick={handleClose}>Болих</Button>
          <Button onClick={handleSubmit} variant="contained">
            Хадгалах
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default OrderTable;
