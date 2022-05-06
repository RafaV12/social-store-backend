require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const connectDB = require('./db/connect');

app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Routers
const authRoute = require('./routes/auth')

// Routes

app.use('/', authRoute);

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server is listening PORT ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
