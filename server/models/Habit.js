import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema({

    date:{
        type: String,
        required: true,
    },
    done:{
        type: Boolean,
        required: true,
        default: false,
    }

});

const HabitSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    records:[RecordSchema]

}, {
    timestamps: true
});

export default mongoose.model('Habit', HabitSchema);