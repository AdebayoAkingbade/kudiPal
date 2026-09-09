package com.example.demo.marketplace.service;

import com.example.demo.marketplace.dto.IntentDetectionResult;
import com.example.demo.marketplace.dto.SellerMatchResult;
import com.example.demo.marketplace.entity.MarketplaceProduct;
import com.example.demo.marketplace.entity.MarketplaceUser;
import com.example.demo.marketplace.repository.MarketplaceProductRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SellerMatchingServiceTest {

    private final MarketplaceProductRepository productRepository = mock(MarketplaceProductRepository.class);
    private final SellerMatchingService service = new SellerMatchingService(productRepository);

    @Test
    void ranksTopThreeSellersUsingConfiguredWeights() {
        MarketplaceProduct lekkiGoodPrice = product("Timberland brown shoe", 34000, seller("Lekki Boots", "Lekki", "4.5"));
        MarketplaceProduct farCheap = product("Timberland brown shoe", 30000, seller("Mainland Shoes", "Yaba", "5.0"));
        MarketplaceProduct lekkiExpensive = product("Timberland brown shoe", 37000, seller("Island Store", "Lekki Phase 1", "4.0"));
        MarketplaceProduct irrelevant = product("Leather belt", 5000, seller("Belt Shop", "Lekki", "5.0"));

        when(productRepository.findByActiveTrue()).thenReturn(List.of(farCheap, irrelevant, lekkiExpensive, lekkiGoodPrice));

        IntentDetectionResult request = new IntentDetectionResult();
        request.setIntent("BUY_REQUEST");
        request.setProduct("timberland brown shoe");
        request.setBudget(35000);
        request.setLocation("Lekki");

        List<SellerMatchResult> matches = service.findTopMatches(request);

        assertEquals(3, matches.size());
        assertEquals("Lekki Boots", matches.get(0).getSellerName());
        assertEquals("Island Store", matches.get(1).getSellerName());
        assertEquals("Mainland Shoes", matches.get(2).getSellerName());
    }

    private MarketplaceProduct product(String name, long price, MarketplaceUser seller) {
        MarketplaceProduct product = new MarketplaceProduct();
        product.setName(name);
        product.setPrice(price);
        product.setActive(true);
        product.setUser(seller);
        return product;
    }

    private MarketplaceUser seller(String businessName, String location, String rating) {
        MarketplaceUser seller = new MarketplaceUser();
        seller.setId(UUID.randomUUID());
        seller.setPhone("2348012345678");
        seller.setBusinessName(businessName);
        seller.setLocation(location);
        seller.setRating(new BigDecimal(rating));
        seller.setActive(true);
        return seller;
    }
}
