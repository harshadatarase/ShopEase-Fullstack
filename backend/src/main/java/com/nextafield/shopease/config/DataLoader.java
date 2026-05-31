package com.nextafield.shopease.config;

import com.nextafield.shopease.entity.*;
import com.nextafield.shopease.repository.*;
import com.nextafield.shopease.service.ProductService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

@Component
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CustomerRepository customerRepository;
    private final CouponRepository couponRepository;
    private final ProductService productService;

    public DataLoader(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            CustomerRepository customerRepository,
            CouponRepository couponRepository,
            ProductService productService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.customerRepository = customerRepository;
        this.couponRepository = couponRepository;
        this.productService = productService;
    }

    @Override
    public void run(String... args) throws Exception {

        // Only load if database is empty
        if (categoryRepository.count() > 0) {
            System.out.println(
                    "✅ Re-indexing existing products to ES...");
            productRepository.findAll()
                    .forEach(productService::saveProduct);
            System.out.println(
                    "✅ Re-indexing complete!");
            return;
        }

        // Create Category
        Category electronics = new Category();
        electronics.setName("Electronics");
        electronics.setDescription("Electronic items");
        categoryRepository.save(electronics);

        // Create Sub Category
        Category mobiles = new Category();
        mobiles.setName("Mobiles");
        mobiles.setDescription("Mobile phones");
        mobiles.setParent(electronics);
        categoryRepository.save(mobiles);

        // Create Product
        Product product = new Product();
        product.setTitle("iPhone 15");
        product.setDescription("Latest iPhone");
        product.setBrand("Apple");
        product.setStockQuantity(100);
        product.setPrice(new Money(
                new BigDecimal("79999"), "INR"));
        product.setCategory(mobiles);
        productService.saveProduct(product);

        // Create Customer
        Customer customer = new Customer();
        customer.setFirstName("Harshada");
        customer.setLastName("Tarase");
        customer.setEmail("harshada@example.com");
        customer.setPhone("9999999999");
        customer.setAddress(new Address(
                "123 Main St", "Pune",
                "Maharashtra", "411001", "India"));
        customerRepository.save(customer);

        // Create Coupon
        Coupon coupon = new Coupon();
        coupon.setCode("SAVE10");
        coupon.setDiscountType(DiscountType.PERCENTAGE);
        coupon.setDiscountValue(new BigDecimal("10"));
        coupon.setActive(true);
        coupon.setUsageLimit(100);
        coupon.setUsageLimit(100);
        coupon.setUsageCount(0);
        couponRepository.save(coupon);

        System.out.println(
                "✅ Test data loaded successfully!");
    }
}