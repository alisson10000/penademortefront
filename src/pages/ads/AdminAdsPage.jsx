import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./AdminAdsPage.module.css";

import { getToken, clearToken } from "../../services/auth";
import { adService } from "../../services/adService";
import { questionService } from "../../services/questionService";
import AdForm from "../../components/AdForm";
import AdsList from "../../components/AdsList";

export default function AdminAdsPage() {
  const navigate = useNavigate();

  const [theme, setTheme] = useState("light");

  const [ads, setAds] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAd, setEditingAd] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

        const [adsData, questionsData] = await Promise.all([
          adService.getActiveAds(),
          questionService.getAllQuestions(),
        ]);

        if (!alive) return;

        setAds(adsData);
        setQuestions(questionsData);
      } catch (err) {
        console.error(err);

        if (!alive) return;

        const msg =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Erro ao carregar dados.";

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

  async function handleCreateAd(adData) {
    try {
      const newAd = await adService.createAd(adData);
      setAds((prev) => [...prev, newAd]);
      setShowForm(false);
      setError("");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Erro ao criar propaganda.";

      setError(msg);
      console.error(err);
    }
  }

  async function handleUpdateAd(adId, adData) {
    try {
      const updated = await adService.updateAd(adId, adData);
      setAds((prev) => prev.map((ad) => (ad.id === adId ? updated : ad)));
      setEditingAd(null);
      setError("");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Erro ao atualizar propaganda.";

      setError(msg);
      console.error(err);
    }
  }

  async function handleDeleteAd(adId) {
    if (!window.confirm("Tem certeza que deseja deletar esta propaganda?")) {
      return;
    }

    try {
      await adService.deleteAd(adId);
      setAds((prev) => prev.filter((ad) => ad.id !== adId));
      setError("");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Erro ao deletar propaganda.";

      setError(msg);
      console.error(err);
    }
  }

  function handleOpenCreate() {
    setShowForm(true);
    setEditingAd(null);
    setError("");
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingAd(null);
    setError("");
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
            <h2>Carregando...</h2>
            <p>Aguarde um instante.</p>
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

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <img className={styles.logo} src="/logo.png" alt="Pena de Morte" />
            <div>
              <h1 className={styles.title}>Gerenciar Propagandas</h1>
              <p className={styles.subtitle}>
                Crie, edite e organize propagandas vinculadas às perguntas.
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (showForm) {
                  handleCancelForm();
                } else {
                  handleOpenCreate();
                }
              }}
            >
              {showForm ? "Cancelar" : "Nova Propaganda"}
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate("/admin", { replace: true })}
            >
              Voltar
            </button>
          </div>
        </header>

        {error ? (
          <div className={styles.alert}>
            <strong>Erro:</strong> {error}
          </div>
        ) : null}

        {showForm && !editingAd ? (
          <section className={styles.section}>
            <h2>Nova Propaganda</h2>
            <div className={styles.panel}>
              <AdForm
                questions={questions}
                onSubmit={handleCreateAd}
                onCancel={handleCancelForm}
              />
            </div>
          </section>
        ) : null}

        {editingAd ? (
          <section className={styles.section}>
            <h2>Editar Propaganda #{editingAd.id}</h2>
            <div className={styles.panel}>
              <AdForm
                questions={questions}
                initialData={editingAd}
                onSubmit={(data) => handleUpdateAd(editingAd.id, data)}
                onCancel={handleCancelForm}
                isEditing
              />
            </div>
          </section>
        ) : null}

        <section className={styles.section}>
          <h2>Propagandas ({ads.length})</h2>

          {ads.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhuma propaganda cadastrada ainda.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleOpenCreate}
              >
                Criar primeira propaganda
              </button>
            </div>
          ) : (
            <div className={styles.listWrap}>
              <AdsList
                ads={ads}
                questions={questions}
                onEdit={(ad) => {
                  setEditingAd(ad);
                  setShowForm(false);
                  setError("");
                }}
                onDelete={handleDeleteAd}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}