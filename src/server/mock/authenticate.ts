import { getStore } from "./store";

export function authenticateUser(email: string, password: string) {
  const store = getStore();
  const user = store.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

