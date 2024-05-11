import { NextResponse } from "next/server";
import { Prisma } from "prisma/prisma-client";
import { prisma } from "../../../../libs/db";

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   console.log(params.id);
//   try {
//     const house = await prisma.property.findFirst({
//       where: {
//         id: Number(params.id),
//       },
//     });

//     if (!house) {
//       return NextResponse.json(
//         {
//           message: "House not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }

//     return NextResponse.json(house);
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json(
//         {
//           message: error.message,
//         },
//         {
//           status: 500,
//         }
//       );
//     }
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const deletedHouse = await prisma.property.delete({
//       where: {
//         id: Number(params.id),
//       },
//     });

//     if (!deletedHouse) {
//       return NextResponse.json(
//         {
//           message: "House not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }
//     return NextResponse.json(deletedHouse);
//   } catch (error) {
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       if (error.code === "P2025") {
//         return NextResponse.json(
//           {
//             message: "House not found",
//           },
//           {
//             status: 404,
//           }
//         );
//       }
//       return NextResponse.json(
//         {
//           message: error.message,
//         },
//         {
//           status: 500,
//         }
//       );
//     }
//   }
// }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, price,location, propertyType, bedrooms, bathrooms, area, availability } = await request.json();
    const updatedhouse = await prisma.property.update({
      where: {
        id: Number(params.id),
      },
      data: {
        availability
      },
    });

    return NextResponse.json(updatedhouse);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}