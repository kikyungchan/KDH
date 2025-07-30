import axios from "axios";

export async function handleBuyButton({
  product,
  selectedOption,
  quantity,
  thumbnail,
  setCartItems,
  setShowCartConfirmModal,
  navigate,
}) {
  if (product.options?.length > 0 && !selectedOption) {
    alert("옵션을 선택해주세요.");
    return;
  }

  if (quantity > product.quantity) {
    alert(`재고가 부족합니다.`);
    return;
  }

  const token = localStorage.getItem("token");

  if (token) {
    try {
      const res = await axios.get("/api/product/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.length > 0) {
        setCartItems(res.data);
        setShowCartConfirmModal(true);
      } else {
        navigate("/product/order", {
          state: {
            productId: product.id,
            productName: product.productName,
            price: selectedOption ? selectedOption.price : product.price,
            quantity,
            imagePath: thumbnail,
            option: selectedOption?.optionName || null,
            optionId: selectedOption?.id || null,
          },
        });
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    if (guestCart.length > 0) {
      setCartItems(guestCart);
      setShowCartConfirmModal(true);
    } else {
      navigate("/product/order", {
        state: {
          productId: product.id,
          productName: product.productName,
          price: selectedOption ? selectedOption.price : product.price,
          quantity,
          imagePath: thumbnail,
          option: selectedOption?.optionName || null,
          optionId: selectedOption?.id || null,
        },
      });
    }
  }
}

export function handleCartButton({
  product,
  selectedOption,
  quantity,
  thumbnail,
  setShowModal,
  setCartCount,
}) {
  if (product.options?.length > 0 && !selectedOption) {
    alert("옵션을 선택해주세요.");
    return;
  }

  if (quantity > product.quantity) {
    alert(`재고가 부족합니다.`);
    return;
  }

  const token = localStorage.getItem("token");

  if (token) {
    const cartItem = {
      productId: product.id,
      optionName: selectedOption ? selectedOption.optionName : null,
      quantity,
    };
    axios
      .post("/api/product/cart", cartItem, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setShowModal(true);
        return axios.get("/api/product/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => {
        setCartCount(res.data.length);
      })
      .catch((err) => {
        console.error("장바구니 추가 실패", err);
      });
  } else {
    const existingCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    if (product.options?.length > 0) {
      const enrichedOptions = (product.options || []).map((opt, idx) => ({
        ...opt,
        id: idx + 1,
      }));
      const selectedId = enrichedOptions.find(
        (opt) => opt.optionName === selectedOption.optionName,
      )?.id;

      const cartItem = {
        productId: product.id,
        optionId: selectedId,
        productName: product.productName,
        optionName: selectedOption.optionName,
        price: selectedOption.price,
        quantity,
        imagePath: thumbnail,
        options: enrichedOptions,
      };

      const existingIndex = existingCart.findIndex(
        (item) =>
          item.productId === cartItem.productId &&
          item.optionName === cartItem.optionName,
      );
      if (existingIndex > -1) {
        existingCart[existingIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }
    } else {
      const cartItem = {
        productId: product.id,
        productName: product.productName,
        price: product.price,
        quantity,
        imagePath: thumbnail,
        optionName: null,
        optionId: null,
        options: [],
      };

      const existingIndex = existingCart.findIndex(
        (item) => item.productId === cartItem.productId,
      );
      if (existingIndex > -1) {
        existingCart[existingIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }
    }

    localStorage.setItem("guestCart", JSON.stringify(existingCart));
    setShowModal(true);
    setCartCount(existingCart.length);
  }
}

export function handleGoToCartWithCurrenProduct({
  product,
  selectedOption,
  quantity,
  thumbnail,
  navigate,
  setShowCartConfirmModal,
}) {
  const token = localStorage.getItem("token");

  if (product.options?.length > 0 && !selectedOption) {
    alert("옵션을 선택해주세요.");
    return;
  }

  if (token) {
    const cartItem = {
      productId: product.id,
      optionName:
        product.options?.length > 0 ? selectedOption.optionName : null,
      quantity,
    };
    axios
      .post("/api/product/cart", cartItem, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setShowCartConfirmModal(false);
        navigate("/product/cart");
      })
      .catch((err) => {
        console.error("장바구니 추가 실패", err);
        alert("장바구니 추가에 실패했습니다.");
      });
  } else {
    const enrichedOptions = (product.options || []).map((opt, idx) => ({
      ...opt,
      id: idx + 1,
    }));

    const selectedId = enrichedOptions.find(
      (opt) => opt.optionName === selectedOption.optionName,
    )?.id;

    const cartItem = {
      productId: product.id,
      optionId: selectedId,
      productName: product.productName,
      optionName: selectedOption?.optionName || null,
      price: selectedOption?.price || product.price,
      quantity,
      imagePath: thumbnail,
      options: enrichedOptions,
    };

    const existingCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    const existingIndex = existingCart.findIndex(
      (item) =>
        item.productId === cartItem.productId &&
        item.optionName === cartItem.optionName,
    );

    if (existingIndex > -1) {
      existingCart[existingIndex].quantity += cartItem.quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("guestCart", JSON.stringify(existingCart));
    setShowCartConfirmModal(false);
    navigate("/product/cart");
  }
}
