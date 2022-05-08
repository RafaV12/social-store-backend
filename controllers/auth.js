const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, password } = req.body;

  // Check if we receive username and password
  // check if username and password are valid
  // Remember to check for XSS attacks
  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'No username or password received' });
  }

  if (username.length < 4) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Username must be longer than 4 chars' });
  }

  if (password.length < 6) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Password must be longer than 6 chars' });
  }

  // Bcrypt password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Normalize user to insert into DB,
  // setting all usernames to lowercase
  const normalizedUser = {
    username: username.toLowerCase(),
    passwordHash,
  };

  // Insert user to DB
  try {
    const user = await User.create(normalizedUser);

    const userId = user._id;

    // Give the user a jsonwebtoken
    const token = jwt.sign({ userId, username }, process.env.TOKEN_KEY, {
      expiresIn: '24h',
    });

    res
      .status(StatusCodes.CREATED)
      .json({ user: { username: user.username }, token, userId });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  let { username, password } = req.body;
  username = username.toLowerCase();

  if (!username || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'No username or password received' });
  }

  const user = await User.findOne({ username });

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!(user && isPasswordCorrect)) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: 'Invalid user or password' });
  }

  // Give the user a jsonwebtoken
  const token = jwt.sign(
    { userId: user._id, username },
    process.env.TOKEN_KEY,
    {
      expiresIn: '24h',
    }
  );

  res.status(StatusCodes.OK).json({
    user: {
      username: user.username,
    },
    token,
    userId: user._id,
  });
};

module.exports = {
  register,
  login,
};
