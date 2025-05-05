"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import apiData from "@/data/apidata";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import getRequest from "./api/getRequest";
import deleteRequest from "./api/deleteRequest";
import QrSeeModal from "./qrview/SeeQrModal"; 
import { useAuth } from "@/components/Context/AuthProvider";

const ProductTable = () => {
  const [tables, setTables] = useState([]);
  const [open, setOpen] = useState(false);
  const [isQr, setIsQr] = useState(false);  
  const [formData, setFormData] = useState({ title: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const { user ,loading} = useAuth();

  useEffect(() => {
    if (isLoading && user?._id && !loading) {
      getRequest({
        route: `/table?user=${user.isMerchant ? user._id: user.merchantId}`,
        setValue: setTables,
        errorFunction: () => console.error("Failed to fetch data"),
      }).finally(() => setIsLoading(false))
    }
  }, [isLoading , user , loading]);

  const handleClickOpen = () => {
    setFormData({ title: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsQr(false); 
    setFormData({ title: "" });
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
        user: user._id,
      };

      console.log("sending" , postData )

      if (user?.role === "merchant") {
        postData.merchantId = user._id;
      }
      const response = await axios.post(`${apiData.api_url}/table`, postData);
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
    { field: "title", headerName: "Гарчиг", flex: 1 },
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

  const rows = tables
  // .filter(
  //   (table) =>
  //     table.merchantId === user._id || table.user === user._id
  // )
  .map((table, index) => ({
    index: index + 1,
    id: table._id,
    title: table.name,
    merchantId: table.merchantId || "-", 
    user: table.user || "-"
  }));


  return (
    <Card>
      <CardHeader
        title="Ширээнүүд"
        action={
          user?.role === 'merchant' ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleClickOpen}
          >
            Ширээ нэмэх
          </Button>
          ) : null
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

      {isQr && selectedTable && (
        <QrSeeModal
          closeModal={handleClose}
          tableId={selectedTable.id}
          merchantId={selectedTable.merchantId}
        />
      )}

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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Ширээ нэмэх</DialogTitle>
        <DialogContent dividers>
          <TextField
            type="number" 
            margin="dense"
            name="title"
            label="Тоо оруулна уу"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
