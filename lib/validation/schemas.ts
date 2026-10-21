import { z } from 'zod';
export const checkoutItemSchema = z.object({ productId: z.string().uuid(), merchantId: z.string().uuid(), qty: z.number().int().min(1).max(99) });
export const checkoutSchema = z.object({ address: z.object({ label: z.string().min(1).max(50), line1: z.string().min(3), area: z.string().min(2), city: z.string().min(2), instructions: z.string().max(500).optional() }), items: z.array(checkoutItemSchema).min(1).max(100) });
export const paymentInitializeSchema = z.object({ orderGroupId: z.string().uuid() });
