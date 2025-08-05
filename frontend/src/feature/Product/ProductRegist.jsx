import { useNavigate } from "react-router";
import "./css/ProductRegist.css";
import { useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";

export function ProductRegist() {
  const [thumbnails, setThumbnails] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState([]);

  const [detailImages, setDetailImages] = useState([]);
  const [detailPreview, setDetailPreview] = useState([]);
  const [previewImages, setPreviewImages] = useState([]); // 미리보기 URL
  const navigate = useNavigate();
  const [detailText, setDetailText] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [options, setOptions] = useState([]);

  const handleThumbnailChange = (e) => {
    const files = Array.from(e.target.files);
    setThumbnails(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setThumbnailPreview(previews);
  };

  const handleDetailImageChange = (e) => {
    const files = Array.from(e.target.files);
    setDetailImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setDetailPreview(previews);
  };

  const handleRemoveThumbnail = (idx) => {
    const newFiles = [...thumbnails];
    const newPreviews = [...thumbnailPreview];
    newFiles.splice(idx, 1);
    newPreviews.splice(idx, 1);
    setThumbnails(newFiles);
    setThumbnailPreview(newPreviews);
  };

  const handleRemoveDetailImage = (idx) => {
    const newFiles = [...detailImages];
    const newPreviews = [...detailPreview];
    newFiles.splice(idx, 1);
    newPreviews.splice(idx, 1);
    setDetailImages(newFiles);
    setDetailPreview(newPreviews);
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!productName.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }
    if (!price || isNaN(price)) {
      alert("가격을 입력해주세요.");
      return;
    }
    if (!quantity || isNaN(quantity)) {
      alert("수량을 입력해주세요.");
      return;
    }
    if (!category.trim()) {
      alert("카테고리를 입력해주세요.");
      return;
    }
    if (!info.trim()) {
      alert("상세설명을 입력해주세요.");
      return;
    }
    if (thumbnails.length === 0) {
      alert("썸네일이미지를 한 장 이상 추가해주세요.");
      return;
    }
    if (detailImages.length === 0) {
      alert("본문이미지를 한 장 이상 추가해주세요.");
      return;
    }
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", category);
    formData.append("info", info);
    formData.append("options", JSON.stringify(options));
    formData.append("detailText", detailText);
    thumbnails.forEach((file) => {
      formData.append("thumbnails", file);
    });

    detailImages.forEach((file) => {
      formData.append("detailImages", file);
    });

    axios
      .post("/api/product/regist", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert("🎇상품등록이 완료되었습니다.");
        setProductName("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setInfo("");
        setThumbnails([]);
        setThumbnailPreview([]);
        setDetailImages([]);
        setDetailPreview([]);
        setOptions([]);
        setDetailText("");
        navigate("/product/list");
      })
      .catch((err) => {
        console.error(err);
        alert("상품등록중 오류가 발생하였습니다❌.");
      });
  }

  function handleRemoveImage(index) {
    setImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    setPreviewImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }

  function handleImageChange(e) {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="product-regist-field">
          <h2 style={{ fontSize: "2rem" }}>상품 등록</h2>
          <label className="product-regist-label mt-3">상품명</label>
          <input
            className="product-regist-input"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="product-regist-field">
          <label className="product-regist-label">가격</label>
          <input
            className="product-regist-input"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="product-regist-field">
          <label className="product-regist-label">수량</label>
          <input
            className="product-regist-input"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="product-regist-field">
          <label className="product-regist-label">카테고리</label>
          <input
            className="product-regist-input"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="product-regist-field">
          <label className="product-regist-label">상품 설명</label>
          <textarea
            rows={5}
            className="product-regist-textarea"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
        </div>
        {/* 본문영역 텍스트 삽입 폼 필요하면 추가.*/}
        {/*<div className="product-regist-field">*/}
        {/*  <label className="product-regist-label">본문영역</label>*/}
        {/*  <textarea*/}
        {/*    rows={5}*/}
        {/*    className="product-regist-textarea"*/}
        {/*    value={detailText}*/}
        {/*    onChange={(e) => setDetailText(e.target.value)}*/}
        {/*  />*/}
        {/*</div>*/}

        <div className="product-regist-options">
          <label className="product-regist-label">옵션 목록</label>
          {options.map((opt, index) => (
            <div className="product-regist-option-row" key={index}>
              <input
                type="text"
                placeholder="메뉴이름"
                className="product-regist-input"
                value={opt.optionName}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index].optionName = e.target.value;
                  setOptions(newOptions);
                }}
              />
              <input
                type="text"
                placeholder="가격"
                className="product-regist-input"
                value={opt.price}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index].price = e.target.value;
                  setOptions(newOptions);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newOptions = [...options];
                  newOptions.splice(index, 1);
                  setOptions(newOptions);
                }}
                className="product-regist-option-remove-btn"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setOptions([...options, { optionName: "", price: "" }])
            }
          >
            옵션 추가
          </button>
        </div>

        {/*상품 파일선택*/}
        {/* 썸네일 이미지 업로드 */}
        <div className="product-regist-field">
          <label className="product-regist-label">썸네일 이미지</label>
          <div className="product-regist-file-upload">
            <label
              htmlFor="thumbnailFileInput"
              className="product-regist-file-label"
            >
              파일 선택
            </label>
            <span className="product-regist-file-count">
              파일 {thumbnails.length}개
            </span>
            <input
              id="thumbnailFileInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleThumbnailChange}
              className="product-regist-file-input"
            />
          </div>
          {thumbnailPreview.length > 0 && (
            <div className="product-regist-image-preview">
              {thumbnailPreview.map((url, idx) => (
                <div key={idx} className="product-regist-preview-box">
                  <img
                    src={url}
                    className="product-regist-preview-img"
                    alt={`썸네일 미리보기 ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="product-regist-image-remove-btn"
                    onClick={() => handleRemoveThumbnail(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 본문 이미지 업로드 */}
        <div className="product-regist-field">
          <label className="product-regist-label">본문 이미지</label>
          <div className="product-regist-file-upload">
            <label
              htmlFor="detailFileInput"
              className="product-regist-file-label"
            >
              파일 선택
            </label>
            <span className="product-regist-file-count">
              파일 {detailImages.length}개
            </span>
            <input
              id="detailFileInput"
              type="file"
              multiple
              accept="image/*"
              onChange={handleDetailImageChange}
              className="product-regist-file-input"
            />
          </div>
          {detailPreview.length > 0 && (
            <div className="product-regist-image-preview">
              {detailPreview.map((url, idx) => (
                <div key={idx} className="product-regist-preview-box">
                  <img
                    src={url}
                    className="product-regist-preview-img"
                    alt={`본문 미리보기 ${idx + 1}`}
                  />
                  <button
                    type="button"
                    className="product-regist-image-remove-btn"
                    onClick={() => handleRemoveDetailImage(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="product-regist-submit-btns">
          <button type="submit" className="product-regist-btn confirm">
            등록
          </button>
          <button
            type="button"
            className="product-regist-btn cancel"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
