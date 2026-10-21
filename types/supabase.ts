export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export interface Profile { id: string; full_name: string; phone: string | null; avatar_path: string | null; created_at: string; updated_at: string; }
export interface Merchant { id: string; owner_id: string; business_name: string; approval_status: 'pending'|'approved'|'rejected'|'suspended'; created_at: string; updated_at: string; }
export interface Store { id: string; merchant_id: string; slug: string; name: string; category: string; description: string; is_open: boolean; is_approved: boolean; created_at: string; updated_at: string; }
export interface Product { id: string; store_id: string; category_id: string | null; name: string; description: string; price_kobo: number; image_path: string | null; is_available: boolean; is_approved: boolean; created_at: string; updated_at: string; }
export interface OrderGroup { id: string; customer_id: string; status: string; idempotency_key: string; delivery_address: Json; payable_kobo: number; currency: string; created_at: string; updated_at: string; }
export interface Order { id: string; order_group_id: string; merchant_id: string; store_id: string; status: string; subtotal_kobo: number; merchant_allocation_kobo: number; created_at: string; updated_at: string; }
export interface Payment { id: string; order_group_id: string; provider: string; reference: string; access_code: string | null; amount_kobo: number; currency: string; status: string; idempotency_key: string; verified_at: string | null; created_at: string; updated_at: string; }
