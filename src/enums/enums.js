export const Enums = Object.freeze({
  OK: 200,
  CREATE: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SUCCESS: "success",
  FAILED: "failed",
});

export const Codes = Object.freeze({
  AC_001: "AC-001",
  AC_002: "AC-002",
  AC_003: "AC-003",
  AC_004: "AC-004",
  AC_005: "AC-005",
  AC_006: "AC-006",
  LG_007: "LG-007",
  LG_008: "LG-008",
  RS_009: "RS-009",
  RS_010: "RS-010",
  VL_011: "VL-011",

});

export const Messages = Object.freeze({
  AC_001: "Success: Account creation completed successfully",
  AC_002: "Missing Required Fields: Missing required fields",
  AC_003: "Invalid Formats",
  AC_004: "Name Already Exists: The name already exists in the system.",
  AC_005: "Email Already Exists: The name already exists in the system.",
  AC_006: "Password must meet the following requirements: 1. Length: Between 8 and 20 characters. 2. At least one uppercase letter (A-Z). 3. At least one lowercase letter (a-z). 4. At least one number (0-9). 5. At least one special character (e.g., !@#$%^&*(),.?\":{}|<>).",
  LG_007: "Invalid email or password",
  LG_008: "Login successful",
  RS_009: "Reservation created successfully",
  RS_010: "Reservation created failed",
  VL_011: "Validation failed",
});
