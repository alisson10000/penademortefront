import { useEffect, useState } from "react";
import styles from "./HomePage.module.css";

export default function Home() {
  const [theme, setTheme] = useState("light");

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

  return (
    <div className={styles.page}>
      <div className="container">
        {/* TOPO / AÇÃO DE TEMA */}
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

        {/* HERO */}
        <header className={styles.hero}>
          <div className={styles.brand}>
            <img className={styles.logo} src="/logo.png" alt="Pena de Morte" />
            <h1 className={styles.title}>Pena de Morte</h1>
            <p className={styles.subtitle}>
              Pesquisa de opinião com transparência. Responda em poucos segundos e acompanhe
              estatísticas agregadas.
            </p>
          </div>

          <div className={styles.actions}>
            <a href="#download">
              <button type="button" className="btn-primary">
                Baixar app (Android)
              </button>
            </a>

            <a href="/login">
              <button type="button" className="btn-ghost">
                Área Admin
              </button>
            </a>
          </div>
        </header>

        {/* COMO FUNCIONA */}
        <section className={styles.section}>
          <h2>Como funciona</h2>
          <div className={styles.grid}>
            <div className={styles.stepCard}>
              <strong className={styles.stepTitle}>1) Baixe o app</strong>
              <p>Instale no Android e comece em segundos.</p>
            </div>

            <div className={styles.stepCard}>
              <strong className={styles.stepTitle}>2) Responda rápido</strong>
              <p>Perguntas objetivas, resposta em 1 minuto.</p>
            </div>

            <div className={styles.stepCard}>
              <strong className={styles.stepTitle}>3) Veja estatísticas</strong>
              <p>Resultados exibidos de forma agregada e transparente.</p>
            </div>
          </div>
        </section>

        {/* DOWNLOAD */}
        <section id="download" className={styles.section}>
          <div className={styles.downloadBox}>
            <h2>Download</h2>
            <p>Escolha sua plataforma:</p>

            <div className={styles.downloadActions}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => window.open("#", "_blank")}
              >
                Android (APK/Play)
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => window.open("#", "_blank")}
              >
                iOS (em breve)
              </button>
            </div>

            <small>Seu progresso fica salvo automaticamente no app.</small>
          </div>
        </section>

        {/* TRANSPARÊNCIA */}
        <section className={styles.section}>
          <h2>Transparência e privacidade</h2>
          <ul className={styles.list}>
            <li>Resultados exibidos de forma agregada.</li>
            <li>Sem exposição de informações pessoais no painel público.</li>
            <li>Política de privacidade e termos disponíveis.</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className={`${styles.section} ${styles.faq}`}>
          <h2>FAQ</h2>

          <details>
            <summary>Precisa de cadastro?</summary>
            <p>Depende da configuração. Dá pra responder sem cadastro.</p>
          </details>

          <details>
            <summary>As respostas são anônimas?</summary>
            <p>O painel mostra dados agregados, sem identificar pessoas.</p>
          </details>

          <details>
            <summary>Onde vejo as estatísticas?</summary>
            <p>Na Área Admin, com filtros por período e por pergunta.</p>
          </details>
        </section>

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