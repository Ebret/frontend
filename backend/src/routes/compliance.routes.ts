import express from 'express';
import {
  createFiling,
  getFiling,
  listRequirements,
  completeModule,
  setStatus,
  createDeficiency,
  assessLatePenalty,
} from '../controllers/compliance.controller';

const router = express.Router();

router.post('/filings', createFiling);
router.get('/filings/:id', getFiling);
router.post('/requirements', listRequirements);
router.post('/filings/:id/modules/complete', completeModule);
router.post('/filings/:id/status', setStatus);
router.post('/filings/:id/deficiencies', createDeficiency);
router.post('/filings/:id/penalties', assessLatePenalty);

export default router;
