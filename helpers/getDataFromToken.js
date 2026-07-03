import jwt from 'jsonwebtoken';

export const getDataFromToken = (req) =>{
    try{
        const encodedToken =  req.cookies.get('jwt')?.value || "";
        const decodedToken = jwt.verify(encodedToken, process.env.TOKEN_SECRET);
        return decodedToken.id;
        
    } catch(err) {
        return null;
    }
}
