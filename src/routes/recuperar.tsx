import {createFileRoute} from '@tanstack/react-router';
import {useState} from 'react';
import {supabase} from '@/integrations/supabase/client';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {moduleHead} from '@/lib/finance';
export const Route=createFileRoute('/recuperar')({head:()=>moduleHead('Recuperar acesso','Define uma nova palavra-passe para a tua conta privada.'),component:Recovery});
function Recovery(){const [password,setPassword]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);return <section className="max-w-md"><h1 className="text-3xl mb-6">Recuperar acesso</h1><form className="space-y-4" onSubmit={async e=>{e.preventDefault();setBusy(true);const {error}=await supabase.auth.updateUser({password});setMessage(error?error.message:'Palavra-passe atualizada. Podes voltar ao Diagnóstico.');setBusy(false);}}><label htmlFor="new-password">Nova palavra-passe</label><Input id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/><Button disabled={busy}>Guardar palavra-passe</Button>{message&&<p role="status">{message}</p>}</form></section>;}
