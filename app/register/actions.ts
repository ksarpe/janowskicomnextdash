"use server";

import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Proszę wypełnić wszystkie pola." };
  }

  try {
    const existingUser = await prisma.client.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Konto z podanym adresem email już istnieje." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.client.create({
      data: {
        email: email,
        passwordHash: hashedPassword,
        companyName: "",
        isActive: true,
        widgetConfig: {
          create: {
            allowedDomains: ["http://localhost:3001"],
            extraSettings: {},
          },
        },
      },
    });
  } catch (err) {
    console.error(err);
    return { error: "Wystąpił błąd podczas rejestracji." };
  }

  // Po udanej rejestracji wyrzucamy na logowanie
  redirect("/login");
}
