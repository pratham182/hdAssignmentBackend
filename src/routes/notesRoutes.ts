import express from 'express';
import { addNotes,deleteNote,fetchNotes,myProfile } from '../controller/notessController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { RequestHandler } from 'express';

const router = express.Router();

router.get('/me', authenticateJWT as RequestHandler, myProfile as RequestHandler);
router.get('/getAllNotes', authenticateJWT as RequestHandler, fetchNotes as RequestHandler);

router.post('/createNotes', authenticateJWT as RequestHandler, addNotes as RequestHandler);
router.delete('/deleteNotes/:id', authenticateJWT as RequestHandler, deleteNote as RequestHandler);


export default router;








