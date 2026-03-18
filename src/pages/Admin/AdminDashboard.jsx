import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./AdminDashboard.module.css";

import { adminMe, clearToken, getToken } from "../../services/auth";
import { getAdminStatsOverview } from "../../services/stats";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState("light");
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
    let alive = true;

    async function loadAll() {
      try {
        const token = getToken();

        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const [me, overview] = await Promise.all([
          adminMe(),
          getAdminStatsOverview(),
        ]);

        if (!alive) return;

        setAdmin(me);
        setStats(overview);
      } catch (err) {
        console.error(err);

        if (!alive) return;

        const msg =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Não foi possível carregar o painel.";

        setError(msg);

        if (err?.response?.status === 401) {
          clearToken();
          navigate("/login", { replace: true });
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadAll();

    return () => {
      alive = false;
    };
  }, [navigate]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleLogout() {
    clearToken();
    navigate("/", { replace: true });
  }

  function goToAds() {
    setMenuOpen(false);
    navigate("/admin/ads");
  }

  function goHome() {
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  function logoutAndClose() {
    setMenuOpen(false);
    handleLogout();
  }

  const cards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Total de Respostas",
        value: stats.total_responses,
        sub: "todas as respostas registradas",
      },
      {
        title: "Respostas Favoráveis",
        value: stats.yes_responses,
        sub: `${stats.yes_percent ?? 0}%`,
      },
      {
        title: "Respostas Contrárias",
        value: stats.no_responses,
        sub: `${stats.no_percent ?? 0}%`,
      },
    ];
  }, [stats]);

  const forms = stats?.forms;

  function getQuestionText(q) {
    const txt = q?.question_text?.trim();
    return txt ? txt : "(sem título)";
  }

  if (loading) {
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

          <div className={styles.stateBox}>
            <h2 className={styles.stateTitle}>Carregando painel...</h2>
            <p className={styles.stateText}>Aguarde só um instante.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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

          <div className={styles.stateBox}>
            <h2 className={styles.stateTitle}>Erro</h2>
            <p className={styles.stateText}>{error}</p>

            <div className={styles.stateActions}>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => navigate("/", { replace: true })}
              >
                Voltar
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </button>
            </div>
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
            <h1 className={styles.title}>Painel Administrativo</h1>

            <p className={styles.subtitle}>
              {admin ? (
                <>
                  Logado como: <strong>{admin.email}</strong> ({admin.role})
                </>
              ) : (
                "Área restrita para acompanhar estatísticas agregadas."
              )}
            </p>
          </div>

          <div className={styles.navArea}>
            {/* Desktop */}
            <div className={styles.actionsDesktop}>
              <button
                type="button"
                className="btn-primary"
                onClick={goToAds}
              >
                Gerenciar Propagandas
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={goHome}
              >
                Home
              </button>

              <button
                type="button"
                className={styles.btnDanger}
                onClick={logoutAndClose}
              >
                Sair
              </button>
            </div>

            {/* Mobile */}
            <div className={styles.actionsMobile}>
              <button
                type="button"
                className={styles.menuButton}
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuOpen}
                aria-controls="admin-mobile-menu"
              >
                <span className={styles.menuIcon}></span>
                <span className={styles.menuIcon}></span>
                <span className={styles.menuIcon}></span>
              </button>

              {menuOpen && (
                <div id="admin-mobile-menu" className={styles.mobileMenu}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={goToAds}
                  >
                    Gerenciar Propagandas
                  </button>

                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={goHome}
                  >
                    Home
                  </button>

                  <button
                    type="button"
                    className={styles.btnDanger}
                    onClick={logoutAndClose}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <h2>Estatísticas</h2>

          <div className={styles.grid}>
            {cards.map((card) => (
              <div key={card.title} className={styles.card}>
                <strong className={styles.cardTitle}>{card.title}</strong>
                <div className={styles.cardValue}>{card.value ?? "--"}</div>
                <div className={styles.cardSub}>{card.sub}</div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Formulários</h2>

          <div className={styles.grid}>
            <div className={styles.card}>
              <strong className={styles.cardTitle}>Total de Formulários</strong>
              <div className={styles.cardValue}>{forms?.total_forms ?? "--"}</div>
              <div className={styles.cardSub}>
                Base: respondentes únicos (user_id)
              </div>
            </div>

            <div className={styles.card}>
              <strong className={styles.cardTitle}>Completos</strong>
              <div className={styles.cardValue}>{forms?.complete_forms ?? "--"}</div>
              <div className={styles.cardSub}>{forms?.complete_percent ?? 0}%</div>
            </div>

            <div className={styles.card}>
              <strong className={styles.cardTitle}>Incompletos</strong>
              <div className={styles.cardValue}>{forms?.incomplete_forms ?? "--"}</div>
              <div className={styles.cardSub}>{forms?.incomplete_percent ?? 0}%</div>
            </div>
          </div>

          {forms ? (
            <p className={styles.note}>
              Considerado completo quando o respondente respondeu{" "}
              <strong>{forms.questions_total}</strong> perguntas.
            </p>
          ) : null}
        </section>

        <section className={styles.section}>
          <h2>Por Pergunta</h2>

          <div className={styles.questionGrid}>
            {(stats?.by_question ?? []).map((q) => (
              <div key={q.question_id} className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <span className={styles.questionId}>{q.question_id}º</span>
                  <div className={styles.questionTitle}>{getQuestionText(q)}</div>
                </div>

                <div className={styles.questionStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Total</span>
                    <span className={styles.statValue}>{q.total_responses}</span>
                  </div>

                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Favoráveis</span>
                    <span className={styles.statValue}>
                      {q.yes_responses}{" "}
                      <span className={styles.statPercent}>({q.yes_percent}%)</span>
                    </span>
                  </div>

                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Contrárias</span>
                    <span className={styles.statValue}>
                      {q.no_responses}{" "}
                      <span className={styles.statPercent}>({q.no_percent}%)</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {!stats?.by_question?.length ? (
              <div className={styles.emptyCard}>
                Nenhum dado por pergunta encontrado.
              </div>
            ) : null}
          </div>

          <small className={styles.note}>
            Ordenado por <strong>order_index</strong>.
          </small>
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