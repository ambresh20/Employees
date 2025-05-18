const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  sno: {
	type: Number,
	unique: true
  },
  userName: {
	type: String,
	required: [true, 'Username is required'],
	unique: true
  },
  password: {
	type: String,
	required: [true, 'Password is required']
  }
}, { timestamps: true });

// Auto-increment sno field
UserSchema.pre('save', async function(next) {
  if (!this.sno) {
	const lastUser = await this.constructor.findOne({}, {}, { sort: { 'sno': -1 } });
	this.sno = lastUser ? lastUser.sno + 1 : 1;
  }
  next();
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
  } catch (error) {
	next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);