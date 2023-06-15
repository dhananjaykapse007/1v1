const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: "../server/uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
  
const upload = multer({ storage: storage });


const challengeController = require('../controllers/challengeController');
const { add_challenge_to_contest } = require('../controllers/contestController');

router.post('/user-challenges', challengeController.user_challenges);
router.post('/contest-challenges', challengeController.contest_challenges)
router.post('/create', challengeController.create_challenge);       // auth middleware needed
router.get('/:id', challengeController.get_challenge_details);
router.post('/:id/submit', challengeController.challenge_submit);
router.post('/:id/add-moderator', challengeController.add_moderator_for_challenge);
router.post('/:id/remove-moderator', challengeController.remove_moderator_for_challenge);
router.post('/:id/delete', challengeController.delete_challenge);
router.put('/:id/update', challengeController.update_challenge_details);
router.post('/:id/upload_tc/sample', upload.fields([{ name: 'sample_in_tc', maxCount: 1 }, { name: 'sample_op_tc', maxCount: 1 }]), challengeController.upload_tc_sample);
router.post('/:id/upload_tc/hidden', upload.fields([{ name: 'hidden_in_tc', maxCount: 1 }, { name: 'hidden_op_tc', maxCount: 1 }]), challengeController.upload_tc_hidden);
router.post('/:id/delete_tc', challengeController.delete_tc);

module.exports = router;