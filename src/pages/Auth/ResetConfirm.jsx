import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import styles from "./ResetConfirm.module.css";
import { resetPasswordConfirm } from "../../services/auth";

export default function ResetConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [theme, setTheme] = useState("light");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = prefersDark ? "dark" : "light";

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  }

  useEffect(() => {
    if (!token) {
      setError("Link inválido. Solicite uma nova recuperação de senha.");
    }
  }, [token]);

  async function onSubmit(e) {
    e.preventDefault();

    if (!token) {
      setError("Link inválido. Solicite uma nova recuperação de senha.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPasswordConfirm(token, password);
      setSuccess(true);
      toast.success("Senha alterada com sucesso!");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2000);
    } catch (err) {
      setError("Link expirado ou inválido. Solicite uma nova recuperação.");
      toast.error("Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.topBar}>
            <button
              type="button"
              className="btn-ghost"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {theme === "dark" ? "☀️ Modo claro" : "🌙 Modo escuro"}
            </button>
          </div>

          <div className={styles.successScreen}>
            <img className={styles.logo} src="/logo.png" alt="Pena de Morte" />
            <h1 className={styles.title}>Senha alterada!</h1>
            <p className={styles.subtitle}>Redirecionando para o login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.topBar}>
          <button
            type="button"
            className="btn-ghost"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          >
            {theme === "dark" ? "☀️ Modo claro" : "🌙 Modo escuro"}
          </button>
        </div>

        <header className={styles.hero}>
          <div className={styles.brand}>
            <img className={styles.logo} src="/logo.png" alt="Pena de Morte" />
            <h1 className={styles.title}>Nova Senha</h1>
            <p className={styles.subtitle}>
              Digite sua nova senha com no mínimo 6 caracteres.
            </p>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.card}>
            {error ? <div className={styles.errorBox}>{error}</div> : null}

            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.label}>
                <span>Nova Senha</span>
                <input
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>

              <label className={styles.label}>
                <span>Confirmar Senha</span>
                <input
                  className={styles.input}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
              </label>

              <div className={styles.actions}>
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={loading || password !== confirmPassword || !token}
                >
                  {loading ? "Alterando..." : "Alterar Senha"}
                </button>

                <button
                  className="btn-ghost"
                  type="button"
                  onClick={() => navigate("/login", { replace: true })}
                  disabled={loading}
                >
                  Voltar ao Login
                </button>
              </div>

              <small className={styles.hint}>
                Sua senha deve ter pelo menos 6 caracteres.
              </small>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}