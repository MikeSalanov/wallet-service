import { Request } from 'express';

interface RequestWithUserIdInterface extends Request {
  user_id?: string
}

export default RequestWithUserIdInterface;
