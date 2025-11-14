"use client";

import { useState } from "react";
import { cn } from "@/common/utils/utils";
import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/common/components/ui/field";
import { Input } from "@/common/components/ui/input";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // Lógica de inicio de sesión
  };

  return (
    <div className="bg-gradient-to-r from-orange-400 to-orange-500">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[209px] h-[30px] bg-black rounded-b-[20px] z-10"></div>

      <div className="absolute bottom-0 left-0 w-full h-[55%] flex flex-col items-center justify-center p-10 z-20">
        <Card className="w-full border-none rounded-full shadow-none" >
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bienvenido</CardTitle>
            <CardDescription>Ingresa con su cuenta de google</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <Field>
                  <Button variant={"outline"} type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>{" "}
                    Google
                  </Button>
                </Field>
                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  continuar con
                </FieldSeparator>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                    <div className="flex items-center">
                        <FieldLabel htmlFor="password">
                            Contraseña
                        </FieldLabel>
                        <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                            Olvidaste tu contraseña?
                        </a>
                    </div>
                    <Input id="password" type="password" required />
                </Field>
                <Field>
                    <Button type="submit">Entrar</Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[60%] bg-white rounded-t-[50%]"></div>
    </div>
  );
};

export default Login;
