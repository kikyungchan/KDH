import {Card, Col, Container, Pagination, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    axios
      .get(`/api/member/list?${searchParams}`)
      .then((res) => {
        // console.log("res.data" + res.data);
        setMemberList(res.data.memberList);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
      })
      .finally(() => {
      });
  }, [searchParams]);

  const pageNumber = [];
  // console.log("pageInfo : ", pageInfo);
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumber.push(i);
  }

  function handlePageNumberClick(pageNumber) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", pageNumber);
    setSearchParams(nextSearchParams);
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-start pt-10">
        <div className="w-full max-w-[1200px] mx-auto px-4">
          <div className="px-8 py-6 shadow rounded-2xl bg-white">
            <div className="w-full">
                <h2 className="mb-6 text-center text-2xl font-bold">회원 목록</h2>
                <table
                  hover
                  responsive
                  className="table table-striped"
                >
                  <thead className="thead-light">
                  <tr>
                    <th>회원번호</th>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>전화번호</th>
                    <th>이메일</th>
                  </tr>
                  </thead>
                  <tbody>
                  {memberList.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => navigate(`/member?id=${member.id}`)}
                      style={{cursor: "pointer"}}
                    >
                      <td>{member.id}</td>
                      <td>{member.loginId}</td>
                      <td>{member.name}</td>
                      <td>{member.phone}</td>
                      <td>{member.email}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
            </div>
          </div>
          {/* 페이지 네이션 */}
          <div className="mt-4 flex justify-center">
            <div className="join">
              <button
                className="join-item btn"
                disabled={pageInfo.currentPageNumber === 1}
                onClick={() => handlePageNumberClick(1)}
              >
                «
              </button>

              <button
                className="join-item btn"
                disabled={pageInfo.leftPageNumber <= 1}
                onClick={() =>
                  handlePageNumberClick(pageInfo.leftPageNumber - 10)
                }
              >
                ‹
              </button>

              {pageNumber.map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageNumberClick(num)}
                  className={`join-item btn ${
                    pageInfo.currentPageNumber === num ? "btn-active btn-neutral" : ""
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                className="join-item btn"
                disabled={pageInfo.rightPageNumber >= pageInfo.totalPages}
                onClick={() =>
                  handlePageNumberClick(pageInfo.rightPageNumber + 1)
                }
              >
                ›
              </button>

              <button
                className="join-item btn"
                disabled={pageInfo.currentPageNumber === pageInfo.totalPages}
                onClick={() => handlePageNumberClick(pageInfo.totalPages)}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
