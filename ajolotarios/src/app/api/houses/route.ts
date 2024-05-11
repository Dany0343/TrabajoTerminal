import {prisma} from "../../../libs/db";
import { NextResponse } from "next/server";


// export async function POST(request: Request) {

//   const { title, description, location, propertyType, bedrooms, bathrooms, area, availability } = await request.json()

//   const newHouse = await prisma.property.create({
//     data: {
//         title,
//         description,
//         location,
//         propertyType,
//         bedrooms,
//         bathrooms,
//         area,
//         availability
//     }
//   })
  

//   return NextResponse.json(newHouse);
// }


export async function GET(request: Request) {
  const movies = await prisma.property.findMany();
  return NextResponse.json(movies)
}