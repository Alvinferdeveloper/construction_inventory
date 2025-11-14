"use client"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, HardHat, Lock } from "lucide-react"
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
                 setLoading(false)
                return
            }
            setError('Error al iniciar sesión')
        }
        setLoading(false)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-slate-800 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[50px_50px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black_40%,transparent_100%)]"></div>
            <div className="absolute left-8 top-8 w-16 h-16 border-l-2 border-t-2 border-orange-400/30"></div>
            <div className="absolute right-8 bottom-8 w-16 h-16 border-r-2 border-b-2 border-orange-400/30"></div>

            <Card className="w-full max-w-md shadow-2xl border border-slate-600/30 bg-slate-900/70 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute -left-2 top-4 bg-orange-500 text-white text-xs px-3 py-1 font-mono rounded-r">
                    DET. 01 / ACCESO
                </div>
                <div className="p-8 pt-12">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4 border border-orange-400/30">
                            <HardHat className="w-8 h-8 text-orange-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 font-mono tracking-tight">
                            ACCESO ALMACÉN
                        </h1>
                        <p className="text-slate-400 text-sm font-mono">
                            [SISTEMA DE GESTIÓN DE INVENTARIO]
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2 font-mono">
                                USUARIO:
                            </label>
                            <div className="relative">
                                <HardHat className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="empleado@constructora.com"
                                    className="w-full pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 font-mono text-sm focus:ring-orange-500 focus:border-orange-500"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2 font-mono">
                                CONTRASEÑA:
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 font-mono text-sm focus:ring-orange-500 focus:border-orange-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-700/50 rounded-lg animate-in fade-in">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-200 font-medium font-mono">{error}</p>
                            </div>
                        )}

                        <div className="pt-2">
                            <SubmitButton loading={loading} />
                        </div>
                    </form>
                    <p className="text-center text-xs text-slate-500 mt-8 font-mono border-t border-slate-700/50 pt-4">
                        ¿PROBLEMAS DE ACCESO?{" "}
                        <a href="#" className="text-orange-400 font-semibold hover:text-orange-300 underline">
                            RECUPERAR CREDENCIALES
                        </a>
                    </p>
                </div>
            </Card>
        </div>
    )
}