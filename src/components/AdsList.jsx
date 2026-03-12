import styles from "./AdsList.module.css";

export default function AdsList({ ads, questions, onEdit, onDelete }) {
  const getQuestionTitle = (questionId) => {
    const q = questions.find((qu) => qu.id === questionId);
    return q ? q.text.substring(0, 80) : `Pergunta #${questionId}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={styles.grid}>
      {ads.map((ad) => (
        <div key={ad.id} className={styles.card}>
          {/* PREVIEW */}
          <div className={styles.preview}>
            {ad.tipo === "image" ? (
              <img src={ad.url} alt="Ad" className={styles.image} />
            ) : (
              <div className={styles.videoPlaceholder}>
                <span className={styles.playIcon}>▶</span>
                <div className={styles.videoInfo}>
                  <strong>YouTube</strong>
                  <small>{ad.url}</small>
                </div>
              </div>
            )}
          </div>

          {/* INFO */}
          <div className={styles.info}>
            {/* HEADER COM ID E STATUS */}
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

            {/* TIPO */}
            <div className={styles.detail}>
              <strong>Tipo:</strong>
              <span className={styles.tipo}>{ad.tipo}</span>
            </div>

            {/* PERGUNTA */}
            <div className={styles.detail}>
              <strong>Pergunta:</strong>
              <div className={styles.questionText}>
                {getQuestionTitle(ad.question_id)}
              </div>
            </div>

            {/* LINK */}
            {ad.link && (
              <div className={styles.detail}>
                <strong>Link:</strong>
                <a
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.externalLink}
                >
                  {ad.link.substring(0, 40)}...
                </a>
              </div>
            )}

            {/* DATA */}
            <div className={styles.detail}>
              <strong>Criada em:</strong>
              <span className={styles.date}>{formatDate(ad.created_at)}</span>
            </div>
          </div>

          {/* AÇÕES */}
          <div className={styles.actions}>
            <button
              className={styles.btnEdit}
              onClick={() => onEdit(ad)}
              title="Editar propaganda"
            >
              ✏️ Editar
            </button>
            <button
              className={styles.btnDelete}
              onClick={() => onDelete(ad.id)}
              title="Deletar propaganda"
            >
              🗑️ Deletar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
