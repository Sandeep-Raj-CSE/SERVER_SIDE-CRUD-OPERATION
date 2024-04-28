const express = require("express");
const path = require("path");
const userModel = require("./models/user");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the index.ejs file
app.get("/", function (req, res) {
    res.render("index");
});

// Route to render the read.ejs file and fetch users from the database
app.get("/read", async function (req, res) {
    try {
        let users = await userModel.find();
        res.render("read", { users });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle the deletion of users
app.get("/delete/:id", async function (req, res) {
    try {
        let deletedUser = await userModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).send("User not found");
        }
        res.redirect("/read");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Route to render the edit page with the user details
app.get("/edit/:userid", async (req, res) => {
    try {
        let user = await userModel.findOne({ _id: req.params.userid });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("edit", { user });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle the update of a user
app.post("/edit/:userid", async (req, res) => {
    try {
        let { name, email, username } = req.body;
        let updatedUser = await userModel.findByIdAndUpdate(req.params.userid, {
            name: name,
            email: email,
            username: username
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).send("User not found");
        }
        res.redirect("/read");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle the creation of a new user
app.post("/create", async function (req, res) {
    try {
        let { name, email, username } = req.body;
        let userCreated = await userModel.create({
            name: name,
            email: email,
            username: username
        });
        res.redirect("/read");
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
