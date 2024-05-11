"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res && res.error) {
      setError(res.error);
    } else {
      router.push("/");
      router.refresh();
    }
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 lg:flex-row lg:m-0 lg:gap-36 lg:justify-center">
      <div className="hidden lg:block">
        <Image
          src="/ajolotes.png"
          width={550}
          height={550}
          alt="Double point"
        />
      </div>
      <div className="bg-white shadow-md rounded-lg max-w-md w-full mx-auto p-8 lg:m-0">
        <div className="flex justify-center mb-8">
          <Image
            src="/logoAjolotarios.jpeg"
            width={200}
            height={200}
            alt="Project logo"
            className="rounded-lg"
          />
        </div>

        <form onSubmit={onSubmit}>
          {error && (
            <p className="bg-red-500 text-lg text-white p-3 rounded mb-2">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              {...register("email", {
                required: {
                  value: true,
                  message: "username is required",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Crea una contraseña"
              {...register("password", {
                required: {
                  value: true,
                  message: "password is required",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
