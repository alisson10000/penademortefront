import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./AdminDashboard.module.css";

import { adminMe, clearToken, getToken } from "../../services/auth";
import { getAdminStatsOverview } from "../../services/stats";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadAll() {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
          return;
        }

        const [me, overview] = await Promise.all([adminMe(), getAdminStatsOverview()]);
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
          navigate("/login");
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

  function handleLogout() {
    clearToken();
    navigate("/", { replace: true });
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

  const getQuestionText = (q) => {
    const txt = q?.question_text?.trim();
    return txt ? txt : "(sem título)";
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
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
          <div className={styles.stateBox}>
            <h2 className={styles.stateTitle}>Erro</h2>
            <p className={styles.stateText}>{error}</p>

            <div className={styles.actions}>
              <button className="btn-ghost" onClick={() => navigate("/", { replace: true })}>
                Voltar
              </button>
              <button className="btn-primary" onClick={() => window.location.reload()}>
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
        {/* HERO (padrão do tema) */}
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

          <div className={styles.actions}>
            <button className="btn-ghost" onClick={() => navigate("/", { replace: true })}>
              Home
            </button>
            <button className={styles.btnDanger} onClick={handleLogout}>
              Sair
            </button>
          </div>
        </header>

        {/* CARDS */}
        <section className={styles.section}>
          <h2>Estatísticas</h2>
          <div className={styles.grid}>
            {cards.map((c) => (
              <div key={c.title} className={styles.card}>
                <strong className={styles.cardTitle}>{c.title}</strong>
                <div className={styles.cardValue}>{c.value ?? "--"}</div>
                <div className={styles.cardSub}>{c.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FORMULÁRIOS */}
        <section className={styles.section}>
          <h2>Formulários</h2>

          <div className={styles.grid}>
            <div className={styles.card}>
              <strong className={styles.cardTitle}>Total de Formulários</strong>
              <div className={styles.cardValue}>{forms?.total_forms ?? "--"}</div>
              <div className={styles.cardSub}>Base: respondentes únicos (user_id)</div>
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
              Considerado completo quando o respondente respondeu <strong>{forms.questions_total}</strong>{" "}
              perguntas.
            </p>
          ) : null}
        </section>

        {/* POR PERGUNTA (com coluna ID) */}
        <section className={styles.section}>
          <h2>Por Pergunta</h2>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.idHead}>ID</th>
                  <th>Pergunta</th>
                  <th>Total</th>
                  <th>Favoráveis</th>
                  <th>Contrárias</th>
                </tr>
              </thead>

              <tbody>
                {(stats?.by_question ?? []).map((q) => (
                  <tr key={q.question_id}>
                    <td className={styles.idCell}>{q.question_id}&ordm;</td>
                    <td className={styles.questionCell}>{getQuestionText(q)}</td>
                    <td>{q.total_responses}</td>
                    <td>
                      {q.yes_responses}{" "}
                      <span className={styles.muted}>({q.yes_percent}%)</span>
                    </td>
                    <td>
                      {q.no_responses}{" "}
                      <span className={styles.muted}>({q.no_percent}%)</span>
                    </td>
                  </tr>
                ))}

                {!stats?.by_question?.length ? (
                  <tr>
                    <td colSpan={5} className={styles.emptyRow}>
                      Nenhum dado por pergunta encontrado.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <small className={styles.note}>
            Se quiser, a gente ordena por <strong>order_index</strong> (do model `Question`).
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