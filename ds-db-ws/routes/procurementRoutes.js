const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');


router.get('/', procurementController.getAll);
router.get('/details', procurementController.getDetails);
router.post('/add', procurementController.add);

router.get("/my-procurements", procurementController.getMyProcurements);
router.get("/pending-products", procurementController.getPendingProductIds);

router.post('/submit', procurementController.submitCart);
router.post('/grouped/submit', procurementController.submitGroupedRequest);


router.get('/requests/grouped', procurementController.getGroupedPendingRequests);
router.post('/requests/group/:groupId/approve', procurementController.approveGroupedRequest);
router.post('/requests/group/:groupId/reject', procurementController.rejectGroupedRequest);

module.exports = router;






