/**
 * Using Gale Shaply Matching Algorithm Match Roommates based on their Prefrences
 * In this implementation, the function galeShapley takes a parameter roommatePreferences, which is an object mapping each roommate's name to an array of their preferences for roommates.

The algorithm follows the Gale-Shapley algorithm's structure for stable matching. It iterates until all roommates have proposed to every other roommate. It selects a free roommate who hasn't proposed to all other roommates yet and examines their preferred roommate according to their preferences. Based on the current match status, it either makes a new match or compares preferences to determine if a match needs to be updated.

At the end of the algorithm, it returns a dictionary (matches) where each roommate's name is mapped to their matched roommate's name, representing the stable roommate assignments produced by the Gale-Shapley algorithm for matching roommates.
 */
import { error } from 'console';
import express, { Request, Response } from 'express';

function galeShaply(roommatePrefrences:Record<string , string[]>) :Record<string, string>{
    

    const roommates :string[] = Object.keys(roommatePrefrences)
    const matches : Record<string , string > = {}
    const proposals : Record<string , number> = {}

    //Initialize all roommates as free and with out any proposal 
    for(const roomamte of roommates){
        matches[roomamte] = ""
        proposals[roomamte]=0
    }
    while (true){
        let freeRoommate:string | undefined = undefined
        //Find a free roommate who hasn't proposed to every roommates 
        for(const roomamte of roommates){
            if(proposals[roomamte] < roomamte.length -1){
                freeRoommate = roomamte
                break;
            }
        }
        if(!freeRoommate){
            //All Rooommates have proposed to every othere roommates , matching is complate 
            break ; 
        }
        const preferedRoommate  = roommatePrefrences[freeRoommate][proposals[freeRoommate]]
        const currentMatch = matches[preferedRoommate]

        if(currentMatch ===""){
            // Preferred roommate is currently unmatched, make the match
            matches[preferedRoommate] = freeRoommate
            proposals[freeRoommate]
        }else{
            //Prefered roommate is currently matched check if they prefer the new roommate 
            const preferedRoommatePrefreces = roommatePrefrences[preferedRoommate]
            const currentMatchIndex = preferedRoommatePrefreces.indexOf(currentMatch)
            const newMatchIndex = preferedRoommatePrefreces.indexOf(freeRoommate)

            if(newMatchIndex < currentMatchIndex){
                //prefered roommate prefers the new roommate , update the match adn proposals 
                matches[preferedRoommate] = freeRoommate
                proposals[freeRoommate]++
                proposals[currentMatch]++
            }else{
                //prefered roommate prefers the current match 
                proposals[freeRoommate]++
            }
        }
    }

    return matches
}

export const MatchRoommate=async(req:Request , res:Response)=>{
    const roommatePrefrences = req.body;
    try {
        const matches = galeShaply(roommatePrefrences)
        if(!matches){
           return res.status(400).json({
            status:"ERROR",
            message:`Error to match the roommates`
           })
        }
        res.status(200).json(matches)
    } catch (error) {
        res.status(500).json({error:"Invalid Request"})
    }
}