import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { adminLogin, resetPasswordRequest } from "../../services/auth";
import toast from "react-hot-toast";  // npm i react-hot-toast

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  
  // Tabs: login / reset
  const [tab, setTab] = useState("login");
  
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  
  // Reset states
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Login submit
  async function onLogin(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await adminLogin(email.trim(), password);
      const redirectTo = loc.state?.from?.pathname || "/admin";
      nav(redirectTo, { replace: true });
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      const msg = error?.response?.data?.detail || 
                  error?.response?.data?.message || 
                  "Falha no login. Verifique e-mail e senha.";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  // Reset request
  async function onResetRequest(e) {
    e.preventDefault();
    setResetLoading(true);

    try {
      const message = await resetPasswordRequest(resetEmail.trim());
      setResetSent(true);
      toast.success(message);
      setResetEmail("");
    } catch (error) {
      toast.error("Erro ao enviar email. Tente novamente.");
    } finally {
      setResetLoading(false);
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
              {tab === "login" 
                ? "Entre com seu e-mail e senha para acessar o painel." 
                : "Digite seu email para receber o link de recuperação."
              }
            </p>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.card}>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${tab === "login" ? styles.active : ""}`}
                onClick={() => setTab("login")}
              >
                Entrar
              </button>
              <button 
                className={`${styles.tab} ${tab === "reset" ? styles.active : ""}`}
                onClick={() => setTab("reset")}
              >
                Recuperar Senha
              </button>
            </div>

            {/* Login Form */}
            {tab === "login" && (
              <form className={styles.form} onSubmit={onLogin}>
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
            )}

            {/* Reset Form */}
            {tab === "reset" && (
              <form className={styles.form} onSubmit={onResetRequest}>
                <label className={styles.label}>
                  E-mail
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
                     Email enviado! Verifique sua caixa de entrada (válido 15min).
                    <br/>
                    <small>Não recebeu? <button 
                      type="button" 
                      onClick={() => setResetSent(false)}
                      className={styles.linkBtn}
                    >Tentar novamente</button></small>
                  </div>
                ) : (
                  <div className={styles.actions}>
                    <button className="btn-primary" type="submit" disabled={resetLoading}>
                      {resetLoading ? "Enviando..." : "Enviar Link"}
                    </button>
                    <button
                      className="btn-ghost"
                      type="button"
                      onClick={() => setTab("login")}
                      disabled={resetLoading}
                    >
                      Voltar ao Login
                    </button>
                  </div>
                )}

                <small className={styles.hint}>
                  Receberá um link seguro por email.
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
