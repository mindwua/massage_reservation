import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  CircularProgress,
  Autocomplete,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "./Booking.css";

const ViewBooking = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [shops, setShops] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedBookingID, setSelectedBookingID] = useState(null);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [date, setDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load bookings and shops
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const bookingRes = await axios.get("/api/v1/booking", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(bookingRes.data.data);

        const shopsRes = await axios.get("/api/v1/massage-shops", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShops(shopsRes.data.shops);
      } catch (err) {
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, [navigate]);

  const handleEdit = (booking) => {
    setSelectedBookingID(booking.bookingId);
    setSelectedShopId(booking.shopId);
    setDate(dayjs(booking.date));
    setOpenEditDialog(true);
  };

  const confirmEdit = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const updatedData = {
        shopId: selectedShopId,
        date: date.format("DD-MM-YYYY HH:mm"),
      };

      await axios.put(`/api/v1/booking/${selectedBookingID}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingId === selectedBookingID ? { ...b, ...updatedData } : b
        )
      );
      setOpenEditDialog(false);
    } catch (err) {
      setError("Failed to update booking.");
      setOpenEditDialog(false);
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`/api/v1/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    } catch (err) {
      setError("Failed to delete booking.");
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#FF1493" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          <Button color="inherit" onClick={() => navigate("/reservation")}>
            Reservation
          </Button>
          <Button color="inherit" onClick={() => navigate("/booking")}>
            Booking
          </Button>
          <Button color="inherit" onClick={() => localStorage.removeItem("authToken")}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <div className="view-booking-container" style={{ marginTop: "70px" }}>
        <h2>Booking Details</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Using a Grid layout to make it look clean */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, backgroundColor: "#f8f8f8" }}>
              <table className="booking-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FF1493", color: "#fff" }}>
                    <th style={{ padding: "10px" }}>Booking ID</th>
                    <th style={{ padding: "10px" }}>Appointment</th>
                    <th style={{ padding: "10px" }}>Shop Name</th>
                    <th style={{ padding: "10px" }}>Shop Address</th>
                    <th style={{ padding: "10px" }}>Telephone</th>
                    <th style={{ padding: "10px" }}>Open-Close</th>
                    <th style={{ padding: "10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const shop = shops.find((shop) => shop.shopId === booking.shopId);
                    return (
                      <tr key={booking.bookingId} style={{ backgroundColor: "#fff", borderBottom: "1px solid #ccc" }}>
                        <td style={{ padding: "10px" }}>{booking.bookingId}</td>
                        <td style={{ padding: "10px" }}>
                          {new Date(booking.date).toLocaleString()}
                        </td>
                        <td style={{ padding: "10px" }}>{shop?.shopName}</td>
                        <td style={{ padding: "10px" }}>{shop?.shopAddress}</td>
                        <td style={{ padding: "10px" }}>{shop?.telephone}</td>
                        <td style={{ padding: "10px" }}>
                          {shop?.openTime} - {shop?.closeTime}
                        </td>
                        <td style={{ padding: "10px" }}>
                          <button
                            onClick={() => handleEdit(booking)}
                            style={{
                              backgroundColor: "#FF1493",
                              color: "#fff",
                              border: "none",
                              padding: "5px 10px",
                              cursor: "pointer",
                              marginRight: "5px",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(booking.bookingId)}
                            style={{
                              backgroundColor: "#f44336",
                              color: "#fff",
                              border: "none",
                              padding: "5px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Paper>
          </Grid>
        </Grid>
      </div>

      {/* Edit Dialog */}
      <Dialog
  open={openEditDialog}
  onClose={() => setOpenEditDialog(false)}
  sx={{
    "& .MuiDialog-paper": {
      minWidth: "500px",  // กำหนดความกว้างของ dialog
      minHeight: "100px", // กำหนดความสูงของ dialog
      width: "100%",      // กำหนดให้ความกว้างเป็น 80% ของหน้าจอ
      maxWidth: "500px", // กำหนดความกว้างสูงสุด
      height: "20",    // ความสูงอัตโนมัติ
    },
  }}
>
  <DialogTitle>Edit Booking</DialogTitle>
  <DialogContent>
    <Autocomplete
      value={shops.find((shop) => shop.shopId === selectedShopId) || null}
      onChange={(event, newValue) =>
        setSelectedShopId(newValue ? newValue.shopId : "")
      }
      options={shops}
      getOptionLabel={(option) =>
        `${option.shopName} (${option.openTime} - ${option.closeTime})`
      }
      renderInput={(params) => (
        <TextField {...params} label="Choose a Shop" />
      )}
      isOptionEqualToValue={(option, value) =>
        option.shopId === value.shopId
      }
      fullWidth
      sx={{ marginBottom: 2 }}
    />
    <Box>
      {selectedShopId && (
        <>
          <p>
            <LocationOnIcon /> Address:{" "}
            {shops.find((shop) => shop.shopId === selectedShopId)?.shopAddress}
          </p>
          <p>
            <PhoneIcon /> Phone:{" "}
            {shops.find((shop) => shop.shopId === selectedShopId)?.telephone}
          </p>
          <p>
            <AccessTimeIcon /> Open Hours:{" "}
            {shops.find((shop) => shop.shopId === selectedShopId)?.openTime} -{" "}
            {shops.find((shop) => shop.shopId === selectedShopId)?.closeTime}
          </p>
        </>
      )}
    </Box>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Select Date & Time"
        value={null}
        onChange={(newValue) => setDate(newValue)}
        minDateTime={dayjs()}
        sx={{ width: "100%" }}
      />
    </LocalizationProvider>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenEditDialog(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={confirmEdit} color="primary">
      {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
};

export default ViewBooking;
