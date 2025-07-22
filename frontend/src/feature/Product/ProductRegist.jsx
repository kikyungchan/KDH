import { useState } from "react";
import axios from "axios";

export function ProductRegist() {
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
        console.log("잘됌");
        console.log(res.data);
      })
      .catch((err) => {
        console.log("잘안됌");
        console.log(err);
      })
      .finally(() => {});
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div>
          상품명
          <input type="text" onChange={(e) => setProductName(e.target.value)} />
        </div>
        <div>
          가격
          <input type="text" onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          수량
          <input type="text" onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div>
          카테고리
          <input type="text" onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          상품설명
          <textarea rows={5} onChange={(e) => setInfo(e.target.value)} />
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
