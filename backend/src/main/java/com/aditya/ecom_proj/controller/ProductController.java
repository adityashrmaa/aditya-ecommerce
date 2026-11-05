
package com.aditya.ecom_proj.controller;

import com.aditya.ecom_proj.model.Product;
import com.aditya.ecom_proj.service.ProductService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(service.getAllProducts());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {

        return service.getProductById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> addProduct(
            @RequestPart("product") Product product,
            @RequestPart("imageFile") MultipartFile imageFile) throws IOException {

        Product savedProduct = service.addProduct(product, imageFile);

        return ResponseEntity.ok(savedProduct);
    }


    @GetMapping("/products/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Integer id) {

        return service.getProductById(id)
                .filter(product -> product.getImageData() != null
                        && product.getImageData().length > 0)
                .map(product -> {

                    MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

                    try {
                        if (product.getImageType() != null) {
                            mediaType = MediaType.parseMediaType(
                                    product.getImageType()
                            );
                        }
                    } catch (IllegalArgumentException ignored) {
                        // Use default media type if stored type is invalid
                    }

                    return ResponseEntity.ok()
                            .contentType(mediaType)
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                            .body(product.getImageData());
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping(
            value = "/products/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Product> updateProduct(
            @PathVariable Integer id,
            @RequestPart("product") Product product,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) throws IOException {

        Product updatedProduct = service.updateProduct(id, product, imageFile);

        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        service.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
