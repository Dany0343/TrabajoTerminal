import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        username: true,
        email: true,
        registrationDate: true,
        role: true,
        
        // Incluir otras relaciones si es necesario
      },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los datos del usuario' });
  }
}
