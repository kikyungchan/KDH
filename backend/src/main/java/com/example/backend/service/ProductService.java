package com.example.backend.service;

import com.example.backend.dto.ProductDto;
import com.example.backend.entity.Product;
import com.example.backend.dto.ProductForm;
import com.example.backend.entity.ProductImage;
import com.example.backend.repository.ProductImageRepository;
import com.example.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

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
        for (MultipartFile file : productForm.getImages()) {
            String originalFileName = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String storedName = uuid + "_" + originalFileName;
            String uploadDir = "C:/Temp/prj4/productFile";

            File savedFile = new File(uploadDir, storedName);
            try {
                file.transferTo(savedFile);
            } catch (IOException e) {
                throw new RuntimeException("파일 저장에 실패했습니다");
            }

            ProductImage image = new ProductImage();
            image.setOriginalFileName(originalFileName);
            image.setStoredPath(uploadDir + "/" + storedName);
            image.setProduct(product);
            imageList.add(image);

        }
        // 이미지 DB에 저장
        productImageRepository.saveAll(imageList);
    }

    public List<ProductDto> list() {
        List<Product> products = productRepository.findAll();
        List<ProductDto> result = new ArrayList<>();

        for (Product product : products) {
            ProductDto dto = new ProductDto();
            dto.setId(product.getId());
            dto.setProductName(product.getProductName());
            dto.setPrice(product.getPrice());
            if (!product.getImages().isEmpty()) {
                dto.setImagePath(List.of(product.getImages().get(0).getStoredPath()));
            }
            result.add(dto);
        }
        return result;

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
}
