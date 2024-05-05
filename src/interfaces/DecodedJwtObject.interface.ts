import { JwtPayload } from "jsonwebtoken";

interface DecodedJwtObjectInterface extends JwtPayload{
  "user_id"?: string
}

export default DecodedJwtObjectInterface;
