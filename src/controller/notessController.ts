import {  Response } from 'express';
import {  User } from '../models/User';

import { Note } from '../models/Notes';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const addNotes=async(req: AuthenticatedRequest,res:Response)=>{
    try{
        
        
        const { title, content } = req.body;

        if (!req.userId) {
          return res.status(401).json({ success:false ,message: 'not authorized user' });
        }
    
        const note = await Note.create({
          title,
          content,
          user: req.userId,
        });
    
        res.status(201).json({ success: true,message:"Notes successfully created", note });

    }catch(err){
        res.status(500).json({ success:false,message: 'Failed to add note' });
    }

}

export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
  
      if (!req.userId) {
        return res.status(401).json({success:false, message: 'not authorized user' });
      }
  
      const note = await Note.findOneAndDelete({ _id: id, user: req.userId });
  
      if (!note) {
        return res.status(404).json({ success:false,message: 'notes not found' });
      }
  
      res.json({ success: true, message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Delete Note Error:', error);
      res.status(500).json({ success:false,message: 'Failed to delete note' });
    }
  };
  

  export const myProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ success:false,message: 'Not Autorizedd User' });
      }
  
      const user = await User.findById(req.userId).select('name email');
      if (!user) {
        return res.status(404).json({ success:false,message: 'user not found' });
      }
  
      res.json({ success: true, user });
    } catch (error) {
    
      res.status(500).json({ success:false,message: 'failed to  fetch user' });
    }
  };

  export const fetchNotes = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({success:false, message: 'Unauthorized' });
      }
  
      const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
  
      res.json({ success: true, notes });
    } catch (error) {
      console.error('Fetch Notes Error:', error);
      res.status(500).json({ success:false,message: 'Failed to fetch notes' });
    }
  };
  