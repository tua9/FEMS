import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

const signInSchema = z.object({
  role: z.enum(["student", "lecturer", "admin", "technician"]),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      role: "student",
    },
  });

  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: SignInFormValues) => {
    console.log(data);

    const { username, password, role } = data;
    //goi api
    await signIn(username, password, role);

    // chuyen huong sau khi dang nhap thanh cong
    navigate("/");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="mb-auto flex justify-center text-xl">
            <div className="bg-primary/10 border-primary/20 flex h-16 w-16 items-center justify-center rounded-full border shadow-sm">
              <span className="material-symbols-outlined text-primary text-3xl">
                fingerprint
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="role">Select Role</FieldLabel>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <NativeSelect {...field} required>
                      <NativeSelectOption value="student">
                        Student
                      </NativeSelectOption>
                      <NativeSelectOption value="lecturer">
                        Lecturer
                      </NativeSelectOption>
                      <NativeSelectOption value="admin">
                        Admin
                      </NativeSelectOption>
                      <NativeSelectOption value="technician">
                        Technician
                      </NativeSelectOption>
                    </NativeSelect>
                  )}
                />
                {/* {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role.message}
                  </p>
                )} */}
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username or email"
                  {...register("username")}
                  required
                />
                {/* {errors.username && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )} */}
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="text-muted-foreground text-sm hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="password"
                  placeholder="Enter your password"
                  {...register("password")}
                  required
                />
                {/* {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )} */}
              </Field>
              <Field>
                <Button
                  variant="outline"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting
                    ? "Đang đăng nhập..."
                    : "Login with FPT Account"}
                  {!isSubmitting && (
                    <span className="material-symbols-outlined ml-2 text-lg">
                      arrow_forward
                    </span>
                  )}
                </Button>

                <FieldSeparator className="my-4">
                  OR CONTINUE WITH
                </FieldSeparator>

                <Button
                  variant="outline"
                  type="button"
                  className="w-full gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
