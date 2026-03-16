import { useState, useEffect } from "react";
import { api } from "../services/api";
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
    created_by_id: 1,
  });

  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  // ✅ Converte URL relativa para absoluta
  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://penademorte.org/api";
    return `${baseUrl}${url}`;
  };

  const updatePreview = (tipo, url) => {
    console.log("🔍 updatePreview chamado:", { tipo, url });
    
    if (tipo === "youtube" && url) {
      setPreview(`https://www.youtube.com/embed/${url}`);
    } else if ((tipo === "image" || tipo === "video") && url) {
      const fullUrl = getFullUrl(url);
      console.log("🔍 URL completa para preview:", fullUrl);
      setPreview(fullUrl);
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

  // ✅ UPLOAD DE VÍDEO
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Arquivo deve ser um vídeo");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Vídeo muito grande (máximo 50MB)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      console.log("📤 Enviando vídeo:", file.name);

      const response = await api.post("/ads/upload-video", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload concluído:", response.data);

      setFormData((prev) => ({
        ...prev,
        tipo: "video",
        url: response.data.url,
      }));

      updatePreview("video", response.data.url);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Erro ao fazer upload do vídeo";
      setError(msg);
      console.error("❌ Erro no upload:", err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ UPLOAD DE IMAGEM
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Arquivo deve ser uma imagem");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande (máximo 5MB)");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      console.log("📤 Enviando imagem:", file.name);

      const response = await api.post("/ads/upload-image", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload concluído:", response.data);

      setFormData((prev) => ({
        ...prev,
        tipo: "image",
        url: response.data.url,
      }));

      updatePreview("image", response.data.url);
    } catch (err) {
      const msg = err?.response?.data?.detail || "Erro ao fazer upload da imagem";
      setError(msg);
      console.error("❌ Erro no upload:", err);
    } finally {
      setUploading(false);
    }
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
      const dataToSubmit = {
        ...formData,
        question_id: parseInt(formData.question_id),
      };
      console.log("💾 Salvando ad:", dataToSubmit);
      await onSubmit(dataToSubmit);
    } catch (err) {
      setError("Erro ao salvar propaganda");
      console.error("❌ Erro ao salvar:", err);
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
            <option value="video">Vídeo (MP4)</option>
          </select>
          <small>
            {formData.tipo === "image"
              ? "URL da imagem ou faça upload abaixo"
              : formData.tipo === "youtube"
              ? "ID do vídeo YouTube (ex: dQw4w9WgXcQ)"
              : "URL do vídeo MP4 ou faça upload abaixo"}
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
                ? "/static/images/banner.jpg"
                : formData.tipo === "youtube"
                ? "dQw4w9WgXcQ"
                : "/static/videos/video.mp4"
            }
            required
          />
        </div>

        {/* UPLOAD BUTTONS */}
        <div className={styles.group}>
          <label>Upload de Arquivo</label>
          <div className={styles.uploadButtons}>
            {formData.tipo === "image" && (
              <>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
                <label htmlFor="imageUpload" className={styles.uploadBtn}>
                  {uploading ? "Enviando..." : "📷 Upload Imagem"}
                </label>
              </>
            )}

            {formData.tipo === "video" && (
              <>
                <input
                  type="file"
                  id="videoUpload"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
                <label htmlFor="videoUpload" className={styles.uploadBtn}>
                  {uploading ? "Enviando..." : "🎬 Upload Vídeo"}
                </label>
              </>
            )}
          </div>
          <small>
            {formData.tipo === "image" && "Máximo 5MB (JPG, PNG, WebP)"}
            {formData.tipo === "video" && "Máximo 50MB (MP4, MOV)"}
          </small>
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
          ) : formData.tipo === "youtube" ? (
            <iframe
              width="100%"
              height="300"
              src={preview}
              title="Preview YouTube"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : formData.tipo === "video" ? (
            <video
              src={preview}
              controls
              className={styles.previewImage}
              style={{ maxHeight: "300px", width: "100%" }}
            />
          ) : null}
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {/* BOTÕES */}
      <div className={styles.buttons}>
        <button
          type="button"
          className="btn-ghost"
          onClick={onCancel}
          disabled={loading || uploading}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading || uploading}>
          {uploading
            ? "Enviando arquivo..."
            : loading
            ? "Salvando..."
            : isEditing
            ? "Atualizar"
            : "Criar"}{" "}
          Propaganda
        </button>
      </div>
    </form>
  );
}
