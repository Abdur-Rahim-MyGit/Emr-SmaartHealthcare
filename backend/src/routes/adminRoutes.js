router.post('/cancel-appointment', authMiddleware, adminController.cancelAppointment);
router.post('/activate-appointment', authMiddleware, adminController.activateAppointment); 