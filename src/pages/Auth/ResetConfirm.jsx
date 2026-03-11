import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./ResetConfirm.module.css";
import { resetPasswordConfirm } from "../../services/auth";
import toast from "react-hot-toast";

export default function ResetConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Token inválido?
  useEffect(() => {
    if (!token) {
      setError("Link inválido. Solicite novo reset.");
    }
  }, [token]);

  async function onSubmit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Senhas não coincidem");
      return;
    }
    
    if (password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await resetPasswordConfirm(token, password);
      setSuccess(true);
      toast.success("Senha alterada com sucesso!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Link expirado ou inválido. Solicite novo reset.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.successScreen}>
            <img className={styles.logo} src="/logo.png" alt="Pena de Morte" />
            <h1 className={styles.title}>Senha alterada!</h1>
            <p className={styles.subtitle}>
              Redirecionando para login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <div className={styles.brand}>
            <img className={styles.logo} src="/logo.png" alt="Pena de Morte" />
            <h1 className={styles.title}>Nova Senha</h1>
            <p className={styles.subtitle}>
              Digite sua nova senha (mínimo 6 caracteres).
            </p>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.card}>
            {error && <div className={styles.errorBox}>{error}</div>}
            
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.label}>
                Nova Senha
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
                Confirmar Senha
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
                  disabled={loading || password !== confirmPassword}
                >
                  {loading ? "Alterando..." : "Alterar Senha"}
                </button>
                <button
                  className="btn-ghost"
                  type="button"
                  onClick={() => navigate("/login")}
                  disabled={loading}
                >
                  Voltar ao Login
                </button>
              </div>

              <small className={styles.hint}>
                Senha deve ter pelo menos 6 caracteres.
              </small>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
