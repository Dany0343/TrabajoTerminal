export { default } from "next-auth/middleware";

// Se protejen todas las rutas despues de /
export const config = {matcher: ["/"]}