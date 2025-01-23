import { signIn, signOut } from "@/auth";

interface authParams {
  redirect: boolean;
  username: string;
  password: string;
}

export async function authenticateAction({
  redirect,
  username,
  password,
}: authParams) {
  try {
    const result = await signIn("credentials", {
      redirect,
      username,
      password,
    });

    return result;
  } catch (error) {
    console.log("Sign in Error: ", error);
  }
}

export async function logOutAction() {
  await signOut({ redirectTo: "/" });
}
