describe("POST /api/v1/register", () => {
  it("should create a duplucation account and return 400 status", async () => {
// Get the current timestamp
const now = new Date().getTime();

// Generate a random number of milliseconds to add (up to 7 days)
const randomOffset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);

// Create the future date
const randomFutureDate = new Date(now + randomOffset);

// Format it as an ISO string
const formattedDate = randomFutureDate.toISOString();

console.log("Random Future Date:", formattedDate);

  });
});