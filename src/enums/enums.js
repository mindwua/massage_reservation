export const Enums = Object.freeze({

});

export const StatusCodes = Object.freeze({
  OK: 200,
  CREATE: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
});

export const StatusMessages = Object.freeze({
  SUCCESS: "success",
  FAILED: "failed",
  SERVER_ERROR: "server_error",


});

export const Codes = Object.freeze({
  // Register Codes
  REG_1001: "REG_1001",
  REG_1002: "REG_1002",
  REG_1003: "REG_1003",
  REG_1004: "REG_1004",
  REG_1005: "REG_1005",
  REG_1006: "REG_1006",

  // Auth Codes
  LGN_2001: "LGN_2001",
  LGN_2002: "LGN_2002",

  // Reservation Codes
  RSV_3001: "RSV_3001",
  RSV_3002: "RSV_3002",
  RSV_3003: "RSV_3003",
  RSV_3004: "RSV_3004",
  RSV_3005: "RSV_3005",
  RSV_3006: "RSV_3006",
  RSV_3007: "RSV_3007",
  RSV_3008: "RSV_3008",
  RSV_3009: "RSV_3009",
  RSV_3010: "RSV_3010",


  // Validation Codes
  VAL_4001: "VAL_4001",
  VAL_4002: "VAL_4002",
  VAL_4003: "VAL_4003",
  VAL_4004: "VAL_4004",

  // Logout Codes
  LOT_5001: "LOT_5001",

  // Permission Messages
  TKN_6001: "TKN_6001",
  TKN_6002: "TKN_6002",

  // Massage Shops
  MGS_1001: "MGS_1001",
  MGS_1002: "MGS_1002",
  MGS_1003: "MGS_1003",
  MGS_1004: "MGS_1004",

  //General
  GNR_1001: "GNR_1001",

});

export const Messages = Object.freeze({
  // Register Messages
  REG_1001: "Registration successfully",
  REG_1002: "Missing Required Fields: Missing required fields",
  REG_1003: "Invalid Formats",
  REG_1004: "Name Already Exists: The name already exists in the system.",
  REG_1005: "Email Already Exists: The email already exists in the system.",
  REG_1006: "Password must meet the following requirements: 1. Length between 8 and 20 characters, 2. At least one uppercase letter (A-Z), 3. At least one lowercase letter (a-z), 4. At least one number (0-9), 5. At least one special character (e.g., !@#$%^&*(),.?\":{}|<>).",

  // Auth Messages
  LGN_2001: "Login successful",
  LGN_2002: "The password you entered is incorrect. Please try again.",
  LGN_2003: "The email you entered is incorrect. Please try again.",

  // Reservation Messages
  RSV_3001: "Reservation created successfully",
  RSV_3002: "Reservation creation failed",
  RSV_3003: "Reservation creation failed: Shop not found",
  RSV_3004: "User has too many pending reservations for this date",
  RSV_3005: "Get reservation successfully",
  RSV_3006: "Get reservation failed",
  RSV_3007: "Delete reservation failed: Reservation not found",
  RSV_3008: "Delete reservation successfully",
  RSV_3009: "Update reservation failed: Reservation not found",
  RSV_3010: "Update reservation successfully",



  // Massage Shops
  MGS_1001: "Massage Shops created successfully",
  MGS_1002: "The Massage Shops Already Exists: The name already exists in the system.",
  MGS_1003: "You do not have permission to create a massage shop",
  MGS_1004: "Massage shop not found",

  // Validation Messages
  VAL_4001: "Required fields are missing. Please fill in all the necessary fields.",
  VAL_4002: "Invalid phone number format",
  VAL_4003: "Invalid shopId format",
  VAL_4004: `Invalid data format`,

  // Logout Messages
  LOT_5001: "Logout successful",

  // Permission Messages
  TKN_6001: "Access denied. No token provided.",
  TKN_6002: "Invaild or session expired",

  //General Messages
  GNR_1001: "Internal Server Error",

});


export const Status = Object.freeze({
  PENDING: "Pending",
});