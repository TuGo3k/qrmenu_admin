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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState, useEffect } from "react";
import getRequest from "./api/getRequest";
import apiData from "@/data/apidata";
import axios from "axios";
import deleteRequest from "./api/deleteRequest";
import { useAuth } from "@/components/Context/AuthProvider";
const columns = [
  { id: "title", label: "Дэд Категорууд" },
  { id: "category", label: "Ангилал" },
  { id: "image", label: "Зураг" ,align: "right"},
];

export default function CustomTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowsData, setRowsData] = useState([]);
  const [category, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const {user} = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (isLoading) {
      Promise.all([
        getRequest({
          route: `/subcategory/`,
          setValue: (data) => {
            console.log(data);
            const formatted = data.map((item) => ({
              ...item,
            }));
            setRowsData(formatted);
          },

          errorFunction: () => console.error("Failed to fetch data"),
        }),
        getRequest({
          route: "/category",
          setValue: setCategory,
          setIsLoading,
          errorFunction: () => console.error("Failed to fetch data"),
        }),
      ]);
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
      category: "",
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
        category: formData.category,
      };
      console.log(formData.category);
      if (editingId) {
        await axios.put(`${apiData.api_url}/subcategory/${editingId}`, payload);
      } else {
        await axios.post(`${apiData.api_url}/subcategory`, payload);
      }

      setIsLoading(true);
      handleClose();
    } catch (error) {
      console.error("Failed to submit JSON:", error);
    }
  };

  const handleEdit = (row) => {
    setFormData({
      title: row.title,
      category: row.category,
    });
    setEditingId(row._id);
    setOpen(true);
  };

  const handleDeleteClick = (rowId) => {
    console.log(rowId);
    setDeleteRowId(rowId);
    setDeleteModalOpen(true); 
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRequest({
        route: `/subcategory/${deleteRowId}`,
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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <h2>Категори жагсаалт</h2>
        {user?.role=== 'merchant' ? (
        <Button variant="contained" onClick={handleOpen}>
          + Категори нэмэх
        </Button>
        ) : null}
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell width={10} align="center">№</TableCell>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                >
                  {column.label}
                </TableCell>
              ))}
            {user?.role=== 'merchant' ? (
              <TableCell align="right">Үйлдэл</TableCell>
            ) : null}
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
                    let value = row[column.id];

                    if (column.id === "category" && value) {
                      const categoryObj = category.find(
                        (cat) => cat._id === value
                      );
                      value = categoryObj
                        ? categoryObj.title
                        : "Unknown Category";
                    }

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
                  <TableCell align="right">
                    <img src={row.file && apiData.file_api_url + row.file} alt="file" className="w-20 h-20"/>
                  </TableCell>
                  {user?.role=== 'merchant' ? (
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                      <RiEdit2Fill />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(row._id)}
                    >
                      <RiDeleteBin6Fill />
                    </IconButton>
                  </TableCell>
                   ) : null}
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
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingId ? "Дэд категори засах" : "Дэд категори нэмэх"}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Дэд категорийн нэр"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="subcategory-label">Дэд ангилал</InputLabel>
              <Select
                labelId="subcategory-label"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                fullWidth
              >
                {category.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
