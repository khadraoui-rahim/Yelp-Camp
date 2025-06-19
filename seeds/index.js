const mongoose = require('mongoose');
const Campground = require('../models/Campground');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');

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
const sample = array => array[Math.floor(Math.random() * array.length)];

const getRandomImageUrl = async () => {
    try {
        const res = await fetch(
            'https://api.unsplash.com/photos/random?collections=l6GSRgLvoZc&count=1',
            {
                headers: {
                    Authorization: 'Client-ID NySjicYh_mledIPZf3YHKefZkqSM4wWMd1OeUmD0-vw'
                }
            }
        );
        const data = await res.json();
        const photo = Array.isArray(data) ? data[0] : data;
        return photo.urls.small;
    } catch (err) {
        console.error('Error fetching Unsplash image:', err.message);
        return 'https://via.placeholder.com/300'; // fallback image
    }
};

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const imageUrl = await getRandomImageUrl(); // 🔹 fetch image URL here

        const camp = new Campground({
            name: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description:
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
            image: imageUrl // 🔹 store image URL string
        });

        await camp.save();
    }
    console.log('Campgrounds seeded');
};

seedDB().then(() => {
    mongoose.connection.close();
});