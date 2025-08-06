import { useEffect, useRef } from "react";

function BuyButton({ show, onHide, onOnlyBuy, onMoveToCart }) {
  const dialogRef = useRef();

  useEffect(() => {
    if (show) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [show]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box p-0">
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-lg font-semibold mb-2">
            장바구니에 담긴 상품도 함께 구매하시겠습니까?
          </p>
        </div>
        <div className="flex border-t border-gray-200">
          <button
            onClick={onOnlyBuy}
            className="flex-1 py-3 text-sm font-bold border-r border-gray-200"
          >
            아니요
          </button>
          <button
            onClick={onMoveToCart}
            className="flex-1 py-3 text-sm font-bold"
          >
            장바구니로 이동
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onHide}>닫기</button>
      </form>
    </dialog>
  );
}

export default BuyButton;
