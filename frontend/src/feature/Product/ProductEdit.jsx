import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swipe from "bootstrap/js/src/util/swipe.js";
import { Button } from "react-bootstrap";

export function ProductEdit() {
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
    axios
      .put(`/api/product/edit?id=${id}`, form)
      .then((res) => {
        alert("수정 완료");
        navigate(`/product/view?id=${id}`);
      })
      .catch((err) => {
        console.log("안될떄");
      })
      .finally(() => {});
  }

  function handleImageDelete(index) {
    // 삭제할 이미지 경로를 제외한 나머지만 남기기
    const updated = [...imagePaths];
    updated.splice(index, 1);
    setImagePaths(updated);
  }

  return (
    <>
      <div>
        <h2>상품 정보수정</h2>
        <div>
          <h4>등록된 이미지</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {imagePaths.map((path, idx) => {
              const fileName = path.split("/").pop();
              return (
                <div key={idx} style={{ position: "relative" }}>
                  <img
                    src={`http://localhost:8080/static/${fileName}`}
                    alt={`상품 이미지 ${idx + 1}`}
                    width="150"
                    style={{ border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    style={{ position: "absolute", top: 0, right: 0 }}
                    onClick={() => handleImageDelete(idx)}
                  >
                    삭제
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          상품명
          <input
            name="productName"
            onChange={handleChange}
            value={form.productName}
            type="text"
          />
        </div>
        <div>
          가격
          <input
            name="price"
            onChange={handleChange}
            value={form.price}
            type="text"
          />
        </div>
        <div>
          카테고리
          <input
            name="category"
            onChange={handleChange}
            value={form.category}
            type="text"
          />
        </div>
        <div>
          수량
          <input
            name="quantity"
            onChange={handleChange}
            value={form.quantity}
            type="text"
          />
        </div>
        <div>
          상품설명
          <textarea
            value={form.info}
            onChange={handleChange}
            name="info"
          ></textarea>
        </div>
        <div>
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </>
  );
}
