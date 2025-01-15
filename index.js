const express = require("express");

const app = express();

const { initalizeDatabase } = require("./db/db.connect");
const cors =require('cors')
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const Hotel = require("./models/hotel.models");

app.use(express.json());

initalizeDatabase();

// const newHotel = {
//   name: "Sunset Resort",
//   category: "Resort",
//   location: "12 Main Road, Anytown",
//   rating: 4.0,
//   reviews: [],
//   website: "https://sunset-example.com",
//   phoneNumber: "+1299655890",
//   checkInTime: "2:00 PM",
//   checkOutTime: "11:00 AM",
//   amenities: ["Room Service", "Horse riding", "Boating", "Kids Play Area", "Bar"],
//   priceRange: "$$$$ (61+)",
//   reservationsNeeded: true,
//   isParkingAvailable: true,
//   isWifiAvailable: true,
//   isPoolAvailable: true,
//   isSpaAvailable: true,
//   isRestaurantAvailable: true,
//   photos: ["https://example.com/hotel2-photo1.jpg", "https://example.com/hotel2-photo2.jpg"],
// };

async function createHotel(newHotel) {
  try {
    const hotel = new Hotel(newHotel);
    const saveHotel = await hotel.save();
    return saveHotel;
  } catch (error) {
    console.log(error);
  }
}

app.post("/hotels", async (req, res) => {
  try {
    const savedHotelData = await createHotel(req.body);
    res.status(201).json({
      message: "Hotel data added successfully.",
      hotel: savedHotelData,
    });
  } catch (error) {
    res.status(500).json({ error: "failed to add hotel data." });
  }
});

async function readAllHotels() {
  try {
    const allHotels = await Hotel.find();
    return allHotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await readAllHotels();
    if (hotels.length > 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "No Hotels Found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotels." });
  }
});

async function readHotelByName(hotelName) {
  try {
    const hotel = await Hotel.findOne({ name: hotelName });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await readHotelByName(req.params.hotelName);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ error: "hotel name not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch hotel name." });
  }
});

async function readHotelByPhoneNumber(hotelPhoneNumber) {
  try {
    const hotel = await Hotel.findOne({ phoneNumber: hotelPhoneNumber });
    return hotel;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
  try {
    const hotel = await readHotelByPhoneNumber(req.params.phoneNumber);
    if (hotel) {
      res.json(hotel);
    } else {
      res
        .status(404)
        .json({ error: "No hotel with that provided phone number." });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fetch hotel by phone number." });
  }
});

async function readHotelsByRating(hotelRating) {
  try {
    const hotels = await Hotel.find({ rating: hotelRating });
    return hotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/rating/:hotelRating", async (req, res) => {
  try {
    const hotels = await readHotelsByRating(req.params.hotelRating);
    if (hotels.length > 0) {
      res.json(hotels);
    } else {
      res
        .status(404)
        .json({ error: "Can't find hotels with provided rating." });
    }
  } catch (error) {
    res.status(500).json({ error: "error fetching hotels by rating." });
  }
});

async function readHotelsByCategory(hotelCategory) {
  try {
    const hotels = await Hotel.find({ category: hotelCategory });
    return hotels;
  } catch (error) {
    throw error;
  }
}

app.get("/hotels/category/:hotelCategory", async (req, res) => {
  try {
    const hotels = await readHotelsByCategory(req.params.hotelCategory);
    if (hotels.length > 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ error: "no hotels with provided category." });
    }
  } catch (error) {
    res.status(500).json({ error: "error fetching hotels by category." });
  }
});

async function deleteHotelById(hotelId) {
  try {
    const deleteHotel = await Hotel.findByIdAndDelete(hotelId);
    return deleteHotel;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/hotels/:hotelId", async (req, res) => {
  try {
    const deletedHotel = await deleteHotelById(req.params.hotelId);
    if (deletedHotel) {
      res.status(200).json({ message: "Hotel deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error in deleting hotel by id." });
  }
});

async function updateHotelById(hotelId, dataToUpdate) {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {
      new: true,
    });
    return updatedHotel;
  } catch (error) {
    console.log("Error in updating hotel data.", error);
  }
}

app.post("/hotels/:hotelId", async (req, res) => {
  try {
    const updatedHotel = await updateHotelById(req.params.hotelId, req.body);
    if (updatedHotel) {
      res
        .status(200)
        .json({
          message: "Hotel updated successfully.",
          updatedHotel: updatedHotel,
        });
    } else {
      res.status(404).json({ error: "Hotel not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to update hotel data." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on PORT", PORT);
});
