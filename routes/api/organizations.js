const express = require('express');
const router = express.Router();
const passport = require('passport');
const Organization = require('../../models/Organization');

// Create Organization
router.post('/', 
    // passport.authenticate('jwt', { session: false }), 
    async (req, res) => {
//   if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  const { name, address } = req.body;
  try {
    const newOrg = new Organization({ name, address });
    const org = await newOrg.save();
    res.json(org);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get Organization by ID.

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const organization = await Organization.findById(req.params.id);
      if (!organization) return res.status(404).json({ msg: 'Organization not found' });
  
      if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
      }
  
      res.json(organization);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });

//Get All Organizations (Admin Only)

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const organizations = await Organization.find();
    res.json(organizations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Update Organization (Admin only)

router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { name, address } = req.body;

  try {
    let organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ msg: 'Organization not found' });

    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    organization.name = name || organization.name;
    organization.address = address || organization.address;

    await organization.save();
    res.json(organization);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Delete Organization (Admin only)
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    let organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(404).json({ msg: 'Organization not found' });

    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Organization.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Organization removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
