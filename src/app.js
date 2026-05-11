const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');

const app = express();

app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(cookieSession({
    name: 'pelucan_session',
    keys: [process.env.SESSION_SECRET || 'pelucan_secret_key_2026_dev_only'],
    maxAge: 1000 * 60 * 60 * 2,
    httpOnly: true,
    sameSite: 'lax'
}));

app.use((req, res, next) => {
    res.locals.user = (req.session && req.session.user) || null;
    next();
});

app.use('/', authRoutes);
app.use('/', appointmentRoutes);
app.use('/', petRoutes);

module.exports = app;
