import { Router, Request, Response } from 'express';
import Vehicle from '../models/Vehicle';
import Inquiry from '../models/Inquiry';

const router = Router();

// --- Vehicles Routes ---

// Get all vehicles
router.get('/vehicles', async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get vehicle by slug
router.get('/vehicles/:slug', async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findOne({ slug: req.params.slug });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new vehicle
router.post('/vehicles', async (req: Request, res: Response) => {
  try {
    const newVehicle = new Vehicle(req.body);
    const saved = await newVehicle.save();
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update vehicle spec/status
router.put('/vehicles/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete vehicle
router.delete('/vehicles/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Inquiries Routes ---

// Get all inquiries
router.get('/inquiries', async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new inquiry
router.post('/inquiries', async (req: Request, res: Response) => {
  try {
    const newInquiry = new Inquiry(req.body);
    const saved = await newInquiry.save();
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Update inquiry status/notes
router.put('/inquiries/:id', async (req: Request, res: Response) => {
  try {
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
