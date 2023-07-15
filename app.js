const express = require('express');
const syncDatabase = require('./src/models/Associations');
const PORT = process.env.PORT || 3000;

const invoiceRouter = require('./src/routes/InvoiceRouter');
const invoiceLineRouter = require('./src/routes/InvoiceLineRouter');
const userRouter = require('./src/routes/UserRouter');
const membershipRouter = require('./src/routes/MembershipRouter');
const checkInRouter = require('./src/routes/CheckInRouter')
let app = express();

// EJS setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.use(express.json());
app.use('/invoice', invoiceRouter);
app.use('/invoiceLine', invoiceLineRouter);
app.use('/user', userRouter);
app.use('/membership', membershipRouter);
app.use('/checkIn', checkInRouter);

(async () => {
    await syncDatabase()
})()

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
}

module.exports = app
