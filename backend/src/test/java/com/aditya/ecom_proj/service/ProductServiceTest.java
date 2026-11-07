package com.aditya.ecom_proj.service;

import com.aditya.ecom_proj.model.Product;
import com.aditya.ecom_proj.repository.ProductRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepo repo;

    @InjectMocks
    private ProductService service;

    @Test
    void shouldReturnAllProducts() {
        List<Product> products = List.of(new Product(), new Product());

        when(repo.findAll()).thenReturn(products);

        List<Product> result = service.getAllProducts();

        assertEquals(2, result.size());
        verify(repo).findAll();
    }

    @Test
    void shouldReturnProductById() {
        Product product = new Product();

        when(repo.findById(1)).thenReturn(Optional.of(product));

        Optional<Product> result = service.getProductById(1);

        assertTrue(result.isPresent());
        assertSame(product, result.get());
        verify(repo).findById(1);
    }

    @Test
    void shouldDeleteExistingProduct() {
        Product product = new Product();

        when(repo.findById(1)).thenReturn(Optional.of(product));

        service.deleteProduct(1);

        verify(repo).delete(product);
    }

    @Test
    void shouldThrowExceptionWhenDeletingMissingProduct() {
        when(repo.findById(99)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.deleteProduct(99)
        );

        assertEquals("Product not found with id: 99", exception.getMessage());
        verify(repo, never()).delete(any(Product.class));
    }
}
