// imports
import express from "express"; // Importing the Express framework for building web applications
import bodyParser from "body-parser"; // Importing body-parser to handle data in POST requests
import mongoose from "mongoose";

// constants
const app = express(); // Creating an instance of the Express application
const PORT = 3000; // Defining the port number where the server will run

// mongoose connect
async function connectDB() {
  try {
    const conn = await mongoose.connect(
      "mongodb://localhost:27017/andez_Expenses_DB"
    );
    console.log("Host : ", conn.connection.host);
  } catch (err) {
    console.log(err);
  }
}

connectDB();

// schema
const expenseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3 },
    amount: { type: String, required: true, minLength: 3 },
    date: { type: String, default: new Date().toLocaleDateString() },
  },
  {
    timestamps: true,
  }
);

// model
const Expense = new mongoose.model("Expense", expenseSchema);

// middlewares

// load static files
app.use(express.static("public")); // Middleware to serve static files (e.g., CSS, JS, images) from the "public" folder
// read data coming from body with the request
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse URL-encoded data from forms (extended allows nested objects)
// set view engine to ejs
app.set("view engine", "ejs"); // Setting EJS as the templating engine for rendering dynamic HTML

// ROUTES

// Root / home route  : "/"
app.get("/", async (req, res) => {
  let foundExpenses;
  try {
    foundExpenses = await Expense.find({});
    console.log("EXPENSES =>", foundExpenses);

    res.render("home", {
      // value of expenses key will be the expenses array if the length > 0, else it will be string message
      expenses: foundExpenses.length > 0 ? foundExpenses : "No Expenses Found",
      title: "Expense Tracker", // Title for the webpage
    });
  } catch (err) {
    console.log(err);
  }
}); // GET request to the root route, rendering the home.ejs template with dynamic values for expenses and title

app.post("/", async (req, res) => {
  try {
    const new_expense = new Expense({
      name: req.body.expense_name,
      amount: req.body.expense_amount,
    });

    await new_expense.save();
    console.log(new_expense);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

// route for item deleting
app.route("/delete/:id").get((req, res) => {
  const id = parseInt(req.params.id); // Extracting the id from the URL parameters and converting it to an integer
  expenses = expenses.filter((expense, index) => {
    return index != id; // Filtering the expenses array, keeping only the items that don't match the id
  });
  res.redirect("/"); // Redirecting to the root route after deleting an expense
});

// server setup

app.listen(PORT, () => {
  console.log("server started on port", PORT); // Starting the server and logging a message with the port number
});
