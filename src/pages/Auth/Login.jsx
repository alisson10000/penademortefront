import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import styles from "./LoginPage.module.css";
import { adminLogin, resetPasswordRequest } from "../../services/auth";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();

  const [theme, setTheme] = useState("light");

  const [tab, setTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

  async function onLogin(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await adminLogin(email.trim(), password);
      const redirectTo = loc.state?.from?.pathname || "/admin";
      toast.success("Login realizado com sucesso!");
      nav(redirectTo, { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Falha no login. Verifique e-mail e senha.";

      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onResetRequest(e) {
    e.preventDefault();
    setResetLoading(true);

    try {
      const message = await resetPasswordRequest(resetEmail.trim());
      setResetSent(true);
      toast.success(message || "Email de recuperação enviado.");
      setResetEmail("");
    } catch (error) {
      toast.error("Erro ao enviar email. Tente novamente.");
    } finally {
      setResetLoading(false);
    }
  }

  function goHome() {
    nav("/", { replace: true });
  }

  function backToLogin() {
    setTab("login");
    setResetSent(false);
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
            <h1 className={styles.title}>Área Admin</h1>
            <p className={styles.subtitle}>
              {tab === "login"
                ? "Entre com seu e-mail e senha para acessar o painel."
                : "Digite seu email para receber o link de recuperação."}
            </p>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.card}>
            <div className={styles.tabs} role="tablist" aria-label="Acesso administrativo">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "login"}
                className={`${styles.tab} ${tab === "login" ? styles.active : ""}`}
                onClick={() => {
                  setTab("login");
                  setErr("");
                }}
              >
                Entrar
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={tab === "reset"}
                className={`${styles.tab} ${tab === "reset" ? styles.active : ""}`}
                onClick={() => {
                  setTab("reset");
                  setErr("");
                }}
              >
                Recuperar Senha
              </button>
            </div>

            {tab === "login" && (
              <form className={styles.form} onSubmit={onLogin}>
                <label className={styles.label}>
                  <span>E-mail</span>
                  <input
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="seuemail@dominio.com"
                    required
                  />
                </label>

                <label className={styles.label}>
                  <span>Senha</span>
                  <input
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                </label>

                {err ? <div className={styles.errorBox}>{err}</div> : null}

                <div className={styles.actions}>
                  <button className="btn-primary" type="submit" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </button>

                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={goHome}
                    disabled={loading}
                  >
                    Voltar
                  </button>
                </div>

                <small className={styles.hint}>
                  Apenas administradores autorizados.
                </small>
              </form>
            )}

            {tab === "reset" && (
              <form className={styles.form} onSubmit={onResetRequest}>
                <label className={styles.label}>
                  <span>E-mail</span>
                  <input
                    className={styles.input}
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    placeholder="seuemail@dominio.com"
                    required
                  />
                </label>

                {resetSent ? (
                  <div className={styles.successBox}>
                    Email enviado! Verifique sua caixa de entrada.
                    <br />
                    <small>
                      O link é temporário.{" "}
                      <button
                        type="button"
                        onClick={() => setResetSent(false)}
                        className={styles.linkBtn}
                      >
                        Tentar novamente
                      </button>
                    </small>
                  </div>
                ) : (
                  <div className={styles.actions}>
                    <button className="btn-primary" type="submit" disabled={resetLoading}>
                      {resetLoading ? "Enviando..." : "Enviar Link"}
                    </button>

                    <button
                      className="btn-ghost"
                      type="button"
                      onClick={backToLogin}
                      disabled={resetLoading}
                    >
                      Voltar ao Login
                    </button>
                  </div>
                )}

                <small className={styles.hint}>
                  Você receberá um link seguro por email.
                </small>
              </form>
            )}
          </section>
        </main>

        <footer className={styles.footer}>
          © {new Date().getFullYear()} Pena de Morte •{" "}
          <a href="#" onClick={(e) => e.preventDefault()}>
            Política de Privacidade
          </a>
        </footer>
      </div>
    </div>
  );
}