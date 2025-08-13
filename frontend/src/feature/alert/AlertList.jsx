import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router";
import { toast, Toaster } from "sonner";

export function AlertList() {
  const [alertList, setAlertList] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams("1");

  useEffect(() => {
    axios
      .get(`/api/alert/list?${searchParams}`)
      .then((res) => {
        setAlertList(res.data.alertList);
        // console.log(res.data);
      })
      .catch((err) => {
        console.log("잘 안될 때 코드");
      });
  }, [searchParams]);

  /*
  useEffect(() => {
    axios.get(`/api/qna/add?id=${params.id}`).then((res) => {
      console.log(res.data);
      setProductId(res.data.id);
      console.log(res.data.id);
      setImage(res.data.image?.[0]);
      setProductPrice(res.data.price);
      setProductName(res.data.productName);
    });
    console.log("user : ", user);
    console.log("productName : ", productName);
  }, []);
  */

  if (!alertList) {
    return <span className="loading loading-spinner"></span>;
  }

  return (
    <div>
      <Row>
        <Col>
          <div className={"container"}>
            <h2>알림</h2>
            <button
              className="btn btn-primary"
              onClick={() => toast("버튼이 클릭되었습니다!")}
            >
              기본 토스트
            </button>
            <button
              className="btn btn-primary"
              onClick={() =>
                toast(alertList[1].content, {
                  action: {
                    label: "확인 완료", // 액션 버튼에 표시될 텍스트
                    onClick: () => console.log("액션 버튼 클릭됨"),
                  },
                })
              }
            >
              액션 토스트
            </button>
            {/*<Toaster />*/}

            {alertList.length > 0 ? (
              <div>
                {alertList.map((alert) => (
                  <div
                    tabIndex={0}
                    className="collapse bg-base-100 border-base-300 border"
                  >
                    <div className="collapse-title font-semibold">
                      {alert.title}
                    </div>
                    <div className="collapse-content text-sm">
                      <Link to={alert.link}>{alert.content}</Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>새로운 소식이 없습니다.</p>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
