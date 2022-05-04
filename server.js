const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

const PORT = 3001;

app.listen(PORT, () => console.log(`Server is listening PORT ${PORT}...`));
