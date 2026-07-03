const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_DIR = path.join(__dirname, '../.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');

const readReservationsFromFile = () => {
  if (!fs.existsSync(RESERVATIONS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(RESERVATIONS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
};

const writeReservationsToFile = (reservations) => {
  fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));
};

// Mongoose Schema
const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide the reservation date'],
  },
  guests: {
    type: Number,
    required: [true, 'Please provide the number of guests'],
    min: [1, 'Must have at least 1 guest'],
  },
  request: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MongooseReservation = mongoose.model('Reservation', ReservationSchema);

class QueryThenable {
  constructor(promiseOrValue) {
    this.promiseOrValue = promiseOrValue;
  }
  sort(sortObj) {
    if (this.promiseOrValue instanceof Promise) {
      this.promiseOrValue = this.promiseOrValue.then(res => {
        if (Array.isArray(res) && sortObj.date) {
          res.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        return res;
      });
    } else {
      if (Array.isArray(this.promiseOrValue) && sortObj.date) {
        this.promiseOrValue.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
    }
    return this;
  }
  then(onFulfilled, onRejected) {
    return Promise.resolve(this.promiseOrValue).then(onFulfilled, onRejected);
  }
}

class ReservationWrapper {
  constructor(data) {
    this._id = data._id || data.id || new mongoose.Types.ObjectId().toString();
    this.user = data.user;
    this.name = data.name;
    this.date = data.date;
    this.guests = data.guests;
    this.request = data.request || '';
    this.createdAt = data.createdAt || new Date();
  }

  async save() {
    if (mongoose.connection.readyState === 1) {
      const mRes = new MongooseReservation({
        user: this.user,
        name: this.name,
        date: this.date,
        guests: this.guests,
        request: this.request
      });
      const saved = await mRes.save();
      return new ReservationWrapper(saved);
    } else {
      const reservations = readReservationsFromFile();
      const newRecord = {
        _id: this._id.toString(),
        user: this.user ? this.user.toString() : null,
        name: this.name,
        date: this.date,
        guests: Number(this.guests),
        request: this.request,
        createdAt: this.createdAt
      };
      reservations.push(newRecord);
      writeReservationsToFile(reservations);
      return this;
    }
  }

  static find(query) {
    if (mongoose.connection.readyState === 1) {
      return new QueryThenable(
        MongooseReservation.find(query).then(list => list.map(item => new ReservationWrapper(item)))
      );
    } else {
      const reservations = readReservationsFromFile();
      const filtered = reservations.filter(r => {
        if (query.user) {
          return r.user && r.user.toString() === query.user.toString();
        }
        return true;
      });
      return new QueryThenable(filtered.map(item => new ReservationWrapper(item)));
    }
  }
}

module.exports = ReservationWrapper;
