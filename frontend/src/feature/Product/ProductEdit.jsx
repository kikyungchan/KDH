import { useNavigate, useSearchParams } from "react-router";
import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./css/ProductEdit.css";
import axios from "axios";

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
    <div className="container">
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">상품 정보수정</h2>

        {/* 등록된 이미지 */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">등록된 이미지</h4>
          <div className="flex flex-wrap gap-4">
            {imagePaths.map((path, idx) => (
              <div key={idx} className="relative w-32 h-32">
                <img
                  src={path}
                  alt={`상품 이미지 ${idx + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  className="absolute top-1 right-1 btn btn-sm btn-circle btn-error"
                  onClick={() => handleImageDelete(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 새 이미지 추가 */}
        <div className="mb-6">
          <label htmlFor="fileInput" className="btn btn-outline mr-4">
            파일 선택
          </label>
          <span className="text-sm">파일 {newImages.length}개</span>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImages}
            className="hidden"
          />
        </div>

        {/* 미리보기 */}
        <div className="flex flex-wrap gap-4 mb-6">
          {previewImages.map((url, idx) => (
            <div key={idx} className="relative w-32 h-32">
              <img
                src={url}
                alt={`추가 이미지 ${idx + 1}`}
                className="w-full h-full object-cover rounded"
              />
              <button
                className="absolute top-1 right-1 btn btn-sm btn-circle btn-error"
                onClick={() => handleRemoveNewImage(idx)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* 입력 폼 */}
        <div className="space-y-4">
          {[
            ["상품명", "productName"],
            ["가격", "price"],
            ["카테고리", "category"],
            ["수량", "quantity"],
          ].map(([label, name]) => (
            <div key={name}>
              <label className="label">
                <span className="label-text font-semibold">{label}</span>
              </label>
              <input
                name={name}
                onChange={handleChange}
                value={form[name]}
                type="text"
                className="input input-bordered w-full"
              />
            </div>
          ))}

          <div>
            <label className="label">
              <span className="label-text font-semibold">상품설명</span>
            </label>
            <textarea
              rows={10}
              name="info"
              value={form.info}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>
        </div>

        {/* 저장/취소 버튼 */}
        <div className="flex justify-center gap-4 mt-8">
          <button className="btn btn-neutral" onClick={handleSave}>
            저장
          </button>
          <button className="btn" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
