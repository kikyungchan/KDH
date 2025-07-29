import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./css/ProductEdit.css";

export function ProductEdit() {
  const [newImages, setNewImages] = useState([]); // 새로 추가된 파일들
  const [previewImages, setPreviewImages] = useState([]); // 미리보기용 URL
  const [deletedImagePaths, setDeletedImagePaths] = useState([]);

  const [imagePaths, setImagePaths] = useState([]); // 전체 이미지 경로 리스트
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
  const [thumbnail, setThumbnail] = useState("");

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
        setImagePaths(res.data.imagePath || []); // 전체 이미지 리스트 저장
        setThumbnail(res.data.imagePath?.[0]); // 대표 이미지 하나는 그대로 사용 가능
      })
      .catch((err) => {})
      .finally(() => {});
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    // 1. 유효성 검사
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
    formData.append("id", id); // 수정 대상 id

    // 삭제 이미지
    deletedImagePaths.forEach((path) => {
      formData.append("deletedImages", path);
    });

    // 추가 이미지
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
    // 1. 미리보기 제거
    setPreviewImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    // 2. 실제 업로드 대상 파일도 제거
    setNewImages((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  }

  function handleAddImages(e) {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  }

  function handleImageDelete(index) {
    const deleted = imagePaths[index]; // 삭제 대상 경로 추출
    setDeletedImagePaths((prev) => [...prev, deleted]); // 삭제 리스트에 추가

    const updated = [...imagePaths];
    updated.splice(index, 1); // 화면에서 제거
    setImagePaths(updated);
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col className="mb-3">
          <div className="product-edit-container">
            <h2 className="mb-4">상품 정보수정</h2>

            {/* 등록된 이미지 */}
            <div>
              <h4 className="mb-3">등록된 이미지</h4>
              <div className="product-edit-image-box">
                {imagePaths.map((path, idx) => (
                  <div key={idx} className="product-edit-image-wrapper">
                    <img
                      src={path}
                      alt={`상품 이미지 ${idx + 1}`}
                      className="product-edit-image"
                    />
                    <button
                      size="sm"
                      className="product-edit-button-delete"
                      onClick={() => handleImageDelete(idx)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 새 이미지 추가 */}
            <div>
              <h4 className="mb-3">새 이미지 추가</h4>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAddImages}
              />
              {newImages.length > 0 && (
                <ul className="product-edit-file-list">
                  {newImages.map((file, idx) => (
                    <li key={idx} className="product-edit-file-item">
                      {file.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 미리보기 */}
            <div className="product-edit-preview-box">
              {previewImages.map((url, idx) => (
                <div key={idx} className="product-edit-image-wrapper">
                  <img
                    src={url}
                    alt={`추가 이미지 ${idx + 1}`}
                    className="product-edit-preview"
                  />
                  <button
                    size="sm"
                    className="product-edit-button-cancel"
                    onClick={() => handleRemoveNewImage(idx)}
                  >
                    취소
                  </button>
                </div>
              ))}
            </div>

            {/* 입력폼 */}
            <div className="mt-2 mb-2">
              상품명
              <input
                name="productName"
                onChange={handleChange}
                value={form.productName}
                type="text"
              />
            </div>
            <div className="mb-2">
              가격
              <input
                name="price"
                onChange={handleChange}
                value={form.price}
                type="text"
              />
            </div>
            <div className="mb-2">
              카테고리
              <input
                name="category"
                onChange={handleChange}
                value={form.category}
                type="text"
              />
            </div>
            <div className="mb-2">
              수량
              <input
                name="quantity"
                onChange={handleChange}
                value={form.quantity}
                type="text"
              />
            </div>
            <div className="mb-2">
              상품설명
              <textarea
                value={form.info}
                onChange={handleChange}
                name="info"
              ></textarea>
            </div>
            <div className="mb-2">
              <button onClick={handleSave}>저장</button>
              <button onClick={() => navigate(-1)}>취소</button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
