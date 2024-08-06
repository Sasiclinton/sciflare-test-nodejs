const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/User');
const bcrypt = require('bcryptjs')
// Create User
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const { name, email, password, role, organizationId } = req.body;
  try {
    const newUser = new User({ name, email, password, role, organization: organizationId });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    const user = await newUser.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Get All Users (Admin Only)
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const users = await User.find().populate('organization');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



//Get User by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('organization');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if the user is requesting their own data or if the requester is an admin
    // if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    //   return res.status(403).json({ msg: 'Access denied' });
    // }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Update User (Admin and User)
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      let user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      // Check if the user is updating their own data or if the requester is an admin
      if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
        return res.status(403).json({ msg: 'Access denied' });
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  //Delete User (Admin only)

  router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: 'User not found' });
  
      if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
      }
  
      await User.findByIdAndDelete(req.params.id);
      res.json({ msg: 'User removed' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

module.exports = router;
