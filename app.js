const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single('attr'));
app.use(express.json())
app.use(bodyParser.json());

app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Hello' });
});

const userRouter = require('./routes/authRoutes');
app.use('/auth', userRouter);
const productRouter = require('./routes/productRoutes');
app.use('/product', productRouter);
const categoryRouter = require('./routes/categoryRoutes');
app.use('/cat', categoryRouter);
const cartRouter = require('./routes/shoppingCartRoutes');
app.use('/cart', cartRouter);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log()
});

module.exports = mongoose;