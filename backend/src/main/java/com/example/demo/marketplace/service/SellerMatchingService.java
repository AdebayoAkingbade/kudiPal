package com.example.demo.marketplace.service;

import com.example.demo.marketplace.dto.IntentDetectionResult;
import com.example.demo.marketplace.dto.SellerMatchResult;
import com.example.demo.marketplace.entity.MarketplaceProduct;
import com.example.demo.marketplace.entity.MarketplaceUser;
import com.example.demo.marketplace.repository.MarketplaceProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class SellerMatchingService {

    private final MarketplaceProductRepository marketplaceProductRepository;

    public SellerMatchingService(MarketplaceProductRepository marketplaceProductRepository) {
        this.marketplaceProductRepository = marketplaceProductRepository;
    }

    public List<SellerMatchResult> findTopMatches(IntentDetectionResult request) {
        List<MarketplaceProduct> products = marketplaceProductRepository.findByActiveTrue();
        List<SellerMatchResult> ranked = new ArrayList<>();

        for (MarketplaceProduct product : products) {
            if (!product.getUser().isActive()) {
                continue;
            }

            double productRelevance = overlapScore(request.getProduct(), product.getName());
            if (productRelevance <= 0.20) {
                continue;
            }

            double distanceScore = locationScore(request.getLocation(), product.getUser().getLocation());
            double priceScore = priceScore(request.getBudget(), product.getPrice());
            double reputationScore = normalizeRating(product.getUser().getRating());
            double responseSpeedScore = responseSpeedScore(product.getUser());

            double totalScore = (distanceScore * 0.40)
                + (priceScore * 0.30)
                + (reputationScore * 0.20)
                + (responseSpeedScore * 0.10);

            SellerMatchResult result = new SellerMatchResult();
            result.setSellerId(product.getUser().getId());
            result.setSellerName(product.getUser().getBusinessName());
            result.setSellerPhone(product.getUser().getPhone());
            result.setLocation(defaultString(product.getUser().getLocation()));
            result.setPrice(product.getPrice());
            result.setRating(product.getUser().getRating() == null ? 0 : product.getUser().getRating().doubleValue());
            result.setScore(totalScore);
            result.setProductName(product.getName());
            ranked.add(result);
        }

        ranked.sort(Comparator
            .comparingDouble(SellerMatchResult::getScore).reversed()
            .thenComparingLong(SellerMatchResult::getPrice));

        return ranked.stream().limit(3).toList();
    }

    private double overlapScore(String requestedProduct, String sellerProduct) {
        Set<String> requestTokens = tokenize(requestedProduct);
        Set<String> sellerTokens = tokenize(sellerProduct);
        if (requestTokens.isEmpty() || sellerTokens.isEmpty()) {
            return 0;
        }

        long overlap = requestTokens.stream().filter(sellerTokens::contains).count();
        return (double) overlap / (double) requestTokens.size();
    }

    private double locationScore(String requestLocation, String sellerLocation) {
        Set<String> requestTokens = tokenize(requestLocation);
        Set<String> sellerTokens = tokenize(sellerLocation);
        if (requestTokens.isEmpty() || sellerTokens.isEmpty()) {
            return 0.10;
        }

        if (requestLocation.equalsIgnoreCase(sellerLocation)) {
            return 1.0;
        }

        long overlap = requestTokens.stream().filter(sellerTokens::contains).count();
        if (overlap > 0) {
            return 0.65;
        }

        return 0.15;
    }

    private double priceScore(long budget, long price) {
        if (budget <= 0) {
            return 0.50;
        }
        if (price <= budget) {
            double delta = (double) (budget - price) / (double) budget;
            return BigDecimal.valueOf(0.75 + Math.min(delta, 0.25)).setScale(3, RoundingMode.HALF_UP).doubleValue();
        }

        double overBudgetRatio = (double) (price - budget) / (double) budget;
        return Math.max(0.10, 0.70 - overBudgetRatio);
    }

    private double normalizeRating(BigDecimal rating) {
        if (rating == null) {
            return 0.50;
        }
        return Math.min(1.0, rating.doubleValue() / 5.0);
    }

    private double responseSpeedScore(MarketplaceUser seller) {
        return 0.70;
    }

    private Set<String> tokenize(String value) {
        if (value == null || value.isBlank()) {
            return Set.of();
        }

        String[] parts = value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\s]", " ").split("\\s+");
        Set<String> tokens = new HashSet<>();
        for (String part : parts) {
            if (!part.isBlank()) {
                tokens.add(part);
            }
        }
        return tokens;
    }

    private String defaultString(String value) {
        return value == null ? "" : value;
    }
}
