import {
    //    Scores, 
    Champions,
    //    Schedules 
} from "@/types/types"

/*
  Mock data for the scores page. (Testing purposes)
*/
// export const mockScoresData: Scores[] = [
//     {
//         id: 1,
//         startDate: "2024-09-02T16:00:00.000Z",
//         sport: "Basketball",
//         teams: {
//             home: "SAFAD",
//             away: "SOE"
//         },
//         scores: {
//             home: 85,
//             away: 90,
//         },
//         winner: "SOE"
//     },
//     {
//         id: 2,
//         startDate: "2024-09-17T16:00:00.000Z",
//         sport: "Basketball",
//         teams: {
//             home: "SAFAD",
//             away: "SOE"
//         },
//         scores: {
//             home: 80,
//             away: 82,
//         },
//         winner: "SOE"
//     },
//     {
//         id: 3,
//         startDate: "2024-09-16T16:00:00.000Z",
//         sport: "Volleyball",
//         teams: {
//             home: "SAFAD",
//             away: "SOE"
//         },
//         scores: {
//             home: 21,
//             away: 25,
//         },
//         winner: "SOE"
//     },
//     {
//         id: 4,
//         startDate: "2024-09-02T07:00:00.000Z",
//         sport: "Badminton",
//         teams: {
//             home: "SHCP",
//             away: "SAS"
//         },
//         scores: {
//             home: 15,
//             away: 21,
//         },
//         winner: "SAS"
//     },
//     {
//         id: 5,
//         startDate: "2024-09-21T16:00:00.000Z",
//         sport: "Swimming",
//         teams: {
//             home: "SHCP",
//             away: "SAS"
//         },
//         scores: {
//             home: 12,
//             away: 15,
//         },
//         winner: "SAS"
//     },
//     {
//         id: 6,
//         startDate: "2024-09-19T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SHCP",
//             away: "SAS"
//         },
//         scores: {
//             home: 13,
//             away: 15,
//         },
//         winner: "SAS"
//     },
//     {
//         id: 6,
//         startDate: "2024-09-19T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SHCP",
//             away: "SAS"
//         },
//         scores: {
//             home: 12,
//             away: 15,
//         },
//         winner: "SAS"
//     },
//     {
//         id: 6,
//         startDate: "2024-09-19T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SAFAD",
//             away: "SOE"
//         },
//         scores: {
//             home: 10,
//             away: 15,
//         },
//         winner: "SOE"
//     },
//     {
//         id: 6,
//         startDate: "2024-09-19T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SAFAD",
//             away: "SAS"
//         },
//         scores: {
//             home: 9,
//             away: 15,
//         },
//         winner: "SAS"
//     },
//     {
//         id: 6,
//         startDate: "2024-09-19T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SAFAD",
//             away: "SAS"
//         },
//         scores: {
//             home: 15,
//             away: 10,
//         },
//         winner: "SAFAD"
//     },
//     {
//         id: 6,
//         startDate: "2024-09-19T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SAFAD",
//             away: "SAS"
//         },
//         scores: {
//             home: 13,
//             away: 15,
//         },
//         winner: "SAS"
//     },
//     {
//         id: 6,
//         startDate: "2024-09-19T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SAFAD",
//             away: "SAS"
//         },
//         scores: {
//             home: 7,
//             away: 15,
//         },
//         winner: "SAS"
//     },
// ];

// // Mockdata for an authenticated staff user
// export const userMockData = {
//     name: "John Doe",
//     role: "staff"
// };

/* 
  Mock data for the Champions page
*/
export const mockChampionsData: Champions[] = [

];

// /* 
//   Mock data for the Schedules page
// */
// export const mockSchedulesData: Schedules[] = [
//     {
//         id: 1,
//         startDate: "2024-10-20T16:00:00.000Z",
//         sport: "Badminton",
//         teams: {
//             home: "SAS",
//             away: "TEAM A - SOE"
//         },
//         scores: null,
//         location: "TC - Badminton Court",
//     },
//     {
//         id: 2,
//         startDate: "2024-10-15T16:00:00.000Z",
//         sport: "Basketball",
//         teams: {
//             home: "SAFAD",
//             away: "SBE"
//         },
//         scores: {
//             home: 10,
//             away: 15,
//         },
//         location: "TC - Basketball Court",
//     },
//     {
//         id: 3,
//         startDate: "2024-10-15T16:00:00.000Z",
//         sport: "Swimming",
//         teams: {
//             home: "SOE",
//             away: "SHCP"
//         },
//         scores: {
//             home: 10,
//             away: 15,
//         },
//         location: "DC - Swimming Pool",
//     },
//     {
//         id: 4,
//         startDate: "2024-10-18T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SAS",
//             away: "SLG"
//         },
//         scores: null,
//         location: "DC - Lawn Tennis Court",
//     },
//     {
//         id: 4,
//         startDate: "2024-10-18T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SAS",
//             away: "SLG"
//         },
//         scores: null,
//         location: "DC - Lawn Tennis Court",
//     },
//     {
//         id: 4,
//         startDate: "2024-10-24T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SAS",
//             away: "SLG"
//         },
//         scores: null,
//         location: "DC - Lawn Tennis Court",
//     },
//     {
//         id: 4,
//         startDate: "2024-10-25T16:00:00.000Z",
//         sport: "Lawn Tennis",
//         teams: {
//             home: "SAS",
//             away: "SLG"
//         },
//         scores: null,
//         location: "DC - Lawn Tennis Court",
//     },
// ];

export const games = [
    'Swimming',
    'Basketball',
    'Football',
    'Tennis',
    'Volleyball',
    'Baseball',
    'Soccer',
];

export const teams = [
    'Lakers',
    'Celtics',
    'Nets',
    'Bulls',
    'Pistons',
    'Raptors',
    'Warriors',
    'Thunder',
];