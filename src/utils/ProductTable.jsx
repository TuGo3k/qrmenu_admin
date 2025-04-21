"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import deleteRequest from "@/utils/api/deleteRequest";
import { RiDeleteBin6Fill, RiEdit2Fill } from "react-icons/ri";
import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import getRequest from "./api/getRequest";
import apiData from "@/data/apidata";
import axios from "axios";
const columns = [
  { id: "title", label: "Нэр", minWidth: 170 },
  { id: "description", label: "Дэлгэрэнгүй", minWidth: 100 },
  { id: "price", label: "Үнэ", minWidth: 170, align: "right" },
  { id: "image", label: "Зураг", minWidth: 170, align: "right" },
  { id: "subcategory", label: "Дэд ангилал", minWidth: 170, align: "right" },
];

export default function CustomTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsData, setRowsData] = useState([]);
  const [subTitles, setSubTitles] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    cover: null,
    subcategory: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      Promise.all([
        getRequest({
          route: `/subcategory`,
          setValue: setSubTitles,
          errorFunction: () => console.error("Failed to fetch data"),
        }),

        getRequest({
          route: `/product`,
          setValue: setProducts,
          // setIsLoading,
          errorFunction: () => console.error("Failed to fetch data"),
        }),
      ]).finally(() => setIsLoading(false));

      console.log(subTitles);
    }
  }, [isLoading]);
  useEffect(() => {
    // Format the products data
    const formattedData = products.map((product) => ({
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.cover, // Add base URL if needed
      subcategory: product.subcategory,
    }));
    setRowsData(formattedData);
  }, [products]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      image: null,
      subcategory: "",
    });
    setEditingId(null);
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "cover") {
      setFormData((prevData) => ({ ...prevData, cover: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("price", formData.price);
      form.append("subcategory", formData.subcategory);
  
      // Append the image as "cover" if it exists
      if (formData.image && typeof formData.image === "object") {
        form.append("cover", formData.image); // backend expects "cover"
      }
  
      // Check if editing or creating a new product
      if (editingId) {
        await axios.put(`${apiData.api_url}/product/${editingId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${apiData.api_url}/product`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      setIsLoading(true);
      handleClose();
    } catch (error) {
      console.error("Failed to submit:", error);
  
      // Log the error response for debugging
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  // const handleSubmit = () => {
  //   const updatedRow = {
  //     id: editingId || Date.now() + Math.random(),
  //     title: formData.title,
  //     description: formData.description,
  //     price: formData.price,
  //     image:
  //       formData.image && typeof formData.image === "object"
  //         ? URL.createObjectURL(formData.image)
  //         : formData.image,
  //     subcategory: formData.subcategory,
  //   };

  //   if (editingId) {
  //     setRowsData((prevData) =>
  //       prevData.map((row) => (row.id === editingId ? updatedRow : row))
  //     );
  //   } else {
  //     setRowsData((prevData) => [...prevData, updatedRow]);
  //   }

  //   handleClose();
  // };

  const handleEdit = (row) => {
    setFormData(row);
    setEditingId(row.id);
    setOpen(true);
  };

  const handleDelete = async (row) => {
    console.log("Product ID:", row.id); // Log the product ID to verify
    if (window.confirm("Та энэ мөрийг устгахдаа итгэлтэй байна уу?")) {
      deleteRequest({
        route: `/product/${row.id}`, // Use the product ID in the API route
        successFunction: () => {
          setRowsData((prevData) =>
            prevData.filter((item) => item.id !== row.id)
          );
        },
        errorFunction: (error) => {
          console.error("Failed to delete the product:", error);
        },
        setIsLoading,
      });
    }
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <h2>Бүтээгдэхүүн жагсаалт</h2>
        <Button variant="contained" onClick={handleOpen}>
          + Бүтээгдэхүүн нэмэх
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="center">№</TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="center">Үйлдэл</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  <TableCell align="center">
                    {page * rowsPerPage + rowIndex + 1}
                  </TableCell>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.id === "image" && value ? (
                          <img
                            src={`${apiData.file_api_url}${value}`}
                            alt="preview"
                            style={{ maxHeight: 100 }}
                            onError={(e) => {
                              e.target.src = "/placeholder.png"; // Fallback to a placeholder image
                            }}
                          />
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                      <RiEdit2Fill />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(row)}>
                      <RiDeleteBin6Fill />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rowsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Бүтээгдэхүүн нэмэх
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Нэр"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Дэлгэрэнгүй"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Үнэ"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              type="number"
              fullWidth
            />
            <Box>
              <Typography variant="subtitle1">Зураг сонгох</Typography>
              <input
                accept="image/*"
                type="file"
                name="cover" // was "image"
                onChange={handleInputChange}
              />

              {formData.image && typeof formData.image === "object" && (
                <Box mt={2}>
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Зураг"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 8,
                    }}
                  />
                </Box>
              )}
            </Box>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            >
              <option value="">Дэд категори сонгох</option>
              {subTitles.map((subtitle) => (
                <option key={subtitle.id} value={subtitle.id}>
                  {subtitle.title}
                </option>
              ))}
            </select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Болих</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Хадгалах
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
