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
  const [openDialog, setOpenDialog] = useState(false);

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

      const res = await axios.put(
        `/api/v1/booking/${selectedBookingID}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "success") {
        setOpenEditDialog(false);
        window.location.reload();
      } else {
        setError("Failed to update the booking.");
        setErrorPopupOpen(true);
      }
    } catch (err) {
      handleSessionExpired(err);
      setOpenEditDialog(false);
    }
  };

  const handleDelete = (bookingID) => {
    setSelectedBookingID(bookingID);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in.");
        setErrorPopupOpen(true);
        return;
      }

      const res = await axios.delete(`/api/v1/booking/${selectedBookingID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.filter(
            (booking) => booking.bookingId !== selectedBookingID
          )
        );

        setSuccessMessage("Booking deleted successfully!");
        setErrorPopupOpen(true);
      } else {
        setError("Failed to delete the booking.");
        setErrorPopupOpen(true);
      }
    } catch (err) {
      console.error("Error during deletion:", err);

      handleSessionExpired(err);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post("/api/v1/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Failed to log out. Please try again.");
      handleSessionExpired(err);
    }
  };

  const [errorPopupOpen, setErrorPopupOpen] = useState(false);

  const handleSessionExpired = (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      setError("Session Expired.");
      setErrorPopupOpen(true);
    }
  };

  const handleReservationClick = async () => {
    try {
      navigate("/reservation");
    } catch (error) {
      handleSessionExpired(error);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#FF1493" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          <Button color="inherit" onClick={handleReservationClick}>
            Reservation
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <div className="view-booking-container" style={{ marginTop: "70px" }}>
        <h2>Booking Details</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        {}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ padding: 2, backgroundColor: "#f8f8f8" }}>
              <table
                className="booking-table"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
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
                    const shop = shops.find(
                      (shop) => shop.shopId === booking.shopId
                    );
                    return (
                      <tr
                        key={booking.bookingId}
                        style={{
                          backgroundColor: "#fff",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        <td style={{ padding: "10px" }}>{booking.bookingId}</td>
                        <td style={{ padding: "10px" }}>{booking.date}</td>
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
            minWidth: "500px", // กำหนดความกว้างของ dialog
            minHeight: "100px", // กำหนดความสูงของ dialog
            width: "100%", // กำหนดให้ความกว้างเป็น 80% ของหน้าจอ
            maxWidth: "500px", // กำหนดความกว้างสูงสุด
            height: "20", // ความสูงอัตโนมัติ
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
                  {
                    shops.find((shop) => shop.shopId === selectedShopId)
                      ?.shopAddress
                  }
                </p>
                <p>
                  <PhoneIcon /> Phone:{" "}
                  {
                    shops.find((shop) => shop.shopId === selectedShopId)
                      ?.telephone
                  }
                </p>
                <p>
                  <AccessTimeIcon /> Open Hours:{" "}
                  {
                    shops.find((shop) => shop.shopId === selectedShopId)
                      ?.openTime
                  }{" "}
                  -{" "}
                  {
                    shops.find((shop) => shop.shopId === selectedShopId)
                      ?.closeTime
                  }
                </p>
              </>
            )}
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Date & Time"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              minDateTime={dayjs()}
              format="DD/MM/YYYY HH:mm"
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errorPopupOpen} onClose={() => setErrorPopupOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <p>{error}</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setErrorPopupOpen(false);
              localStorage.removeItem("authToken");
              navigate("/login");
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this booking?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ViewBooking;
