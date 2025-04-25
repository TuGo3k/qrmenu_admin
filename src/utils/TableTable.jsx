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
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import apiData from "@/data/apidata";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import getRequest from "./api/getRequest";
import deleteRequest from "./api/deleteRequest";

const ProductTable = () => {
  const [tables, setTables] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
  });

  useEffect(() => {
    if (isLoading) {
      getRequest({
        route: "/table",
        setValue: setTables,
        setIsLoading,
        errorFunction: () => console.error("Failed to fetch data"),
      });
    }
  }, [isLoading]);

  const handleClickOpen = () => {
    setEditingId(null);
    setFormData({ title: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({ title: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      alert("Гарчиг оруулна уу");
      return;
    }

    // const form = new FormData();
    // form.append("number", formData.title);

    try {
      await axios.post(`${apiData.api_url}/table`, {
        number: formData.title,
      });
      handleClose();
      setIsLoading(true); // Refetch data
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (row) => {
    setFormData({ title: row.title });
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
        route: `/table/${deleteRowId}`,
        setIsLoading,
      });
      setDeleteModalOpen(false);
      setDeleteRowId(null);
      setIsLoading(true);
    } catch (error) {
      console.error("Failed to delete the table:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteRowId(null);
  };

  const columns = [
    { field: "index", headerName: "№", width: 50 },
    { field: "id", headerName: "ID", width: 220 },
    { field: "title", headerName: "Гарчиг", flex: 1 },
    {
      field: "actions",
      headerName: "Үйлдэл",
      width: 200,
      renderCell: (params) => (
        <>
          {/* <Button onClick={() => handleEdit(params.row)} color="primary">
            Засах
          </Button> */}
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

  const rows = tables.map((table, index) => ({
    index: index + 1,
    id: table._id,
    title: table.name,
  }));

  return (
    <Card>
      <CardHeader
        title="Ширээнүүд"
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleClickOpen}
          >
            Ширээ нэмэх
          </Button>
        }
      />
      <CardContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={7}
              getRowHeight={() => 70}
              sx={{
                "& .MuiDataGrid-row": {
                  alignItems: "center",
                },
              }}
            />
          </div>
        )}
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Баталгаажуулалт</DialogTitle>
        <DialogContent>
          Та энэ ширээг устгахдаа итгэлтэй байна уу?
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? "Ширээ засах" : "Ширээ нэмэх"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            type="number" // 👉 зөвхөн тоо оруулах
            margin="dense"
            name="title"
            label="Тоо оруулна уу"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
          />
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
