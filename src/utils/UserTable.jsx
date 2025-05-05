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

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isQr, setIsQr] = useState(false);  
  const [formData, setFormData] = useState({ name: "" , email: "" , phone: "" , phone_2: "", address: "", password: "" });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const { user , signup } = useAuth();

  useEffect(() => {
    if (isLoading && user?._id) {
      getRequest({
        route: `/user?user=${user._id}`,
        setValue: setUsers,
        setIsLoading,
        errorFunction: () => console.error("Failed to fetch data"),
      });
    }
  }, [isLoading , user]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(formData);
    setOpen(false); 
    setFormData({ name: "", email: "", phone: "", phone_2: "", address: "", password: "" }); 
    setIsLoading(true); 
  };
  
  const handleClose = () => {
    setOpen(false);
    setIsQr(false);
    setFormData({ name: "", email: "", phone: "", phone_2: "", address: "", password: "" });
  };

  const handleDeleteClick = (rowId) => {
    setDeleteRowId(rowId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRequest({
        route: `/user/${deleteRowId}`,
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
    { field: "name", headerName: "Нэр", flex: 1 },
    { field: "email", headerName: "И-мэйл", flex: 1 },
    { field: "phone", headerName: "Утас", flex: 1 },
    { field: "phone_2", headerName: "Яралтай үед холбоо барих", flex: 1 },
    { field: "address", headerName: "Гэрийн хаяг", flex: 1 },
    {
      field: "actions",
      headerName: "Үйлдэл",
      width: 200,
      renderCell: (params) => (
        <>
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

  const rows = users.map((user, index) => ({
    id:user._id,
    index: index + 1,
    name: user.name,
    email: user.email,
    phone: user.phone,
    phone_2: user.phone_2,
    address: user.address,
    user: user._id,
    merchantId: user._id
  }));

  return (
    <Card>
      <CardHeader
        title="Хэрэглэгч"
        action={
          user?.role === 'merchant' ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleClickOpen}
          >
            Хэрэглэгч нэмэх
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
              pageSize={6}
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
          <TextField type="text" margin="dense" name="name" label="Нэр" value={formData.name} onChange={handleChange} fullWidth />
          <TextField type="email" margin="dense" name="email" label="И-мэйд" value={formData.email} onChange={handleChange} fullWidth />
          <TextField type="number" margin="dense" name="phone" label="Утасны дугаар" value={formData.phone} onChange={handleChange} fullWidth />
          <TextField  type="number" margin="dense"name="phone_2" label="Яралтай үед холбоо барих" value={formData.phone_2} onChange={handleChange} fullWidth />
          <TextField type="text" margin="dense" name="address" label="Хаяг" value={formData.address} onChange={handleChange} fullWidth />
          <TextField type="text" margin="dense" name="password" label="Нууц үг" value={formData.password} onChange={handleChange} fullWidth/>
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

export default UserTable;
