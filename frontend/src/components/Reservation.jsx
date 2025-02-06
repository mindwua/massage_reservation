import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const shops = [
  {
    id: "1",
    name: "Relax Haven Spa",
    hours: "10:00 AM - 10:00 PM",
    phone: "02-234-3409",
    address: "123 Sukhumvit Rd, Bangkok",
  },
  {
    id: "2",
    name: "Zen Thai Massage",
    hours: "09:00 AM - 09:00 PM",
    phone: "02-987-6543",
    address: "88 Silom Rd, Bangkok",
  },
  {
    id: "3",
    name: "Tranquil Touch",
    hours: "08:00 AM - 08:00 PM",
    phone: "02-456-7890",
    address: "56 Sathorn Rd, Bangkok",
  },
  {
    id: "4",
    name: "Serene Spa",
    hours: "11:00 AM - 11:00 PM",
    phone: "02-321-5678",
    address: "99 Rama IV Rd, Bangkok",
  },
  {
    id: "5",
    name: "Blissful Retreat",
    hours: "07:00 AM - 07:00 PM",
    phone: "02-765-4321",
    address: "77 Ratchada Rd, Bangkok",
  },
];

function Reservation() {
  const [shopId, setShopId] = useState("");
  const [dateTime, setDateTime] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!shopId) {
      setError("Please select a shop before making a reservation.");
      return;
    }
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in before making a reservation.");
      return navigate("/login");
    }
  
    const payload = { shopId, dateTime: dateTime.toISOString() };
  
    try {
      setLoading(true);
      setError(""); 
      const res = await axios.post("/api/v1/booking", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setResponse(res.data);
      setError(""); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred while making the reservation. Please try again.";
      setError(errorMessage); 
    } finally {
      setLoading(false);
    }
  };
  

  const selectedShop = shops.find((shop) => shop.id === shopId);

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#FF1493" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          <Button color="inherit" onClick={() => navigate("/booking")}>
            Booking
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "50vh",
          paddingTop: "80px",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: "3rem",
            fontWeight: "bold",
            marginBottom: 4,
            color: "#333",
          }}
        >
          Massage Reservation
        </Typography>

        <Box
          sx={{
            width: 500,
            padding: 6,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: 2,
              color: "#555",
            }}
          >
            Book an Appointment
          </Typography>

          {error && <Typography color="error">{error}</Typography>}
          {response && (
            <Typography color="primary">Reservation successful!</Typography>
          )}

          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Choose a Shop</InputLabel>
              <Select
                value={shopId}
                onChange={(e) => setShopId(e.target.value)}
              >
                {shops.map((shop) => (
                  <MenuItem key={shop.id} value={shop.id}>
                    {shop.name} ({shop.hours})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedShop && (
              <Box sx={{ marginBottom: 2, padding: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
                <Typography variant="body1">
                  <strong>📍 Address:</strong> {selectedShop.address}
                </Typography>
                <Typography variant="body1">
                  <strong>📞 Phone:</strong> {selectedShop.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>🕒 Open Hours:</strong> {selectedShop.hours}
                </Typography>
              </Box>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Select Date & Time"
                value={dateTime}
                onChange={(newValue) => setDateTime(newValue)}
                minDateTime={dayjs()}
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    fontSize: "1.2rem",
                    padding: "12px",
                    height: "56px",
                  },
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                  },
                }}
              />
            </LocalizationProvider>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                marginTop: 3,
                padding: "16px 0",
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: "1.3rem",
                backgroundColor: "#FF1493",
                "&:hover": {
                  backgroundColor: "#FF69B4",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Reserve"}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default Reservation;
