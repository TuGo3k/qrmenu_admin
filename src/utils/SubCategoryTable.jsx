"use client";
import * as React from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Box, FormControl, InputLabel, MenuItem, Select
} from "@mui/material";
import { useState, useEffect } from "react";
import { RiDeleteBin6Fill, RiEdit2Fill } from "react-icons/ri";
import getRequest from "./api/getRequest";
import deleteRequest from "./api/deleteRequest";
import apiData from "@/data/apidata";
import axios from "axios";
import { useAuth } from "@/components/Context/AuthProvider";
import CustomImageUpload from "./CustomImageUpload";
import axiosInstance from "./api/axios";

const columns = [
  { id: "title", label: "Дэд Категори" },
  { id: "category", label: "Ангилал" },
  { id: "file", label: "Зураг", align: "right" },
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
  const [refresh , setRefresh] = useState(0)
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({ title: "", category: ""});
  const [cover ,setCover] = useState('')
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading && user?._id && !loading) {
      Promise.all([
        getRequest({
          route: `/subcategory?user=${user.isMerchant ? user._id : user.merchantId}`,
          setValue: setRowsData,
          setIsLoading,
          errorFunction: () => console.error("Failed to fetch subcategories"),
        }),
        getRequest({
          route: `/category?user=${user.isMerchant ? user._id : user.merchantId}`,
          setValue: setCategory,
          setIsLoading,
          errorFunction: () => console.error("Failed to fetch categories"),
        }),
      ]);
    }
  }, [isLoading, user,loading]);


  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setFormData({ title: "", category: "" });
    setCover('')
    setEditingId(null);
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "cover" && files?.length > 0) {
      setFormData((prev) => ({ ...prev, cover: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("user", user._id);
      payload.append("merchantId", user._id);
      if (formData.cover instanceof File) {
        payload.append("cover", cover);
      }

      if (editingId) {
        await axiosInstance.put(`${apiData.api_url}/subcategory/${editingId}`, 
          payload, 
          
        );
      } else {

        await axiosInstance.post('/subcategory', payload);
      }

      setIsLoading(true);
      handleClose();
    } catch (error) {
      console.error("Failed to submit:", error);
    }
  };

  const handleEdit = (row) => {
    setFormData({
      title: row.title,
      category: row.category,
      cover: row.cover,
    });
    setEditingId(row._id);
    setOpen(true);
  };

  const handleDeleteClick = (rowId) => {
    setDeleteRowId(rowId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRequest({ route: `/subcategory/${deleteRowId}`, setIsLoading });
      setDeleteModalOpen(false);
      setDeleteRowId(null);
      setIsLoading(true);
    } catch (error) {
      console.error("Failed to delete:", error);
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
        {user?.role === "merchant" && (
          <Button variant="contained" onClick={handleOpen}>
            + Категори нэмэх
          </Button>
        )}
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell width={10} align="center">№</TableCell>
              {columns.map((col) => (
                <TableCell key={col.id} align={col.align || "left"}>
                  {col.label}
                </TableCell>
              ))}
              {user?.role === "merchant" && (
                <TableCell align="right">Үйлдэл</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
              <TableRow hover key={row._id}>
                <TableCell align="center">{page * rowsPerPage + idx + 1}</TableCell>
                {columns.map((col) => {
                  let value = row[col.id];

                  if (col.id === "category" && value) {
                    const cat = category.find(c => c._id === value);
                    value = cat ? cat.title : "Unknown Category";
                  }

                  if (col.id === "cover" && value) {
                    return (
                      <TableCell key={col.id} align={col.align || "left"}>
                        <img src={row.cover && apiData.file_api_url + row.cover} alt="cover" style={{ maxHeight: 100 }} />
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={col.id} align={col.align || "left"}>
                      {value}
                    </TableCell>
                  );
                })}
                {user?.role === "merchant" && (
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                      <RiEdit2Fill />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(row._id)}>
                      <RiDeleteBin6Fill />
                    </IconButton>
                  </TableCell>
                )}
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
        <DialogContent>Та энэ мөрийг устгахдаа итгэлтэй байна уу?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Болих</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Устгах</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Дэд категори засах" : "Дэд категори нэмэх"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} mt={1}>
            <TextField
              label="Дэд категорийн нэр"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="subcategory-label">Ангилал</InputLabel>
              <Select
                labelId="subcategory-label"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {category.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>{cat.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <CustomImageUpload name="cover" value={formData.cover} setValue={setFormData} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Болих</Button>
          <Button variant="contained" onClick={handleSubmit}>Хадгалах</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
