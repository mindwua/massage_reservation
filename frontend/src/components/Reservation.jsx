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
  TextField,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Reservation() {
  const [shopId, setShopId] = useState("");
  const [date, setDateTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please log in before fetching the shops.");
          navigate("/login");
          return;
        }

        const res = await axios.get("/api/v1/massage-shops", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setShops(res.data.shops);
      } catch (err) {
        console.error("Error fetching shops:", err);
        setError("Failed to load shops. Please try again.");
      }
    };

    fetchShops();
  }, [navigate]);

  const handleSessionExpired = (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      setError("Session Expired.");
      setErrorPopupOpen(true);
    } else {
      setError("An unexpected error occurred.");
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        "/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (err) {
      console.error("Error during logout:", err);
      setError("Failed to log out. Please try again.");
      handleSessionExpired(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!shopId) {
      setError("Please select a shop before making a reservation.");
      return;
    }

    if (!date || !date.isValid()) {
      setError("Please select a valid date and time for your reservation.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Please log in before making a reservation.");
      return navigate("/login");
    }

    const formattedDateTime = date.format("DD-MM-YYYY HH:mm");
    const payload = { shopId, date: formattedDateTime };

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("/api/v1/booking", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResponse(res.data);
      setError("");

      navigate("/booking");
    } catch (err) {
      handleSessionExpired(err);
    }
  };

  const selectedShop = shops.find((shop) => shop.shopId === shopId);

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
            <Autocomplete
              value={shops.find((shop) => shop.shopId === shopId) || null}
              onChange={(event, newValue) =>
                setShopId(newValue ? newValue.shopId : "")
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

            {selectedShop && (
              <Box
                sx={{
                  marginBottom: 2,
                  padding: 2,
                  bgcolor: "#f9f9f9",
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1">
                  <strong>📍 Address:</strong> {selectedShop.shopAddress}
                </Typography>
                <Typography variant="body1">
                  <strong>📞 Phone:</strong> {selectedShop.telephone}
                </Typography>
                <Typography variant="body1">
                  <strong>🕒 Open Hours:</strong> {selectedShop.openTime} -{" "}
                  {selectedShop.closeTime}
                </Typography>
              </Box>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Select Date & Time"
                value={date}
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Reserve"
              )}
            </Button>
          </form>
        </Box>
      </Box>

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
    </>
  );
}

export default Reservation;
