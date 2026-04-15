import { useState } from "react";

export function useLoginForm(
  onLogin: (email: string, password: string) => Promise<void>,
  onSuccess: () => void,
  onClose: () => void,
) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onLogin(email, password);
      reset();
      onClose();
      onSuccess();
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setEmail("");
    setPassword("");
    setError(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    setError,
    handleSubmit,
    reset,
  };
}
