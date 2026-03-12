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

  const [ads, setAds] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAd, setEditingAd] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadAll() {
      try {
        const token = getToken();
        if (!token) {
          navigate("/login");
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

  const handleCreateAd = async (adData) => {
    try {
      const newAd = await adService.createAd(adData);
      setAds([...ads, newAd]);
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
  };

  const handleUpdateAd = async (adId, adData) => {
    try {
      const updated = await adService.updateAd(adId, adData);
      setAds(ads.map((a) => (a.id === adId ? updated : a)));
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
  };

  const handleDeleteAd = async (adId) => {
    if (!window.confirm("Tem certeza que deseja deletar esta propaganda?")) {
      return;
    }

    try {
      await adService.deleteAd(adId);
      setAds(ads.filter((a) => a.id !== adId));
      setError("");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Erro ao deletar propaganda.";
      setError(msg);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
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
        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Gerenciar Propagandas</h1>
            <p className={styles.subtitle}>
              Crie e edite propagandas para as perguntas
            </p>
          </div>

          <div className={styles.actions}>
            <button
              className="btn-primary"
              onClick={() => {
                setShowForm(!showForm);
                setEditingAd(null);
                setError("");
              }}
            >
              {showForm ? " Cancelar" : " Nova Propaganda"}
            </button>

            <button
              className="btn-ghost"
              onClick={() => navigate("/admin", { replace: true })}
            >
               Voltar
            </button>
          </div>
        </header>

        {/* ALERT DE ERRO */}
        {error && (
          <div className={styles.alert}>
            <strong>Erro:</strong> {error}
          </div>
        )}

        {/* FORMULÁRIO CRIAR */}
        {showForm && !editingAd && (
          <section className={styles.section}>
            <h2>Nova Propaganda</h2>
            <AdForm
              questions={questions}
              onSubmit={handleCreateAd}
              onCancel={() => {
                setShowForm(false);
                setError("");
              }}
            />
          </section>
        )}

        {/* FORMULÁRIO EDITAR */}
        {editingAd && (
          <section className={styles.section}>
            <h2>Editar Propaganda #{editingAd.id}</h2>
            <AdForm
              questions={questions}
              initialData={editingAd}
              onSubmit={(data) => handleUpdateAd(editingAd.id, data)}
              onCancel={() => {
                setEditingAd(null);
                setError("");
              }}
              isEditing
            />
          </section>
        )}

        {/* LISTA DE ADS */}
        <section className={styles.section}>
          <h2>Propagandas ({ads.length})</h2>

          {ads.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhuma propaganda cadastrada ainda.</p>
              <button
                className="btn-primary"
                onClick={() => {
                  setShowForm(true);
                  setEditingAd(null);
                }}
              >
                Criar primeira propaganda
              </button>
            </div>
          ) : (
            <AdsList
              ads={ads}
              questions={questions}
              onEdit={(ad) => {
                setEditingAd(ad);
                setShowForm(false);
              }}
              onDelete={handleDeleteAd}
            />
          )}
        </section>
      </div>
    </div>
  );
}
