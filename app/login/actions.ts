"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginUser(formData: FormData) {
  try {
    // W Auth.js v5 dane logowania i redirectTo muszą być w TYM SAMYM obiekcie
    const data = Object.fromEntries(formData);
    
    await signIn("credentials", {
      ...data,
      redirectTo: "/", 
    });
    
  } catch (error) {
    // Jeśli to błąd rzucony przez Auth.js (np. zły email/hasło)
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Nieprawidłowy adres email lub hasło." };
        default:
          return { error: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie." };
      }
    }
    
    // BARDZO WAŻNE: Kiedy logowanie się UDA, Next.js rzuca specjalny, 
    // ukryty błąd nawigacji (tzw. NEXT_REDIRECT). 
    // Ten throw podaje go dalej do Twojego formularza na froncie!
    throw error;
  }
}