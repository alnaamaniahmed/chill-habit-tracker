import express from "express";
import auth from "../middleware/auth.js";
import Habit from "../models/Habit.js";

const router = express.Router();

router.use(auth);

//getting habit
router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.json(habits);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//create a habit
router.post("/", async (req, res) => {
  try {
    const newHabit = new Habit({
      user: req.user.id,
      title: req.body.title,
      records: [],
    });
    const habit = await newHabit.save();
    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
//toggle a habit mark it as done
router.patch("/:id/toggle", async (req, res) => {
  try {
    const { date } = req.query;

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    const idx = habit.records.findIndex((r) => r.date === date);
    if (idx > -1) {
      habit.records[idx].done = !habit.records[idx].done;
    } else {
      habit.records.push({ date, done: true });
    }
    await habit.save();
    res.json(habit.records);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title } = req.body;

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title },
      { new: true }
    );
    if (!habit) {
      return res.status(404).json({ message: "Habit is not found" });
    }
    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.delete("/:id", async (req, res) => {

    try {
        const habit = await Habit.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if(!habit){
            return res.status(404).json({message: "Habit is not found"});
        }
        res.json({message: "Habit removed"});

    } catch (err){
        console.error(err);
        res.status(500).send("Server error");
    }

});

export default router;