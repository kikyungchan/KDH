import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function ProductRegist() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [info, setInfo] = useState("");
  const [images, setImages] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .postForm("/api/product/regist", {
        productName: productName,
        price: price,
        quantity: quantity,
        category: category,
        info: info,
        images: images,
      })
      .then((res) => {
        alert("🎇상품등록이 완료되었습니다.");
        setProductName("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setInfo("");
        setImages([]);
        navigate("/product/list");
      })
      .catch((err) => {
        alert("상품등록중 오류가 발생하였습니다❌.");
      })
      .finally(() => {});
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
        <div>
          상품 이미지
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
          />
        </div>
        <button type="submit">등록</button>
      </div>
    </form>
  );
}
