import { z } from "zod"


export const EventFormSchema = z.object({
   title: z.string().min(4,'Title must be atleast 4 characters!'),
   description: z.string().min(4,'Description must be atleast 4 characters!').max(400,'Descrption must be less than 400 characters'),
    location: z.string().min(5,'Location must be atleast 5 characters!').max(400,'Location must be less than 400 characters'),
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url()
  })
