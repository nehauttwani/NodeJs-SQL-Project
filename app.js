import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";
import mysql from "mysql2/promise";
import {
  checkExistingContact,
  updateContact,
  insertContact,
  getFeedbackById,
  deleteFeedback,
  getAllContacts,
} from "./database/helper.js";

const __dirname = path.resolve();
const app = express();
const port = 5000;

// Database connection pool
let pool;

// Initialize database connection
async function initializeDatabase() {
  try {
    pool = await mysql.createPool({
      host: "localhost",
      user: "root",
      password: "Cprg212user",
      database: "CPRG212",
    });
    console.log("Connected to database!");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
}

// Initialize database before starting the server
initializeDatabase().then(() => {
  // Server setup
  app.set("layout", "layout");
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(expressLayouts);
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  // Route handlers
  app.get("/", (req, res) => {
    res.render("index", { title: "Home Page", active: "index" });
  });

  app.get("/about", (req, res) => {
    res.render("about", { title: "About Us", active: "about" });
  });

  app.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact Us", active: "contact" });
  });

  // Thank you page after form submission
  app.get("/thank-you", (req, res) => {
    const { name, isUpdate } = req.query;
    console.log("thankyou page", isUpdate);
    res.render("thank-you", {
      title: "Thank You",
      active: "",
      name: name,
      isUpdate: isUpdate === "true",
    });
  });

  // Display all feedbacks
  app.get("/feedbacks", async (req, res) => {
    try {
      const rows = await getAllContacts(pool);
      res.render("feedbacks", {
        title: "Feedbacks",
        active: "feedbacks",
        feedbacks: rows,
      });
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      res.status(500).send("An error occurred while fetching feedbacks");
    }
  });

  // Handle contact form submission
  app.post("/contact", async (req, res) => {
    const { id, fullname, email, phone, message } = req.body;

    // Validate form inputs
    if (!fullname || !email || !phone || !message) {
      return res.render("contact", {
        title: "Contact Us",
        active: "contact",
        error: "All fields are required",
        formData: req.body,
        isEditing: !!id,
      });
    }

    try {
      let isUpdate = false;
      let existingContact;
      if (!id) {
        // Check if contact already exists
        existingContact = await checkExistingContact(pool, fullname);
      }

      if (id || existingContact) {
        // Update existing contact
        await updateContact(
          pool,
          existingContact ? existingContact.id : id,
          fullname,
          email,
          phone,
          message
        );
        isUpdate = true;
      }
      else {
        // Insert new contact
        await insertContact(pool, fullname, email, phone, message);
        isUpdate = false;
      }

      res.redirect(
        `/thank-you?name=${encodeURIComponent(fullname)}&isUpdate=${isUpdate}`
      );
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.render("contact", {
        title: "Contact Us",
        active: "contact",
        error:
          "An error occurred while processing your request. Please try again.",
        formData: req.body,
      });
    }
  });

  // Edit feedback form
  app.get("/edit-feedback/:id", async (req, res) => {
    try {
      const feedback = await getFeedbackById(pool, req.params.id);
      if (feedback) {
        res.render("contact", {
          title: "Edit Feedback",
          active: "contact",
          formData: feedback,
          isEditing: true,
        });
      } else {
        res
          .status(404)
          .render("404", { title: "404 | Feedback not found!", active: "" });
      }
    } catch (error) {
      console.error("Error fetching feedback for edit:", error);
      res.status(500).send("An error occurred while fetching the feedback");
    }
  });

  // Delete feedback
  app.post("/delete-feedback/:id", async (req, res) => {
    console.log("Deleting the message!");
    try {
      await deleteFeedback(pool, req.params.id);
      res.redirect("/feedbacks");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).send("An error occurred while deleting the feedback");
    }
  });

  // 404 handler
  app.use((req, res, next) => {
    res
      .status(404)
      .render("404", { title: "404 | Page not found!", active: "" });
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});