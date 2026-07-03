const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '../.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const readUsersFromFile = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeUsersToFile = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Mongoose Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MongooseUser = mongoose.model('User', UserSchema);

class QueryThenable {
  constructor(promiseOrValue) {
    this.promiseOrValue = promiseOrValue;
  }
  select(fields) {
    if (this.promiseOrValue instanceof Promise) {
      this.promiseOrValue = this.promiseOrValue.then(res => {
        if (res && fields.includes('-password')) {
          res.password = undefined;
        }
        return res;
      });
    } else {
      if (this.promiseOrValue && fields.includes('-password')) {
        this.promiseOrValue.password = undefined;
      }
    }
    return this;
  }
  then(onFulfilled, onRejected) {
    return Promise.resolve(this.promiseOrValue).then(onFulfilled, onRejected);
  }
}

class UserWrapper {
  constructor(data) {
    this._id = data._id || data.id || new mongoose.Types.ObjectId().toString();
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.createdAt || new Date();
  }

  async save() {
    if (mongoose.connection.readyState === 1) {
      const mUser = new MongooseUser({
        username: this.username,
        email: this.email,
        password: this.password
      });
      const saved = await mUser.save();
      return new UserWrapper(saved);
    } else {
      const users = readUsersFromFile();
      users.push({
        _id: this._id.toString(),
        username: this.username,
        email: this.email,
        password: this.password,
        createdAt: this.createdAt
      });
      writeUsersToFile(users);
      return this;
    }
  }

  static findOne(query) {
    if (mongoose.connection.readyState === 1) {
      return new QueryThenable(MongooseUser.findOne(query).then(res => res ? new UserWrapper(res) : null));
    } else {
      const users = readUsersFromFile();
      const user = users.find(u => {
        if (query.email) return u.email === query.email;
        if (query.username) return u.username === query.username;
        return false;
      });
      return new QueryThenable(user ? new UserWrapper(user) : null);
    }
  }

  static findById(id) {
    if (mongoose.connection.readyState === 1) {
      return new QueryThenable(MongooseUser.findById(id).then(res => res ? new UserWrapper(res) : null));
    } else {
      const users = readUsersFromFile();
      const user = users.find(u => u._id.toString() === id.toString());
      return new QueryThenable(user ? new UserWrapper(user) : null);
    }
  }
}

module.exports = UserWrapper;
