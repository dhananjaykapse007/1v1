const express = require('express')
const router = express.Router()

const contestController = require('../controllers/contestController')

router.post('/', contestController.get_contests)
router.post('/create', contestController.create_contest);
router.get('/:id', contestController.get_contest_details);       
router.post('/:id/delete', contestController.delete_contest);       
router.put('/:id/update', contestController.update_contest_details);
router.post('/:id/register', contestController.contest_registration);
router.post('/:id/announce', contestController.make_announcement);
router.post('/:id/add-moderator', contestController.add_moderator_for_contest);
router.post('/:id/remove-moderator', contestController.remove_moderator_from_contest);
router.post('/:id/add-challenge', contestController.add_challenge_to_contest);
router.post('/:id/remove-challenge', contestController.remove_challenge_from_contest);
router.post('/:id/remove-participant', contestController.remove_participant);
router.get('/:id/get-next-round', contestController.get_next_round);
router.get('/:id/results', contestController.get_results);
router.post('/:id/round/:round/submit-ac', contestController.submit_ac);



module.exports = router;