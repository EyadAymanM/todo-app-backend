import jwt from 'jsonwebtoken';

export const authorization = async(req,res,next)=>{
  const { authorization } = req.headers;
  if(!authorization)
    return res.status(401).json({error: "Not Authorized"});

  try{
    const decoded = jwt.verify(authorization, 'any_secret_string_instead_of_using_.env');
    req.id = decoded.id;
    next();
  }catch{
    return res.status(500).json({ error: "Invalid Token" });
  }
};
