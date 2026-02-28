import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./login.module.css";

import { adminLogin } from "../../services/auth";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await adminLogin(email.trim(), password);

      const redirectTo = loc.state?.from?.pathname || "/admin";
      nav(redirectTo, { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Falha no login. Verifique e-mail e senha.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <header className={styles.hero}>
          <div className={styles.brand}>
            <img className={styles.logo} src="/logo.png" alt="Pena de Morte" />
            <h1 className={styles.title}>Área Admin</h1>
            <p className={styles.subtitle}>
              Entre com seu e-mail e senha para acessar o painel.
            </p>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.card}>
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.label}>
                E-mail
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
                Senha
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
                  onClick={() => nav("/", { replace: true })}
                  disabled={loading}
                >
                  Voltar
                </button>
              </div>

              <small className={styles.hint}>
                Apenas administradores autorizados.
              </small>
            </form>
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