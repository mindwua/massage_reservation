import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Reservation() {
  const [shopId, setShopId] = useState("");
  const [date, setDate] = useState("");
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
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/login");

    try {
      await axios.post(
        "/api/v1/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("กรุณาเข้าสู่ระบบก่อนทำการจอง");
      return navigate("/login");
    }

    const payload = { shopId, date };

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3001/api/v1/booking",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResponse(res.data);
      setError("");
    } catch (err) {
      setError("Please enter the bookinginformation ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#FF1493" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
          <Button color="inherit" onClick={() => navigate("/booking")}>
            Booking
          </Button>{" "}
          {}
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
          paddingTop: "64px",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: "4rem",
            fontWeight: "bold",
            marginBottom: 4,
            color: "#333",
          }}
        >
          Massage Reservation
        </Typography>

        <Box
          sx={{
            width: 700,
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
            <TextField
              fullWidth
              label="Shop ID"
              variant="outlined"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date (DD/MM/YYYY)"
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              margin="normal"
            />
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Reserve"
              )}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
}

export default Reservation;
