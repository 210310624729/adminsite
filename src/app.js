const express = require("express");
const app = express();
const PORT  = process.env.PORT || 3000
const hbs = require("hbs");
const bodyParser = require("body-parser");
const path = require("path");

app.use(bodyParser.json());

const MONGO_URL = 'mongodb+srv://cuteuserapplication:0CMj1vcVtwPW8RBX@cute.ro3zqls.mongodb.net/test'


//const uri = process.env.MONGO_URL;
const mongoose = require("mongoose");
mongoose.set('strictQuery',false);
const db = mongoose.connection;
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    //we are connected
    console.log("we are connected...");
});


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
  });
  
  const User = mongoose.model('User', userSchema);


app.use(express.json());
app.use(express.urlencoded({extended:false}));

const template_path = path.join(__dirname, "../views");


app.set("views", template_path);
app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.render("loginadmin");
});

app.get("/signuppage", (req, res) => {
    res.render("signupadmin");
});
app.get("/welcomeadmin", (req, res) => {
  res.render("welcomeadmin");
});

app.post('/signupadmin', async (req, res) => {
    try {
      const { username, password, phoneNumber, address } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }
  
      // Create a new user
      const newUser = new User({ username, password, phoneNumber, address });
      await newUser.save();
  
      res.status(201).redirect("/welcomeadmin");
    } catch (err) {
      console.error('Error during user signup:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  

  app.post('/login/admin', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ username });
  
      // If user not found
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the password is correct
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Successful login
      res.status(200).render("welcomeadmin");
    } catch (err) {
      console.error('Error during user login:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
//app listening
app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
 });