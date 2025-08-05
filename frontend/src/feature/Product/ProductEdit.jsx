import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import "./css/ProductEdit.css";

export function ProductEdit() {
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [deletedImagePaths, setDeletedImagePaths] = useState([]);
  const [imagePaths, setImagePaths] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [form, setForm] = useState({
    productName: "",
    price: "",
    category: "",
    info: "",
    quantity: "",
  });

  useEffect(() => {
    axios
      .get(`/api/product/view?id=${id}`)
      .then((res) => {
        setForm({
          productName: res.data.productName,
          price: res.data.price,
          category: res.data.category,
          info: res.data.info,
          quantity: res.data.quantity,
        });
        setImagePaths(res.data.imagePath || []);
      })
      .catch((err) => console.error(err));
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    if (!form.productName.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }
    if (!form.price || isNaN(form.price)) {
      alert("가격을 입력해주세요.");
      return;
    }
    if (!form.quantity || isNaN(form.quantity)) {
      alert("수량을 입력해주세요.");
      return;
    }
    if (!form.category.trim()) {
      alert("카테고리를 입력해주세요.");
      return;
    }
    if (!form.info.trim()) {
      alert("상세설명을 입력해주세요.");
      return;
    }
    if (imagePaths.length + newImages.length === 0) {
      alert("최소 1장의 이미지를 등록해주세요.");
      return;
    }
    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("info", form.info);
    formData.append("quantity", form.quantity);
    formData.append("id", id);

    deletedImagePaths.forEach((path) => {
      formData.append("deletedImages", path);
    });

    newImages.forEach((file) => {
      formData.append("newImages", file);
    });

    axios
      .put(`/api/product/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("수정 완료");
        navigate(`/product/view?id=${id}`);
      })
      .catch((err) => {
        console.error("수정 실패", err);
      });
  }

  function handleRemoveNewImage(index) {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddImages(e) {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  }

  function handleImageDelete(index) {
    const deleted = imagePaths[index];
    setDeletedImagePaths((prev) => [...prev, deleted]);
    setImagePaths((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="product-edit-field">
          <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            상품 정보수정
          </h2>
        </div>

        <div className="product-edit-field">
          <label className="product-edit-label">상품명</label>
          <input
            className="product-edit-input"
            type="text"
            name="productName"
            value={form.productName}
            onChange={handleChange}
          />
        </div>

        <div className="product-edit-field">
          <label className="product-edit-label">가격</label>
          <input
            className="product-edit-input"
            type="text"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="product-edit-field">
          <label className="product-edit-label">수량</label>
          <input
            className="product-edit-input"
            type="text"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="product-edit-field">
          <label className="product-edit-label">카테고리</label>
          <input
            className="product-edit-input"
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <div className="product-edit-field">
          <label className="product-edit-label">상품 설명</label>
          <textarea
            rows={5}
            className="product-edit-textarea"
            name="info"
            value={form.info}
            onChange={handleChange}
          />
        </div>

        {/* 기존 이미지 */}
        <div className="product-edit-field">
          <label className="product-edit-label">기존 이미지</label>
          <div className="product-edit-image-box">
            {imagePaths.map((path, idx) => (
              <div key={idx} className="product-edit-image-wrapper">
                <img
                  src={path}
                  alt={`기존 이미지 ${idx + 1}`}
                  className="product-edit-image"
                />
                <button
                  type="button"
                  className="product-edit-button-delete"
                  onClick={() => handleImageDelete(idx)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 새 이미지 추가 */}
        <div className="product-edit-field">
          <label className="product-edit-label">새 이미지 추가</label>
          <div className="product-edit-file-upload">
            <label htmlFor="fileInput" className="product-edit-file-label">
              파일 선택
            </label>
            <span className="product-edit-file-count">
              파일 {newImages.length}개
            </span>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleAddImages}
              className="product-edit-file-input"
            />
          </div>
          {previewImages.length > 0 && (
            <div className="product-edit-preview-box">
              {previewImages.map((url, idx) => (
                <div key={idx} className="product-edit-image-wrapper">
                  <img
                    src={url}
                    className="product-edit-preview"
                    alt={`미리보기 ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="product-edit-button-delete"
                    onClick={() => handleRemoveNewImage(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-edit-submit-btns">
          <button type="submit" className="product-edit-btn confirm">
            저장
          </button>
          <button
            type="button"
            className="product-edit-btn cancel"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
