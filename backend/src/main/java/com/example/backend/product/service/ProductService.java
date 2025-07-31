package com.example.backend.product.service;

import com.example.backend.member.dto.MemberDto;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import com.example.backend.product.controller.ProductController;
import com.example.backend.product.dto.*;
import com.example.backend.product.entity.*;
import com.example.backend.product.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductOptionRepository productOptionRepository;
    private final S3Uploader s3Uploader;
    private final JwtDecoder jwtDecoder;
    private final MemberRepository memberRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;


    // url에서 key만 따오는 메소드
    private String extractS3Key(String url) {
        // 예: https://bucket.s3.region.amazonaws.com/123/abc.jpg -> 123/abc.jpg
        return url.substring(url.indexOf(".com/") + 5);
    }

    public void add(ProductForm productForm) {
        // 상품 저장
        Product product = new Product();
        product.setProductName(productForm.getProductName());
        product.setPrice(productForm.getPrice());
        product.setCategory(productForm.getCategory());
        product.setInfo(productForm.getInfo());
        product.setQuantity(productForm.getQuantity());
        product.setDetailText(productForm.getDetailText());
        productRepository.save(product);

        //옵션 저장
        if (productForm.getOptions() != null && !productForm.getOptions().isEmpty()) {
            List<ProductOption> optionList = new ArrayList<>();
            for (ProductOptionDto dto : productForm.getOptions()) {
                ProductOption option = new ProductOption();
                option.setOptionName(dto.getOptionName());
                option.setPrice(dto.getPrice());
                option.setProduct(product);
                optionList.add(option);
            }
            productOptionRepository.saveAll(optionList);
        }

        // 이미지 저장
        List<ProductImage> imageList = new ArrayList<>();

        if (productForm.getImages() != null) {
            for (MultipartFile file : productForm.getImages()) {
                try {
                    String s3Url = s3Uploader.upload(file, String.valueOf(product.getId()));
                    ProductImage image = new ProductImage();
                    image.setOriginalFileName(file.getOriginalFilename());
                    image.setStoredPath(s3Url);
                    image.setProduct(product);
                    imageList.add(image);
                } catch (IOException e) {
                    throw new RuntimeException("업로드 실패 : " + e.getMessage(), e);
                }
            }
        }
        productImageRepository.saveAll(imageList);
    }

    public Map<String, Object> list(Integer pageNumber, String keyword, String sort) {
        Page<Product> page;

        Pageable pageable = PageRequest.of(pageNumber - 1, 15);
        if ("popular".equals(sort)) {
            if (keyword != null && !keyword.trim().isEmpty()) {
                page = productRepository.findByKeywordOrderByPopularity(keyword, pageable);
            } else {
                page = productRepository.findAllOrderByPopularity(pageable);
            }
        } else {

            Sort sortOption;
            switch (sort) {
                case "price_asc":
                    sortOption = Sort.by(Sort.Direction.ASC, "price");
                    break;
                case "price_desc":
                    sortOption = Sort.by(Sort.Direction.DESC, "price");
                    break;
                // ASC 오름차순 0-9 -> ㄱ-ㅎ 순
                case "category":
                    sortOption = Sort.by(Sort.Direction.ASC, "category");
                    break;
                default:
                    sortOption = Sort.by(Sort.Direction.DESC, "id"); // 최신순

            }
            pageable = PageRequest.of(pageNumber - 1, 15, sortOption);
            // 정렬 조건
            // 키워드확인
            if (keyword != null && !keyword.trim().isEmpty()) {
                page = productRepository.findByKeyword(keyword, pageable);
            } else {
                page = productRepository.findAll(pageable);
            }
        }


        List<ProductDto> content = page.getContent().stream().map(product -> {
            ProductDto dto = new ProductDto();
            dto.setId(product.getId());
            dto.setProductName(product.getProductName());
            dto.setPrice(product.getPrice());
            dto.setQuantity(product.getQuantity());
            dto.setInsertedAt(product.getInsertedAt());
            if (!product.getImages().isEmpty()) {
                dto.setImagePath(List.of(product.getImages().get(0).getStoredPath()));
            }
            return dto;
        }).toList();

        int totalPages = page.getTotalPages();
        int rightPageNumber = ((pageNumber - 1) / 5 + 1) * 5;
        int leftPageNumber = rightPageNumber - 4;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);

        var pageInfo = Map.of(
                "totalPages", totalPages,
                "currentPageNumber", pageNumber,
                "leftPageNumber", leftPageNumber,
                "rightPageNumber", rightPageNumber
        );

        return Map.of(
                "pageInfo", pageInfo,
                "productList", content
        );
    }

    public ProductDto view(Integer id) {
        Product product = productRepository.findById(id).get();
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setInfo(product.getInfo());
        dto.setQuantity(product.getQuantity());
        dto.setDetailText(product.getDetailText());
        dto.setInsertedAt(product.getInsertedAt());

        List<String> imagePaths = product.getImages().stream().map(ProductImage::getStoredPath).toList();

        dto.setImagePath(imagePaths);

        //옵션리스트
        List<ProductOptionDto> options = product.getOptions().stream()
                .map(opt -> {
                    ProductOptionDto option = new ProductOptionDto();
                    option.setOptionName(opt.getOptionName());
                    option.setPrice(opt.getPrice());
                    option.setId(opt.getId());
                    return option;
                }).toList();
        dto.setOptions(options);
        return dto;
    }

    public void delete(Integer id) {
        Product product = productRepository.findById(id).orElseThrow();

        // 상품에 연결된 이미지 전체 삭제 (S3 + DB)
        List<ProductImage> images = product.getImages();
        for (ProductImage image : images) {
            s3Uploader.delete(extractS3Key(image.getStoredPath())); // S3 삭제
            productImageRepository.delete(image); // DB 삭제
        }

        // 상품 삭제
        productRepository.delete(product);
    }


    public void edit(Integer id, ProductEditDto dto) {
        Product product = productRepository.findById(id).get();
        product.setProductName(dto.getProductName());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setInfo(dto.getInfo());
        product.setQuantity(dto.getQuantity());

        // 삭제 처리
        if (dto.getDeletedImages() != null) {
            for (String path : dto.getDeletedImages()) {
                s3Uploader.delete(extractS3Key(path));
                productImageRepository.deleteByStoredPath(path);
            }
        }
        // 파일 저장
        if (dto.getNewImages() != null) {
            List<ProductImage> imageList = new ArrayList<>();

            for (MultipartFile file : dto.getNewImages()) {
                String s3Url = null;
                try {
                    s3Url = s3Uploader.upload(file, String.valueOf(product.getId()));
                    ProductImage image = new ProductImage();
                    image.setOriginalFileName(file.getOriginalFilename());
                    image.setStoredPath(s3Url);
                    image.setProduct(product);
                    imageList.add(image);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            productImageRepository.saveAll(imageList);
        }
    }

    public String order(List<OrderRequest> reqList, String auth) {
        String orderToken = ProductController.OrderTokenGenerator.generateToken();
        String token = auth.replace("Bearer ", "");
        Jwt decoded = jwtDecoder.decode(token);
        String memberIdStr = decoded.getSubject();
        Integer memberId = Integer.parseInt(memberIdStr);
        Member member = memberRepository.findById(memberId).get();


        for (OrderRequest req : reqList) {
            Product product = productRepository.findById(Integer.valueOf(req.getProductId())).get();
            // 재고 차감


            product.setQuantity(product.getQuantity() - req.getQuantity());

            Order order = new Order();
            order.setMember(member);
            order.setMemo(req.getMemo());
            order.setProductName(product.getProductName());
            order.setLoginId(member.getLoginId());
            order.setPhone(member.getPhone());
            order.setMemberName(member.getName());
            order.setShippingAddress(req.getShippingAddress());
            order.setOrderToken(orderToken);
            order.setAddressDetail(req.getAddressDetail());
            order.setZipcode(req.getZipcode());
            order.setTotalPrice(req.getPrice() * req.getQuantity());

            if (req.getOptionId() != null) {
                ProductOption option = productOptionRepository.findById(req.getOptionId()).get();
                order.setOptionName(option.getOptionName());
            }

            orderRepository.save(order);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(req.getQuantity());
            item.setPrice(req.getPrice());

            if (req.getOptionId() != null) {
                ProductOption option = productOptionRepository.findById(req.getOptionId()).get();
                item.setOption(option);
            }

            orderItemRepository.save(item);
        }
        return orderToken;
    }

    public MemberDto getmemberinfo(String auth) {
        String token = auth.replace("Bearer ", "");
        Jwt decoded = jwtDecoder.decode(token);
        Integer memberId = Integer.valueOf(decoded.getSubject());
        Member member = memberRepository.findById(memberId).get();

        MemberDto dto = new MemberDto();
        dto.setLoginId(member.getLoginId());
        dto.setName(member.getName());
        dto.setAddress(member.getAddress());
        dto.setPhone(member.getPhone());
        dto.setZipcode(member.getZipcode());
        dto.setAddressDetail(member.getAddressDetail());

        return dto;

    }

}
