import {FiUser} from "react-icons/fi";
import {Link} from "react-router";

export function NavUserMenu({user, logout, isAdmin}) {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <FiUser className="text-2xl text-black"/>
      </div>
      <ul tabIndex={0}
          className="menu dropdown-content z-[999]
          text-lg
           p-2 shadow bg-white text-black rounded-box w-52">
        {user ? (
          <>
            <li className="px-3 py-1 font-semibold">{user.name} 님</li>
            <li>
              <Link to={`/member?id=${user.id}`}>회원 정보</Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/member/list">회원 목록</Link>
              </li>
            )}
            {!isAdmin && (
              <li>
                <Link to="/orders">주문 내역</Link>
              </li>
            )}
            <li>
              <Link to="/logout">로그아웃</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">로그인</Link>
            </li>
            <li>
              <Link to="/signup">회원가입</Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
