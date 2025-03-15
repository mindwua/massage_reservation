import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all the required information.");
      return;
    }

    const payload = { email, password };

    try {
      setLoading(true);
      const res = await axios.post("/api/v1/auth/login", payload);
      setResponse(res.data);
      localStorage.setItem("authToken", res.data.data.token);

      navigate("/reservation");

      setError("");
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred while logging in.";
        setError(errorMessage);
      } else {
        setError("An error occurred while connecting.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "50vh",
        padding: 8,
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
          Login
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        {response && <Typography color="primary">Login Successful!</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>

          <Typography
            sx={{
              marginTop: 2,
              textAlign: "center",
              color: "#FF1493",
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </Typography>
        </form>
      </Box>
    </Box>
  );
}

export default LoginForm;
