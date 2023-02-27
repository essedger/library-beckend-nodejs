import express from 'express';
const router = express.Router();

router.get('/api/v1/', (req: any, res: any) => {
  res.status(200).send({ message: 'Default route :) ' });
});

export default router;
