import { useState, useEffect } from "react";
import styles from "./AdForm.module.css";

export default function AdForm({
  questions,
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    tipo: "image",
    url: "",
    link: "",
    question_id: "",
    ativo: true,
    created_by_id: 1, // ✅ ID do admin logado (você pode pegar do context/auth depois)
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        tipo: initialData.tipo,
        url: initialData.url,
        link: initialData.link || "",
        question_id: initialData.question_id,
        ativo: initialData.ativo,
        created_by_id: initialData.created_by_id || 1,
      });
      updatePreview(initialData.tipo, initialData.url);
    }
  }, [initialData]);

  const updatePreview = (tipo, url) => {
    if (tipo === "youtube" && url) {
      setPreview(`https://www.youtube.com/embed/${url}`);
    } else if (tipo === "image" && url) {
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "tipo" || name === "url") {
      const newTipo = name === "tipo" ? value : formData.tipo;
      const newUrl = name === "url" ? value : formData.url;
      updatePreview(newTipo, newUrl);
    }

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.url.trim()) {
      setError("URL é obrigatória");
      return;
    }

    if (!formData.question_id) {
      setError("Pergunta é obrigatória");
      return;
    }

    setLoading(true);
    try {
      // ✅ Converte question_id para número
      const dataToSubmit = {
        ...formData,
        question_id: parseInt(formData.question_id),
      };
      await onSubmit(dataToSubmit);
    } catch (err) {
      setError("Erro ao salvar propaganda");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGrid}>
        {/* TIPO */}
        <div className={styles.group}>
         <label htmlFor="tipo">Tipo de Propaganda *</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="image">Imagem</option>
            <option value="youtube">YouTube</option>
          </select>
          <small>
            {formData.tipo === "image"
              ? "URL da imagem (ex: /static/ads/banner.jpg)"
              : "ID do vídeo YouTube (ex: dQw4w9WgXcQ)"}
          </small>
        </div>

        {/* URL */}
        <div className={styles.group}>
          <label htmlFor="url">URL / ID *</label>
          <input
            id="url"
            type="text"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder={
              formData.tipo === "image"
                ? "/static/ads/banner.jpg"
                : "dQw4w9WgXcQ"
            }
            required
          />
        </div>

        {/* PERGUNTA */}
        <div className={styles.group}>
          <label htmlFor="question_id">Pergunta *</label>
          <select
            id="question_id"
            name="question_id"
            value={formData.question_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecione uma pergunta --</option>
            {questions && questions.length > 0 ? (
              questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id}. {q.text ? q.text.substring(0, 60) : "Sem título"}...
                </option>
              ))
            ) : (
              <option value="" disabled>
                Carregando perguntas...
              </option>
            )}
          </select>
          <small>
            {questions && questions.length === 0
              ? "Nenhuma pergunta disponível"
              : `${questions?.length || 0} perguntas disponíveis`}
          </small>
        </div>

        {/* LINK */}
        <div className={styles.group}>
          <label htmlFor="link">Link de Destino (opcional)</label>
          <input
            id="link"
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        {/* ATIVO */}
        <div className={styles.groupCheckbox}>
          <label htmlFor="ativo" className={styles.checkboxLabel}>
            <input
              id="ativo"
              type="checkbox"
              name="ativo"
              checked={formData.ativo}
              onChange={handleChange}
            />
            <span>Propaganda Ativa</span>
          </label>
        </div>
      </div>

      {/* PREVIEW */}
      {preview && (
        <div className={styles.preview}>
          <h3>Prévia</h3>
          {formData.tipo === "image" ? (
            <img src={preview} alt="Preview" className={styles.previewImage} />
          ) : (
            <iframe
              width="100%"
              height="300"
              src={preview}
              title="Preview YouTube"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {/* BOTÕES */}
      <div className={styles.buttons}>
        <button
          type="button"
          className="btn-ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"} Propaganda
        </button>
      </div>
    </form>
  );
}
