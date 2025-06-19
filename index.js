const express = require('express');
const app = express()
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/Campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log('Error connecting to MongoDB');
    })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


app.get('/', (req, res) => {
    res.render('home');
})
app.get('/Campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('index', { campgrounds });
})
app.get('/Campgrounds/new', (req, res) => {
    res.render('new');
})
app.post('/Campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/Campgrounds/${campground._id}`);
})
app.get('/Campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('show', { campground });
})
app.get('/Campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('edit', { campground });
})
app.put('/Campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/Campgrounds/${campground._id}`);
})
app.delete('/Campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/Campgrounds');
})
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
