import {z} from 'zod';
const amount=z.number().finite().nonnegative().max(1e9);
const date=z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(s=>{const d=new Date(`${s}T00:00:00Z`);return Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===s;},'Data inválida.');
export const accountsSchema=z.object({income:amount,rent:amount,bills:amount,transport:amount,groceries:amount,restaurants:amount,subscriptions:amount,shopping:amount,leisure:amount,other:amount,irregular:amount});
export const entrySchema=z.object({id:z.string().max(100),name:z.string().max(100),amount,kind:z.enum(['income','essential','choice'])});
export const settingsSchema=z.object({recurring:z.array(z.object({id:z.string().max(100),name:z.string().min(1).max(80),amount,kind:z.enum(['income','essential','choice']),frequency:z.enum(['monthly','weekly','yearly']),start:date,end:z.union([date,z.literal('')]),enabled:z.boolean()}).refine(x=>!x.end||x.end>=x.start,'A data final deve ser posterior ao início.')).max(100),goals:z.array(z.object({id:z.string().max(100),name:z.string().min(1).max(80),target:amount,saved:amount,deadline:date})).max(30)});
export const snapshotSchema=z.object({month:z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),accounts:accountsSchema,entries:z.array(entrySchema).max(200)});
export const adviceSchema=z.object({consent:z.literal(true),period:z.string().max(80),accounts:accountsSchema,entries:z.array(entrySchema).max(200),goals:settingsSchema.shape.goals});
