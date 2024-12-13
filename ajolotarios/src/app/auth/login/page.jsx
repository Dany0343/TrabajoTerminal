"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Image from "next/image";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    // Carga completa del engine de partículas
    await loadFull(engine);
  }, []);

  const particlesConfig = {
    fullScreen: { enable: false }, // Deshabilitamos fullScreen para posicionar dentro del contenedor
    background: {
      color: { value: "#f3f4f6" }, // Color del fondo (gris claro)
    },
    particles: {
      number: {
        value: 50,
        density: { enable: true, value_area: 800 },
      },
      color: { value: "#0ea5e9" },
      shape: { type: "circle" },
      opacity: { value: 0.5 },
      size: { value: 2 },
      move: {
        enable: true,
        speed: 1.5,
        random: true,
        out_mode: "out",
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
    },
    retina_detect: true,
  };

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setLoading(false);

    if (res && res.error) {
      setError(res.error);
    } else {
      router.push("/");
      router.refresh();
    }
  });

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 lg:flex-row lg:m-0 lg:gap-36 lg:justify-center bg-gray-100">
      {/* Partículas de fondo */}
      <div className="absolute inset-0 -z-10">
        <Particles init={particlesInit} options={particlesConfig} />
      </div>

      {/* Imagen lateral visible sólo en pantallas grandes */}
      <div className="hidden lg:block">
        <Image
          src="/ajolotes.png"
          width={550}
          height={550}
          alt="Imagen ajolotes"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg max-w-md w-full mx-auto p-8 lg:m-0">
        <div className="flex justify-center mb-8">
          <Image
            src="/logoAjolotarios.jpeg"
            width={200}
            height={200}
            alt="Logo Proyecto"
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500" : ""
              }`}
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              {...register("email", {
                required: {
                  value: true,
                  message: "El correo es requerido.",
                },
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Introduce un correo válido.",
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
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : ""
              }`}
              id="password"
              type="password"
              placeholder="Tu contraseña"
              {...register("password", {
                required: {
                  value: true,
                  message: "La contraseña es requerida.",
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
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
