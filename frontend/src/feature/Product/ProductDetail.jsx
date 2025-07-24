import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";
// import { useNavigate, useSearchParams } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router";
import "./ProductDetail.css";

export function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/product/view?id=${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!product) {
    return <Spinner />;
  }

  function handleDeleteButton() {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    axios
      .delete(`/api/product/delete?id=${id}`)
      .then((res) => {
        alert("삭제되었습니다.");
        navigate("/product/list");
      })
      .catch((err) => {
        alert("삭제 실패");
      })
      .finally(() => {});
  }

  function handleEditButton() {
    navigate(`/product/edit?id=${id}`);
  }

  const thumbnail = product.imagePath?.[0];
  const detailImages = product.imagePath?.slice(1);

  return (
    <div className="product-detail">
      {/* 썸네일 이미지 */}
      {thumbnail && (
        <img
          style={{
            width: "150",
            height: "150",
          }}
          className="product-thumbnail"
          src={`http://localhost:8080/static/${thumbnail.split("/").pop()}`}
          alt="썸네일 이미지"
        />
      )}

      <h2>제품명 : {product.productName}</h2>
      <p>가격 : {product.price.toLocaleString()}원</p>
      <p>재고 : {product.quantity}개</p>
      <p>상세설명 : {product.info}</p>

      {/*수정/삭제버튼, 재고메뉴는 관리자계정만 보이게*/}
      <Button className="btn-secondary" onClick={handleEditButton}>
        수정
      </Button>
      <Button className="btn-danger" onClick={handleDeleteButton}>
        삭제
      </Button>
      <hr />
      {/* 상세 이미지 목록 */}
      <div className="product-images">
        {detailImages?.map((path, index) => (
          <img
            key={index}
            src={`http://localhost:8080/static/${path.split("/").pop()}`}
            alt={`상세 이미지 ${index + 1}`}
            className="product-detail-image"
          />
        ))}
      </div>
      {/*
    todo : faq 페이지, 추천해주는 질문 몇개를 골라서 3개 이상 답하도록
    
      <div>
        <h2>QnA</h2>

        <div>
          \
          todo : 질문자 아이디나 닉네임 공개할지 여부를 정하고 이후 결정
          <div>
            <img
              src=""
              alt=""
              style={{ width: "50px", height: "50px", backgroundColor: "#ccc" }}
            />
            <span>질문자 이름(DB 연결 예정)</span>
          </div>
          
          <div>
            <h5>
              <span>Q : </span> 상품 무게가 어느 정도 되나요? (질문 제목)
            </h5>
            <p>A : </p>
            <textarea
              style={{
                width: "100%",
                height: "100px",
                resize: "none",
                overflow: "hidden",
                border: "1px solid #ffffff",
                borderRadius: "20px",
              }}
              readOnly
              value="네 고객님, 상품 무게가 어느 정도 나가는지에 대해 질문 주셨는데요,
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
              aliquid animi autem beatae deleniti eum incidunt labore nisi
              officia quibusdam quo reiciendis sed suscipit, temporibus
              voluptate? Mollitia nam obcaecati perferendis."
            />
          </div>
        </div>
      </div>*/}
    </div>
  );
}
