import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
