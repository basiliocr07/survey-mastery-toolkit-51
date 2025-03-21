
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function ClientLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
  });
  const [registerFormData, setRegisterFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Verificar si es administrador (case insensitive)
    if (loginFormData.username.toLowerCase() === 'admin' && loginFormData.password === 'adminpass') {
      console.log('Admin login successful');
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('username', loginFormData.username);
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido administrador",
      });
      
      setIsLoading(false);
      navigate('/dashboard');
      return;
    }
    
    // Verificar si es cliente (case insensitive)
    if (loginFormData.username.toLowerCase() === 'client' && loginFormData.password === 'clientpass') {
      console.log('Client login successful');
      localStorage.setItem('userRole', 'client');
      localStorage.setItem('username', loginFormData.username);
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido cliente",
      });
      
      setIsLoading(false);
      navigate('/');
      return;
    }
    
    // En caso de credenciales incorrectas o para usuarios normales
    if (loginFormData.username && loginFormData.password) {
      console.log('Attempting normal login');
      // Normalmente aquí iría una llamada a la API para verificar las credenciales
      localStorage.setItem('userRole', 'client');
      localStorage.setItem('username', loginFormData.username);
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema de encuestas",
      });
      
      setIsLoading(false);
      navigate('/');
    } else {
      toast({
        title: "Error de inicio de sesión",
        description: "Por favor, complete todos los campos",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (registerFormData.password !== registerFormData.confirmPassword) {
      toast({
        title: "Error de registro",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (registerFormData.username && registerFormData.email && registerFormData.password) {
      localStorage.setItem('userRole', 'client');
      localStorage.setItem('username', registerFormData.username);
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "Registro exitoso",
        description: "Su cuenta ha sido creada correctamente",
      });
      
      setIsLoading(false);
      navigate('/');
    } else {
      toast({
        title: "Error de registro",
        description: "Por favor, complete todos los campos",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit}>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>
                  Ingresa tus credenciales para acceder al sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Usuario</Label>
                  <Input 
                    id="username" 
                    placeholder="Nombre de usuario" 
                    value={loginFormData.username}
                    onChange={(e) => setLoginFormData({...loginFormData, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Contraseña"
                    value={loginFormData.password}
                    onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})}
                  />
                </div>
                <div className="text-sm text-muted-foreground p-3 bg-gray-100 rounded-md border border-gray-200">
                  <p className="font-medium mb-1">Credenciales de prueba:</p>
                  <p><span className="font-semibold">Admin:</span> admin / adminpass</p>
                  <p><span className="font-semibold">Cliente:</span> client / clientpass</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Iniciar Sesión"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit}>
              <CardHeader>
                <CardTitle>Crear Cuenta</CardTitle>
                <CardDescription>
                  Completa el formulario para registrarte en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Usuario</Label>
                  <Input 
                    id="reg-username" 
                    placeholder="Nombre de usuario"
                    value={registerFormData.username}
                    onChange={(e) => setRegisterFormData({...registerFormData, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="correo@ejemplo.com"
                    value={registerFormData.email}
                    onChange={(e) => setRegisterFormData({...registerFormData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contraseña</Label>
                  <Input 
                    id="reg-password" 
                    type="password" 
                    placeholder="Contraseña"
                    value={registerFormData.password}
                    onChange={(e) => setRegisterFormData({...registerFormData, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirmar contraseña"
                    value={registerFormData.confirmPassword}
                    onChange={(e) => setRegisterFormData({...registerFormData, confirmPassword: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Registrarse"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
