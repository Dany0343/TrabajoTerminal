import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";

async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="flex justify-between items-center text-black px-24 py-3">
      <Link href={"/"} className="flex justify-center items-center">
        <Image
          src="/logoAjolotarios.jpeg"
          width={50}
          height={50}
          alt="Companys logo"
          className="rounded-lg"
        />
        <p className="text-xl font-semibold align-middle ml-2">
          Ajolotarios Web App
        </p>
      </Link>

      <ul className="flex gap-x-6">
        {!session?.user ? (
          <>
            <li>
              <Link className="font-semibold" href={"/"}>
                Home
              </Link>
            </li>
            <li>
              <Link className="font-semibold" href={"/auth/login"}>
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link className="font-semibold" href={"/auth/register"}>
                Registrarse
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link className="font-semibold" href={"/"}>
                Home Page
              </Link>
            </li>
            <li>
              <Link className="font-semibold" href={"/api/auth/signout"}>
                Cerrar sesión
              </Link>
            </li>
            {/* <li>
              <Link className="font-semibold" href="../profile">
                Mi perfil
              </Link>
            </li> */}
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
