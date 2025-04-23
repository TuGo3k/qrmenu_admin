"use client";
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
import { useEffect, useState } from "react";
import axios from "axios";
import apiData from "@/data/apidata";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import getRequest from "./api/getRequest";
import deleteRequest from "./api/deleteRequest";
import CustomImageUpload from "./CustomImageUpload";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [subTitles, setSubTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [cover, setCover] = useState("");
console.log(products)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    subcategory: "",
  });

  useEffect(() => {
    if (isLoading) {
      Promise.all([
        getRequest({
          route: "/subcategory",
          setValue: setSubTitles,
          errorFunction: () => console.error("Failed to fetch data"),
        }),

        getRequest({
          route: "/product",
          setValue: setProducts,
          setIsLoading,
          errorFunction: () => console.error("Failed to fetch data"),
        }),
      ]).finally(() => setIsLoading(false));
    }
  }, [isLoading]);

  const handleClickOpen = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      subcategory: "",
    });
    setOpen(true);
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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cover") {
      // setCover(files[0]);
      setFormData({
        ...formData,
        cover: files[0],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // console.log("form shvv", cover);
  const handleSubmit = async () => {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("subcategory", formData.subcategory);

    if (cover && typeof cover !== "string") {
      form.append("file", cover);
    }

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

  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`${apiData.product_api_url}${id}`);
  //     fetchData();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const handleDeleteClick = (rowId) => {
    setDeleteRowId(rowId); // Store the row ID to delete
    setDeleteModalOpen(true); // Open the modal
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRequest({
        route: `/product/${deleteRowId}`,
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
    { field: "index", headerName: "№", width: 50, maxWidth: 70 },
    { field: "id", headerName: "ID", width: 220, maxWidth: 220 },
    { field: "title", headerName: "Барааны нэр", width: 230, maxWidth: 250 },
    { field: "description", headerName: "Тайлбар", width: 200, maxWidth: 250 },
    { field: "price", headerName: "Үнэ", width: 150, maxWidth: 180 },
    { field: "subcategory", headerName: "Дэд ангилал", width: 200, maxWidth: 220 },
    {
      field: "cover",
      headerName: "Зураг",
      width: 200, maxWidth: 250,
      align: "center",
      renderCell: (params) => (
        <img
          src={`${apiData.file_api_url}${params.value}`}
          alt="product"
          style={{ maxHeight: 80,  objectFit: "contain", }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Үйлдэл",
      width: 180, maxWidth: 200,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)} color="primary">
            Засах
          </Button>
          <Button
            onClick={() => handleDeleteClick(params.row.id)}
            color="secondary"
          >
            Устгах
          </Button>
        </>
      ),
    },
  ];

  const rows = products.map((product, index) => ({
    index: index + 1,
    id: product._id,
    title: product.title,
    description: product.description,
    price: product.price,
    subcategory:
      subTitles.find((item) => item._id === product.subcategory)?.title || "",
    cover: product.cover,
  }));
  // console.log(products)

  return (
    <Card>
      <CardHeader
        title="Product Table"
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

      {/* Dialog Form */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? "Бүтээгдэхүүн засах" : "Бүтээгдэхүүн нэмэх"}
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            margin="dense"
            name="title"
            label="Гарчиг"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="description"
            label="Тайлбар"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            name="price"
            label="Үнэ"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            fullWidth
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="subcategory-label">Дэд ангилал</InputLabel>
            <Select
              labelId="subcategory-label"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              fullWidth
            >
              {subTitles.map((sub) => (
                <MenuItem key={sub._id} value={sub._id}>
                  {sub.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <div className="w-full flex justify-start">
            <div className="w-1/3 ">
              <CustomImageUpload
                name={"cover"}
                value={cover}
                // onChangeLalar={setCover}
                setValue={setCover}
              />
            </div>
          </div>

          {formData.cover &&
            (typeof formData.cover === "string" ? (
              <img
                src={`${apiData.file_api_url}${formData.cover}`}
                alt="preview"
                style={{ maxHeight: 100, marginTop: 10 }}
              />
            ) : (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {formData.cover.name}
              </Typography>
            ))}
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

export default ProductTable;
