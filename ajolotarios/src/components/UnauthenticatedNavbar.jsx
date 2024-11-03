// components/UnauthenticatedNavbar.jsx
import Link from "next/link";
import Image from "next/image";

const UnauthenticatedNavbar = () => {
  return (
    <nav className="flex justify-between items-center text-black px-24 py-3">
      <Link href={"/"} className="flex justify-center items-center">
        <Image
          src="/logoAjolotarios.jpeg"
          width={50}
          height={50}
          alt="Company's logo"
          className="rounded-lg"
        />
        <p className="text-xl font-semibold align-middle ml-2">
          AjoloApp
        </p>
      </Link>

      <ul className="flex gap-x-6">
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
      </ul>
    </nav>
  );
};

export default UnauthenticatedNavbar;
