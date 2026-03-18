import styles from "./AdsList.module.css";

export default function AdsList({ ads, questions, onEdit, onDelete }) {
  const getQuestionTitle = (questionId) => {
    const q = questions.find((qu) => qu.id === questionId);
    return q ? (q.text || q.question_text || "Sem título").substring(0, 80) : `Pergunta #${questionId}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFullUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "https://penademorte.org/api";

    // Se já vier com /api, usa a origin do domínio
    if (url.startsWith("/api/")) {
      const origin = baseUrl.replace(/\/api\/?$/, "");
      return `${origin}${url}`;
    }

    // Se vier com /static, /uploads etc
    if (url.startsWith("/")) {
      return `${baseUrl}${url}`;
    }

    // fallback
    return `${baseUrl}/${url}`;
  };

  return (
    <div className={styles.grid}>
      {ads.map((ad) => (
        <div key={ad.id} className={styles.card}>
          <div className={styles.preview}>
            {ad.tipo === "image" ? (
              <img
                src={getFullUrl(ad.url)}
                alt={`Propaganda ${ad.id}`}
                className={styles.image}
                onError={(e) => {
                  console.log("Erro ao carregar imagem:", ad.url, getFullUrl(ad.url));
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className={styles.videoPlaceholder}>
                <span className={styles.playIcon}>▶</span>
                <div className={styles.videoInfo}>
                  <strong>{ad.tipo === "youtube" ? "YouTube" : "Vídeo"}</strong>
                  <small>{ad.url}</small>
                </div>
              </div>
            )}
          </div>

          <div className={styles.info}>
            <div className={styles.header}>
              <span className={styles.id}>#{ad.id}</span>
              <span
                className={`${styles.badge} ${
                  ad.ativo ? styles.active : styles.inactive
                }`}
              >
                {ad.ativo ? "Ativa" : "Inativa"}
              </span>
            </div>

            <div className={styles.detail}>
              <strong>Tipo:</strong>
              <span className={styles.tipo}>{ad.tipo}</span>
            </div>

            <div className={styles.detail}>
              <strong>Pergunta:</strong>
              <div className={styles.questionText}>
                {getQuestionTitle(ad.question_id)}
              </div>
            </div>

            {ad.link && (
              <div className={styles.detail}>
                <strong>Link:</strong>
                <a
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  {ad.link.length > 40 ? `${ad.link.substring(0, 40)}...` : ad.link}
                </a>
              </div>
            )}

            <div className={styles.detail}>
              <strong>Criada em:</strong>
              <span className={styles.date}>{formatDate(ad.created_at)}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.btnEdit}
              onClick={() => onEdit(ad)}
              title="Editar propaganda"
              type="button"
            >
              ✏️ Editar
            </button>
            <button
              className={styles.btnDelete}
              onClick={() => onDelete(ad.id)}
              title="Deletar propaganda"
              type="button"
            >
              🗑️ Deletar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}