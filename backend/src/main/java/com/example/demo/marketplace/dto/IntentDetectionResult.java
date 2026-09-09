package com.example.demo.marketplace.dto;

public class IntentDetectionResult {
    private String intent;
    private String product;
    private long budget;
    private String location;
    private long amount;
    private int quantity;
    private String command;
    private double confidence;
    private String source;

    public IntentDetectionResult() {
    }

    public IntentDetectionResult(String intent, String product, long budget, String location, double confidence, String source) {
        this.intent = intent;
        this.product = product;
        this.budget = budget;
        this.location = location;
        this.confidence = confidence;
        this.source = source;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public long getBudget() {
        return budget;
    }

    public void setBudget(long budget) {
        this.budget = budget;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getCommand() {
        return command;
    }

    public void setCommand(String command) {
        this.command = command;
    }

    public double getConfidence() {
        return confidence;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
