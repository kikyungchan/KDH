import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import "./css/ProductEdit.css";

export function ProductEdit() {
  // 썸네일이미지
  const [thumbnailPaths, setThumbnailPaths] = useState([]);
  const [deletedThumbnails, setDeletedThumbnails] = useState([]);
  const [newThumbnails, setNewThumbnails] = useState([]);
  // 새 썸네일 미리보기
  const [previewThumbnails, setPreviewThumbnails] = useState([]);

  // 본문이미지
  const [detailImagePaths, setDetailImagePaths] = useState([]);
  const [deletedDetails, setDeletedDetails] = useState([]);
  const [newDetails, setNewDetails] = useState([]);

  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [deletedImagePaths, setDeletedImagePaths] = useState([]);
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
        const data = res.data;
        setForm({
          productName: data.productName,
          price: data.price,
          category: data.category,
          info: data.info,
          quantity: data.quantity,
        });
        // 썸네일 이미지 목록
        setThumbnailPaths(data.thumbnailPaths || []);
        // 본문 이미지 목록
        setDetailImagePaths(data.detailImagePaths || []);
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

    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("info", form.info);
    formData.append("quantity", form.quantity);
    formData.append("id", id);

    // 썸네일 삭제 목록
    deletedThumbnails.forEach((path) => {
      formData.append("deletedThumbnails", path);
    });

    // 썸네일 새 이미지
    newThumbnails.forEach((file) => {
      formData.append("newThumbnails", file);
    });

    // 본문 삭제 목록
    deletedImagePaths.forEach((path) => {
      formData.append("deletedImages", path);
    });

    // 본문 새 이미지
    newImages.forEach((file) => {
      formData.append("newImages", file);
    });
    console.log("newThumbnails", formData.getAll("newThumbnails"));
    axios
      .post(`/api/product/edit`, formData, {
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

  function handleRemoveNewThumbnail(index) {
    setPreviewThumbnails((prev) => prev.filter((_, i) => i !== index));
    setNewThumbnails((prev) => prev.filter((_, i) => i !== index));
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
          <h2 style={{ fontSize: "2rem" }}>상품 정보수정</h2>
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

        {/* 썸네일 이미지 변경 */}
        <div className="product-edit-field">
          <label className="product-edit-label">썸네일 이미지 변경</label>
          <div className="product-edit-image-box">
            {/* 기존 썸네일 */}
            {thumbnailPaths.map((path, idx) => (
              <div key={idx} className="product-edit-image-wrapper">
                <img
                  src={path.storedPath}
                  alt={`썸네일 ${idx + 1}`}
                  className="product-edit-image"
                />
                <button
                  type="button"
                  className="product-edit-button-delete"
                  onClick={() => {
                    setDeletedThumbnails((prev) => [...prev, path.storedPath]);
                    setThumbnailPaths((prev) =>
                      prev.filter((_, i) => i !== idx),
                    );
                  }}
                >
                  ×
                </button>
                {path.isMain && (
                  <div className="product-edit-thumbnail-badge">대표이미지</div>
                )}
              </div>
            ))}
            {/* 새 썸네일 미리보기 */}
            {previewThumbnails.map((url, idx) => (
              <div key={`new-${idx}`} className="product-edit-image-wrapper">
                <img
                  src={url}
                  alt={`썸네일 미리보기 ${idx + 1}`}
                  className="product-edit-image"
                />
                <button
                  type="button"
                  className="product-edit-button-delete"
                  onClick={() => handleRemoveNewThumbnail(idx)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* 썸네일 추가 업로드 */}
        <div className="product-edit-file-upload">
          <label htmlFor="thumbnailInput" className="product-edit-file-label">
            파일 선택
          </label>
          <span className="product-edit-file-count">
            파일 {newThumbnails.length}개
          </span>
          <input
            id="thumbnailInput"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              setNewThumbnails((prev) => [...prev, ...files]);
              const previews = files.map((file) => URL.createObjectURL(file));
              setPreviewThumbnails((prev) => [...prev, ...previews]);
            }}
            className="product-edit-file-input"
          />
        </div>

        {/* 본문 이미지 변경 */}
        <div className="product-edit-field">
          <label className="product-edit-label">본문 이미지 변경</label>
          <div className="product-edit-image-box">
            {detailImagePaths.map((path, idx) => (
              <div key={idx} className="product-edit-image-wrapper">
                <img
                  src={path}
                  alt={`본문 이미지 ${idx + 1}`}
                  className="product-edit-image"
                />
                <button
                  type="button"
                  className="product-edit-button-delete"
                  onClick={() => {
                    setDeletedImagePaths((prev) => [...prev, path]);
                    setDetailImagePaths((prev) =>
                      prev.filter((_, i) => i !== idx),
                    );
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            {/* 미리보기 */}
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
                      onClick={() => {
                        setPreviewImages((prev) =>
                          prev.filter((_, i) => i !== idx),
                        );
                        setNewImages((prev) =>
                          prev.filter((_, i) => i !== idx),
                        );
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 본문 이미지 새로 추가 */}
          <div className="product-edit-file-upload">
            <label htmlFor="bodyImageInput" className="product-edit-file-label">
              이미지 추가
            </label>
            <span className="product-edit-file-count">
              파일 {newImages.length}개
            </span>
            <input
              id="bodyImageInput"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setNewImages((prev) => [...prev, ...files]);
                const previews = files.map((file) => URL.createObjectURL(file));
                setPreviewImages((prev) => [...prev, ...previews]);
              }}
              className="product-edit-file-input"
            />
          </div>
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
