const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/varaldevi_lake', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const EventSchema = new mongoose.Schema({
    upcomingEvents: String
});

const User = mongoose.model('User', UserSchema);
const Event = mongoose.model('Event', EventSchema);

// Serve static files
app.use(express.static('public'));

// Handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Handle updating events
app.post('/update-content', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authorized');
    }

    const { events } = req.body;
    await Event.findOneAndUpdate({}, { upcomingEvents: events }, { upsert: true });
    res.redirect('/');
});

// Serve event data
app.get('/events', async (req, res) => {
    const event = await Event.findOne();
    res.json(event);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
