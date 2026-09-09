package com.example.demo.marketplace.service;

import com.example.demo.dto.BuyRequestIntentResponse;
import com.example.demo.marketplace.dto.IntentDetectionResult;
import com.example.demo.marketplace.entity.PromptVersion;
import com.example.demo.marketplace.entity.TrainingExample;
import com.example.demo.marketplace.repository.TrainingExampleRepository;
import com.example.demo.service.BuyRequestExtractionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class MarketplaceIntentService {

    private final BuyRequestExtractionService fallbackExtractor;
    private final OpenAiStructuredExtractionService openAiStructuredExtractionService;
    private final PromptTuningService promptTuningService;
    private final TrainingExampleRepository trainingExampleRepository;

    public MarketplaceIntentService(BuyRequestExtractionService fallbackExtractor,
                                    OpenAiStructuredExtractionService openAiStructuredExtractionService,
                                    PromptTuningService promptTuningService,
                                    TrainingExampleRepository trainingExampleRepository) {
        this.fallbackExtractor = fallbackExtractor;
        this.openAiStructuredExtractionService = openAiStructuredExtractionService;
        this.promptTuningService = promptTuningService;
        this.trainingExampleRepository = trainingExampleRepository;
    }

    @Transactional
    public IntentDetectionResult detect(String message) {
        PromptVersion promptVersion = promptTuningService.getActivePrompt();

        BuyRequestIntentResponse fallback = fallbackExtractor.extract(message);
        IntentDetectionResult fallbackResult = new IntentDetectionResult(
            fallback.getIntent(),
            fallback.getProduct(),
            fallback.getBudget(),
            fallback.getLocation(),
            "BUY_REQUEST".equalsIgnoreCase(fallback.getIntent()) ? 0.87 : 0.30,
            "RULES"
        );

        IntentDetectionResult finalResult = fallbackResult;
        boolean incompleteRuleMatch = "BUY_REQUEST".equalsIgnoreCase(fallback.getIntent())
            && (fallback.getProduct().isBlank() || fallback.getBudget() <= 0 || fallback.getLocation().isBlank());

        if (!"BUY_REQUEST".equalsIgnoreCase(fallback.getIntent()) || incompleteRuleMatch) {
            IntentDetectionResult openAiResult = openAiStructuredExtractionService.extract(message, promptVersion);
            if (openAiResult != null && isSupportedIntent(openAiResult.getIntent())) {
                finalResult = openAiResult;
            }
        }

        storeTrainingExample(message, finalResult, promptVersion);
        return finalResult;
    }

    private void storeTrainingExample(String message, IntentDetectionResult result, PromptVersion promptVersion) {
        TrainingExample example = new TrainingExample();
        example.setRawMessage(message);
        example.setDetectedIntent(result.getIntent());
        example.setExtractedProduct(result.getProduct());
        example.setExtractedBudget(result.getBudget());
        example.setExtractedLocation(result.getLocation());
        example.setSource(result.getSource());
        example.setConfidence(BigDecimal.valueOf(result.getConfidence()));
        example.setPromptVersion(promptVersion);
        trainingExampleRepository.save(example);
    }

    private boolean isSupportedIntent(String intent) {
        return intent != null && switch (intent.toUpperCase()) {
            case "BUY_REQUEST", "SELLER_ACCEPT", "SELLER_DECLINE", "RECORD_SALE", "CREATE_INVOICE",
                 "CUSTOMER_SUPPORT", "INVENTORY_UPDATE", "UNKNOWN" -> true;
            default -> false;
        };
    }
}
