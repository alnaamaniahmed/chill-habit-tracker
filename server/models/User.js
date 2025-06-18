import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: false,

    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values but enforces uniqueness when present
    },
    profilePicture: {
        type: String,
        default: null,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationExpires: {
        type: Date,
        default: null,
    },
    
    // Password reset fields
    passwordResetToken: {
        type: String,
        default: null,
    },
    passwordResetExpires: {
        type: Date,
        default: null,
    },
    
    // Security fields - track failed attempts
    loginAttempts: {
        type: Number,
        default: 0,
    },
    lockUntil: {
        type: Date,
    },
    
    // Track when password was last changed
    passwordChangedAt: {
        type: Date,
        default: Date.now,
    },
},{
    timestamps: true
});

UserSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre('save', function(next){
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

UserSchema.methods.incLoginAttempts = function() {
    // Check if we have a previous lock that has expired
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: {
                loginAttempts: 1,
                lockUntil: 1
            }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Lock account after 5 failed attempts for 2 hours
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = {
            lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
        };
    }
    
    return this.updateOne(updates);
};

// Instance method to reset login attempts
UserSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: {
            loginAttempts: 1,
            lockUntil: 1
        }
    });
};

// Instance method to check if password was changed after token was issued
UserSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    
    // False means NOT changed
    return false;
};

// Static method to clean up expired tokens
UserSchema.statics.cleanExpiredTokens = function() {
    const now = new Date();
    return this.updateMany(
        {
            $or: [
                { emailVerificationExpires: { $lt: now } },
                { passwordResetExpires: { $lt: now } }
            ]
        },
        {
            $unset: {
                emailVerificationToken: "",
                emailVerificationExpires: "",
                passwordResetToken: "",
                passwordResetExpires: ""
            }
        }
    );
};

// Index for performance
UserSchema.index({ email: 1 });
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });
UserSchema.index({ googleId: 1 });

export default mongoose.model('User', UserSchema);