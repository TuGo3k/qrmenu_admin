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
import { useAuth } from "@/components/Context/AuthProvider";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [subTitles, setSubTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [cover, setCover] = useState("");
  const { user } = useAuth()
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
      setFormData({
        ...formData,
        cover: files[0],
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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
      if(user.role === "merchant") {
      if (editingId) {
        await axios.put(`${apiData.api_url}/product/${editingId}`, form);
      } else {
        await axios.post(`${apiData.api_url}/product`, form);
      }
    }
      handleClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (row) => {
    const subcat = subTitles.find((item) => item.title === row.subcategory);

    setFormData({
      title: row.title,
      description: row.description,
      price: row.price,

      subcategory: subcat?._id || "",
    });
    setEditingId(row.id);
    setOpen(true);
  };
  const handleDeleteClick = (rowId) => {
    setDeleteRowId(rowId); 
    setDeleteModalOpen(true); 
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRequest({
        route: `/product/${deleteRowId}`,
        setIsLoading,
      });
      setDeleteModalOpen(false); 
      setDeleteRowId(null); 
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to delete the product:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteRowId(null); 
  };
  const baseColumns  = [
    { field: "index", headerName: "№", width: 50, maxWidth: 70 },
    { field: "id", headerName: "ID", width: 220, maxWidth: 220 },
    { field: "title", headerName: "Барааны нэр", flex: 1, maxWidth: 250 },
    { field: "description", headerName: "Тайлбар", flex: 1, maxWidth: 250 },
    { field: "price", headerName: "Үнэ", flex: 1, maxWidth: 180 },
    { field: "subcategory", headerName: "Дэд ангилал", flex: 1, maxWidth: 220 },
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
  ];
  const actionColumn = {
    field: 'actions',
    headerName: 'Үйлдэл',
    width: 180,
    maxWidth: 200,
    renderCell: (params) => (
      <>
        <Button onClick={() => handleEdit(params.row)} color="primary">
          Засах
        </Button>
        <Button onClick={() => handleDeleteClick(params.row.id)} color="secondary">
          Устгах
        </Button>
      </>
    ),
  };
  
  const columns = user?.role === 'merchant'
  ? [...baseColumns, actionColumn]
  : baseColumns;

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

  return (
    <Card>
        <CardHeader
          title="Product Table"
          action={
            user?.role === "merchant"  ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleClickOpen}
              >
                Нэиэх
              </Button>
            ) : null
          }
        />
      <CardContent>
        <div style={{ height: 500, width: "100%" }}>
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
          <div className="w-full flex justify-start">
            <div className="w-1/3 ">
              <CustomImageUpload
                name={"cover"}
                value={cover}
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
