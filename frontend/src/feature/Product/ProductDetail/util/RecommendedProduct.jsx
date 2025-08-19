import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useEffect } from "react";

export default function RecommendedProduct({ products }) {
  useEffect(() => {
    import("swiper/css");
    import("swiper/css/navigation");
  }, []);
  if (!products?.length) return null;

  return (
    <div className="related-product-section">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".custom-nav-btn.right",
          prevEl: ".custom-nav-btn.left",
        }}
        spaceBetween={20}
        breakpointsBase="window"
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 4 },
        }}
        watchOverflow
        observer
        observeParents
      >
        {products.map((item) => (
          <SwiperSlide key={item.id}>
            <Link
              to={`/product/view?id=${item.id}`}
              className="related-product-card"
              onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
            >
              <img
                src={item.thumbnailPaths?.[0]}
                alt={item.productName}
                className="related-product-image"
              />
              <div className="related-product-info">
                <p className="name">{item.productName}</p>
                <p className="price">{item.price.toLocaleString()}원</p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
        <button className="custom-nav-btn left">‹</button>
        <button className="custom-nav-btn right">›</button>
      </Swiper>
    </div>
  );
}
