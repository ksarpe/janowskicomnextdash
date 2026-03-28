import { z } from "zod";

export type Service = {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  duration: number;
  price: string;
  iconName: string;
  isActive: boolean;
};

export const serviceSchema = z.object({
  name: z.string().min(1, "Nazwa usługi jest wymagana").max(100, "Nazwa jest za długa, maksymalnie 100 znaków."),
  description: z.string().max(800, "Opis jest za długi, maksymalnie 800 znaków.").optional(),
  duration: z.number().min(5, "Czas musi wynosić co najmniej 5 minut").max(720, "Czas nie może przekroczyć 12 godzin"),
  price: z.string().optional(),
  iconName: z.string().optional(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
