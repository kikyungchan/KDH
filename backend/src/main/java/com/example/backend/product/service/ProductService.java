package com.example.backend.product.service;

import com.example.backend.product.dto.ProductDto;
import com.example.backend.product.dto.ProductEditDto;
import com.example.backend.product.entity.Product;
import com.example.backend.product.dto.ProductForm;
import com.example.backend.product.entity.ProductImage;
import com.example.backend.product.repository.ProductImageRepository;
import com.example.backend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final S3Uploader s3Uploader;

    public void add(ProductForm productForm) {
        // 상품 저장
        Product product = new Product();
        product.setProductName(productForm.getProductName());
        product.setPrice(productForm.getPrice());
        product.setCategory(productForm.getCategory());
        product.setInfo(productForm.getInfo());
        product.setQuantity(productForm.getQuantity());
        productRepository.save(product);

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

    public Map<String, Object> list(Integer pageNumber) {
        Pageable pageable = PageRequest.of(pageNumber - 1, 15);
        Page<Product> page = productRepository.findAllByOrderByIdDesc(pageable);


        List<ProductDto> content = page.getContent().stream().map(product -> {
            ProductDto dto = new ProductDto();
            dto.setId(product.getId());
            dto.setProductName(product.getProductName());
            dto.setPrice(product.getPrice());
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

    public ProductDto view(Long id) {
        Product product = productRepository.findById(id).get();
        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setProductName(product.getProductName());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setInfo(product.getInfo());
        dto.setQuantity(product.getQuantity());

        List<String> imagePaths = product.getImages().stream().map(ProductImage::getStoredPath).toList();

        dto.setImagePath(imagePaths);
        return dto;
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id).get();
        productRepository.delete(product);
    }

    // url에서 key만 따오는 메소드
    private String extractS3Key(String url) {
        // 예: https://bucket.s3.region.amazonaws.com/123/abc.jpg -> 123/abc.jpg
        return url.substring(url.indexOf(".com/") + 5);
    }

    public void edit(Long id, ProductEditDto dto) {
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

    private String extractFileName(String path) {
        return path.substring(path.lastIndexOf("/") + 1);
    }
}
