const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  degree: { type: String },
  branch: { type: String },
  yearsOfExperience: { type: String },
  workingPlace: { type: String },
  domain: { type: String },
  mobileNumber: { type: String },
  college: { type: String },
  graduationDate: { type: Date },
  profileImageUrl: { type: String },
});



userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);

