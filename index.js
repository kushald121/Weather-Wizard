
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const ApiKey = "b55a81845e16c8269ddebe43ec2b092f";

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views"); 


app.get("/", (req, res) => {
    res.render("index.ejs", { weatherData: null, error: null });
});

app.post("/submit", async (req, res) => {
    try {
        const { pin, country } = req.body;

        
        if (!pin || !country) {
            return res.render("index.ejs", {
                weatherData: null,
                error: "Please provide both pincode and country."
            });
        }

        console.log(`Fetching weather for PIN: ${pin}, Country: ${country}`);

        const geo_URL = `http://api.openweathermap.org/geo/1.0/zip?zip=${pin},${country}&appid=${ApiKey}`;

        const response1 = await axios.get(geo_URL);

        
        if (!response1.data || !response1.data.lat || !response1.data.lon) {
            return res.render("index.ejs", {
                weatherData: null,
                error: "Invalid location details. Please check your PIN and Country Code."
            });
        }

        const { lat, lon } = response1.data;
        console.log(`Coordinates found: ${lat}, ${lon}`);

        const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${ApiKey}&units=metric`;
        const response2 = await axios.get(API_URL);

        if (!response2.data || !response2.data.main) {
            return res.render("index.ejs", {
                weatherData: null,
                error: "Error fetching weather data. Please try again."
            });
        }

        console.log(`Weather data fetched successfully for ${response2.data.name}`);
        res.render("index.ejs", { weatherData: response2.data, error: null });

    } catch (error) {
        console.error("Server Error:", error.message);

        let errorMessage = "Internal Server Error. Please try again.";
        if (error.response && error.response.status === 404) {
            errorMessage = "Location not found. Please check your pincode and country.";
        } else if (error.response && error.response.status === 401) {
            errorMessage = "API key error. Please contact support.";
        }

        res.render("index.ejs", {
            weatherData: null,
            error: errorMessage
        });
    }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
