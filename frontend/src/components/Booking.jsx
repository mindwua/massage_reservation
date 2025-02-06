import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Booking.css';

const ViewBooking = () => {
  const navigate = useNavigate(); 
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBookingID, setSelectedBookingID] = useState(null);

  const handleLogout = () => {
    alert("Logged out!"); 
  };

  const bookingData = [
    {
      BookingID: "67a0420600c824482f09018e",
      DateTime: "2025-02-06 10:00 AM",
      shopInfo: {
        shopName: "Relaxation",
        shopAddress: "123 Wellness St, Cityville",
        shopTelephone: "+1234567890",
        openClose: "09:00 AM - 10:00 PM",
      },
      status: "Pending",
    },
    {
      BookingID: "67a0420600c824482f09018f",
      DateTime: "2025-02-07 02:00 PM",
      shopInfo: {
        shopName: "Peaceful Spa",
        shopAddress: "456 Serenity Ave, Tranquil Town",
        shopTelephone: "+0987654321",
        openClose: "08:00 AM - 08:00 PM",
      },
      status: "Confirmed",
    },
    {
      BookingID: "67a0420600c824482f090190",
      DateTime: "2025-02-08 04:00 PM",
      shopInfo: {
        shopName: "Zen Zone",
        shopAddress: "789 Calm Rd, Quiet City",
        shopTelephone: "+1122334455",
        openClose: "10:00 AM - 09:00 PM",
      },
      status: "Pending",
    },
  ];

  const handleEdit = (bookingID) => {
    alert(`Edit booking: ${bookingID}`);
  };

  const handleDelete = (bookingID) => {
    setSelectedBookingID(bookingID);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in.");
        return;
      }

      const res = await axios.delete(`/api/v1/booking/${selectedBookingID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Booking deleted successfully!");
      setOpenDialog(false); 
    } catch (err) {
      alert("Failed to delete the booking.");
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); 
  };

  return (
    <>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ bgcolor: '#FF1493' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
          </Typography>
          <Button color="inherit" onClick={() => navigate('/Reservation')}>
          Reservation
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <div className="view-booking-container" style={{ marginTop: '70px' }}>
        <h2>Booking Details</h2>
        <table className="booking-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Appointment</th>
              <th>Shop Name</th>
              <th>Shop Address</th>
              <th>Shop Telephone</th>
              <th>Open/Close</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookingData.map((booking, index) => (
              <tr key={index}>
                <td>{booking.BookingID}</td>
                <td>{booking.DateTime}</td>
                <td>{booking.shopInfo.shopName}</td>
                <td>{booking.shopInfo.shopAddress}</td>
                <td>{booking.shopInfo.shopTelephone}</td>
                <td>{booking.shopInfo.openClose}</td>
                <td>{booking.status}</td>
                <td className="actions">
                  <button onClick={() => handleEdit(booking.BookingID)}>Edit</button>
                  <button onClick={() => handleDelete(booking.BookingID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this booking? This action cannot be undone.
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
