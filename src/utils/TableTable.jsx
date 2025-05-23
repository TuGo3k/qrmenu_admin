"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import apiData from "@/data/apidata";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,  
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
} from "@mui/material";
import getRequest from "./api/getRequest";
import deleteRequest from "./api/deleteRequest";
import QrSeeModal from "./qrview/SeeQrModal";
import { useAuth } from "@/components/Context/AuthProvider";
import axiosInstance from "./api/axios";
import socket from "./socket/socket";
import toast from "react-hot-toast";

const ProductTable = () => {
  const [tables, setTables] = useState([]);
  const [category, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [isQr, setIsQr] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleNewTable = (newTable) => {
      let isUpdated = false;
  
      setTables((prevTables) => {
        const existingIndex = prevTables.findIndex(table => table._id === newTable._id);
  
        if (existingIndex !== -1) {
          const updatedTables = [...prevTables];
          updatedTables[existingIndex] = newTable;
          isUpdated = true;
          return updatedTables;
        } else {
          return [newTable, ...prevTables];
        }
      });
  
      if (isUpdated) {
        setTimeout(() => {
          toast.success("Зочин нэмэгдлээ", { id: `newTable-${newTable._id}` });
        }, 0);
      }
    };
  
    socket.on("new-table", handleNewTable);
  
    return () => {
      socket.off("new-table", handleNewTable);
    };
  }, []);
  

  useEffect(() => {
    if (isLoading && user?._id && !loading) {
      Promise.all([
        getRequest({
          route: `/table?user=${user.isMerchant ? user._id : user.merchantId}`,
          setValue: setTables,
        }),
        getRequest({
          route: `/tablecategory?user=${user.isMerchant ? user._id : user.merchantId}`,
          setValue: setCategory,
        }),
      ]).finally(() => setIsLoading(false));
    }
  }, [isLoading, user, loading]);

  const handleClickOpen = () => {
    setFormData({ title: "", category: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsQr(false);
    setFormData({ title: "", category: "" });
  };

  const handleSubmit = async () => {
    if (!formData.title?.trim()) {
      alert("Гарчиг оруулна уу");
      return;
    }
    setIsLoading(true);
    try {
      const postData = {
        number: formData.title.trim(),
        category: formData.category,
        user: user._id,
        ...(user?.role === "merchant" && { merchantId: user._id }),
      };

      const response = await axiosInstance.post(`${apiData.api_url}/table`, postData);
      console.log("Ширээ амжилттай нэмэгдлээ.", response.data);
      handleClose();
      setIsLoading(true);
    } catch (error) {
      console.error("Хүсэлт илгээхэд алдаа гарлаа:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsLoading(false);
    }
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
    { field: "title", headerName: "Ширээ", flex: 1 , renderCell: (params) => {
      const table = params.value;
      const isActive = table?.isActive;
      return (
        <span className={isActive ? "text-green-600 font-semibold" : "text-red-500"}>
          {table.name} ({isActive ? "Хүнтэй" : "Хоосон"})
        </span>
      );
    },},
    { field: "category", headerName: "Ангилал", flex: 1 },
    { field: "merchantId", headerName: "MerchantId", flex: 1 },
    {
      field: "actions",
      headerName: "Үйлдэл",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            onClick={() => {
              setSelectedTable({
                id: params.row.id,
                merchantId: params.row.merchantId,
              });
              setIsQr(true);
            }}
          >
            QR
          </Button>
          <Button onClick={() => handleDeleteClick(params.row.id)} color="secondary">
            Устгах
          </Button>
        </>
      ),
    },
  ];

  const rows = tables.map((table, index) => ({
    index: index + 1,
    id: table._id,
    title: table, // бүх table-ийг өгнө. дараа нь renderCell дотор ашиглана.
    category: category.find((c) => c._id === table.category)?.title || "—",
    merchantId: table.merchantId || "—",
  }));
  

  return (
    <Card>
      <CardHeader
        title="Ширээнүүд"
        action={
          user?.role === "merchant" ? (
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleClickOpen}>
              Ширээ нэмэх
            </Button>
          ) : null
        }
      />
      <CardContent>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
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

      {isQr && selectedTable && (
        <QrSeeModal
          user={user} 
          closeModal={handleClose}
          tableId={selectedTable.id}
          merchantId={selectedTable.merchantId}
        />
      )}

      <Dialog open={deleteModalOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Баталгаажуулалт</DialogTitle>
        <DialogContent>Та энэ ширээг устгахдаа итгэлтэй байна уу?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Болих
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary" variant="contained">
            Устгах
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Ширээ нэмэх</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              type="number"
              name="title"
              label="Тоо оруулна уу"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="tablecategory-label">Ангилал</InputLabel>
              <Select
                labelId="tablecategory-label"
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
          <Button onClick={handleSubmit} variant="contained">
            Хадгалах
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ProductTable;
