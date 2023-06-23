/**
 * The function iterates through each home in the homes array and checks if it matches the given criteria. It compares each criterion in the homeCriteria object with the corresponding value of the current home. If all criteria match, the home is considered a match and added to the matchingHomes array.At the end of the function, the array matchingHomes contains the names or identifiers of the homes that meet the specified criteria.
 */
import express , {Request , Response} from 'express'
import prisma from '../db'


function findMatchingHomes(homeCritereial :Record <string , string >): string[] {
    const homes :string[] = ['Home A ' , 'Home B' , "Home C " , "Home D"]  //Simple List  of homes 
    const matchingHomes : string[] = []

    for(const home of homes ){
        let isMatch = true
        for(const [criteria , value ] of Object.entries(homeCritereial)){
            //Perform Matching logic based on home criteria 
            if(home[criteria] !== value){
                isMatch = false
                break
            }
        }
        if(isMatch){
            matchingHomes.push(home)
        }
    }
    
    return matchingHomes
}
export const findHome = async(req:Request , res : Response)=>{
    const homeCritereial = req.body;
    try {
        const matchingHomes = findMatchingHomes(homeCritereial)
        if(!matchingHomes){
            return res.status(400).json({
                status:"Error",
                message:`Error Finding Homes for your criteria`
            })
        }

        res.status(200).json({
            status:"Success",
            data:matchingHomes
        })
    } catch (error) {
        return res.status(500).json({
            status:"Error",
            Message:"Server error",
            Error:`${error.message}`
        })
    }
}


//Home Create

export const createHome = async(req:Request , res:Response)=>{
    const {title , description , price ,type , country , city ,street , lon , lat } = req.body
   try {
    const room= await prisma.room.create({
        data:{
            title,
            description,
            price,
            type,
            country,
            city,
            street,
            lon,
            lat,
        }
    })

    if(!room){
        return res.status(401).json({message:`Error Creating Room`})
    }
    res.status(200).json({
        status:"Success",
        data:room
    })
   } catch (error) {
    return res.status(500).json({
        status:"Error",
        Message:"Server error",
        Error:`${error.message}`
    })
   }
}