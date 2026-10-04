const { Router } = require('express');
const healthRoutes = require('./health.routes');

const router = Router();

router.use('/health', healthRoutes);
// Feature routes get mounted here, e.g.:
// router.use('/auth', authRoutes);
// router.use('/jobs', jobRoutes);

module.exports = router;
