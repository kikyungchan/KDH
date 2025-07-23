import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function ProductEdit() {
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
        setForm(res.data);
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

  return (
    <div>
      <h2>상품 정보수정</h2>
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
  );
}
