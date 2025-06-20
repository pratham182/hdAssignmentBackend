import express from 'express';

import dotenv from 'dotenv';

const app = express();
const port = process.env.PORT || 3000;

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      status: 'error',
      message: 'Internal errors'
    });
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }); 


