import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function ProductRegist() {
  const [previewImages, setPreviewImages] = useState([]); // 미리보기 URL
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);
  const [options, setOptions] = useState([{ optionName: "", price: "" }]);

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
    if (images.length === 0) {
      alert("이미지를 한 장 이상 추가해주세요.");
      return;
    }
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", category);
    formData.append("info", info);
    formData.append("options", JSON.stringify(options));
    images.forEach((file) => {
      formData.append("images", file);
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
        setImages([]);
        setPreviewImages([]);
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
    setImages(files); // 이미지 파일 저장

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews); // 미리보기 URL 저장
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          상품명
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          가격
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          수량
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div>
          카테고리
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          상품설명
          <textarea
            rows={5}
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <label>옵션 목록 (메뉴이름 / 가격)</label>
          {options.map((opt, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: "10px", marginBottom: "5px" }}
            >
              <input
                type="text"
                placeholder="메뉴이름"
                value={opt.optionName}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index].optionName = e.target.value;
                  setOptions(newOptions);
                }}
              />
              <input
                type="number"
                placeholder="가격"
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
                style={{ color: "red" }}
              >
                삭제
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
        <div>
          상품 이미지
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          {/* 파일 이름 리스트 출력 */}
          {images.length > 0 && (
            <ul style={{ marginTop: "10px", fontSize: "14px" }}>
              {images.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
          {/*파일 미리보기*/}
          {previewImages.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {previewImages.map((url, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`미리보기 ${idx + 1}`}
                    style={{
                      width: "150px",
                      height: "100px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      padding: "2px 6px",
                      fontSize: "12px",
                      color: "white",
                      backgroundColor: "#dc3545", // 부트스트랩 danger 색
                      border: "none",
                      borderRadius: "4px", //
                      cursor: "pointer",
                    }}
                  >
                    취소
                  </button>
                </div>
              ))}
            </div>
          )}
          <button>등록</button>
        </div>
      </div>
    </form>
  );
}
