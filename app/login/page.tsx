"use client"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import SubmitButton from "@/app/login/components/SubmitButton"
import { redirect } from "next/navigation"
import { authClient } from "@/app/lib/auth-client"
import { useState } from "react"

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const { data, error } = await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
        })
        if (data) {
            redirect('/')
        }
        if (error) {
            if (error.status === 401) {
                setError('Credenciales invalidas')
                return
            }
            setError('Error al iniciar sesión')
        }
        setLoading(false)
    }
    return (
        <div className="flex justify-center items-center h-screen bg-linear-to-br from-slate-50 to-slate-100">
            <Card className="w-full max-w-md shadow-lg border-0">
                <div className="p-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido</h1>
                        <p className="text-slate-500">Inicia sesión en tu cuenta</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Usuario o Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="usuario@ejemplo.com"
                                className="w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Contraseña
                            </label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <SubmitButton loading={loading} />
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        ¿Olvidaste tu contraseña?{" "}
                        <a href="#" className="text-slate-900 font-semibold hover:underline">
                            Recupérala aquí
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    )
}
