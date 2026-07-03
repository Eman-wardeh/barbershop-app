// import mongoose from "mongoose";

// export async function connectToDb(){
//     try{
//         await mongoose.connect(process.env.DB_URI); 
//         const connection = mongoose.connection;
//         connection.on('connected', ()=>{
//             console.log("Connected to the database successfully!");
//         })
//         connection.on('error', (err) =>{
//             console.error("Database connection error:", err);
//             process.exit(1); // Exit the process with an error code
//         })
//     }
//     catch(error){
//         console.error("Error connecting to the database:", error);
//     }
// }
import mongoose from "mongoose";

export async function connectToDb() {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }

        await mongoose.connect(process.env.DB_URI);

        console.log("Connected to the database successfully!");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}