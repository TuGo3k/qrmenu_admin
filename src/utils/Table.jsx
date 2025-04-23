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
import { RiDeleteBin6Fill, RiEdit2Fill } from "react-icons/ri";
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
  Box,
} from "@mui/material";
// import Box from '@mui/material/';
import { useState, useEffect } from "react";
import getRequest from "./api/getRequest";
import deleteRequest from "./api/deleteRequest";
import apiData from "@/data/apidata";
import axios from "axios";
const columns = [
  { id: "title", label: "Нэр", minWidth: 170 },
  { id: "description", label: "Дэлгэрэнгүй", minWidth: 100 },
  // { id: "price", label: "Үнэ", minWidth: 170, align: "right" },
  // { id: "image", label: "Зураг", minWidth: 170, align: "right" },
  // { id: "subcategory", label: "Дэд ангилал", minWidth: 170, align: "right" },
  {
    id: "actions",
    headerName: "Үйлдэл",
    width: 200,
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

export default function CustomTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsData, setRowsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    // description: "",
    // price: "",
    // image: null,
    // subcategory: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  // console.log(rowsData);
  useEffect(() => {
    if (isLoading) {
      getRequest({
        route: "/category",
        setValue: (data) => {
          const formatted = data.map((item) => ({
            ...item,
            image: apiData.file_api_url + item.image,
          }));
          setRowsData(formatted);
        },
        setIsLoading,
        errorFunction: () => console.error("Failed to fetch data"),
      });
    }
  }, [isLoading]);

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
    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, image: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        title: formData.title,
        // description: formData.description,
        // price: formData.price,
        // subcategory: formData.subcategory,
        // image: formData.image, // Optional: base64 or image URL depending on your backend
      };

      // If editing, send PUT
      if (editingId) {
        await axios.put(`${apiData.api_url}/category/${editingId}`, payload);
      } else {
        await axios.post(`${apiData.api_url}/category`, payload);
      }

      setIsLoading(true);
      handleClose();
    } catch (error) {
      console.error("Failed to submit JSON:", error);
    }
  };

  const handleEdit = (row) => {

    setFormData(row);
    setEditingId(row);
    setOpen(true);
  };

  const handleDeleteClick = (rowId) => {
    console.log(rowId);
    setDeleteRowId(rowId); // Store the row ID to delete
    setDeleteModalOpen(true); // Open the modal
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRequest({
        route: `/category/${deleteRowId}`,
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

  // const handleDelete = (row) => {
  //   if (window.confirm("Та энэ мөрийг устгахдаа итгэлтэй байна уу?")) {
  //     setRowsData((prevData) => prevData.filter((item) => item.id !== row.id));
  //   }
  // };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <h2>Категори жагсаалт</h2>
        <Button variant="contained" onClick={handleOpen}>
          + Категори нэмэх
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
                            src={value}
                            alt="preview"
                            style={{ maxHeight: 100 }}
                          />
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(row._id)}>
                      <RiEdit2Fill />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(row._id)}
                    >
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
        <DialogTitle sx={{ fontWeight: "bold" }}>Категори нэмэх</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Категори нэр"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
            />
            {/* <TextField label="Дэлгэрэнгүй" name="description" value={formData.description} onChange={handleInputChange} fullWidth multiline rows={3} /> */}
            {/* <TextField label="Үнэ" name="price" value={formData.price} onChange={handleInputChange} type="number" fullWidth /> */}
            {/* <Box>
              <Typography variant="subtitle1">Зураг сонгох</Typography>
              <input accept="image/*" type="file" name="image" onChange={handleInputChange} />
              {formData.image && typeof formData.image === "object" && (
                <Box mt={2}>
                  <img src={URL.createObjectURL(formData.image)} alt="Зураг" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }} />
                </Box>
              )}
            </Box> */}
            {/* <TextField label="Дэд категори" name="subcategory" value={formData.subcategory} onChange={handleInputChange} fullWidth /> */}
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
