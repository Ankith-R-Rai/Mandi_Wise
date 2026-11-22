package com.mandiwise.recommendation.dto;

import java.math.BigDecimal;

public class CalculationBreakdown {

    private BigDecimal quantityKg;
    private BigDecimal quantityQuintals;
    private BigDecimal modalPricePerQuintal;
    private BigDecimal grossRevenue;
    private BigDecimal roadDistanceKm;
    private BigDecimal costPerKm;
    private BigDecimal transportCost;
    private BigDecimal mandiCess;
    private BigDecimal handlingCharge;
    private BigDecimal spoilageAllowance;
    private BigDecimal totalDeductions;
    private BigDecimal netEarnings;
    private BigDecimal profitMarginPercent;
    private BigDecimal netRatePerKg;

    public CalculationBreakdown() {}

    public BigDecimal getQuantityKg() {
        return quantityKg;
    }

    public void setQuantityKg(BigDecimal quantityKg) {
        this.quantityKg = quantityKg;
    }

    public BigDecimal getQuantityQuintals() {
        return quantityQuintals;
    }

    public void setQuantityQuintals(BigDecimal quantityQuintals) {
        this.quantityQuintals = quantityQuintals;
    }

    public BigDecimal getModalPricePerQuintal() {
        return modalPricePerQuintal;
    }

    public void setModalPricePerQuintal(BigDecimal modalPricePerQuintal) {
        this.modalPricePerQuintal = modalPricePerQuintal;
    }

    public BigDecimal getGrossRevenue() {
        return grossRevenue;
    }

    public void setGrossRevenue(BigDecimal grossRevenue) {
        this.grossRevenue = grossRevenue;
    }

    public BigDecimal getRoadDistanceKm() {
        return roadDistanceKm;
    }

    public void setRoadDistanceKm(BigDecimal roadDistanceKm) {
        this.roadDistanceKm = roadDistanceKm;
    }

    public BigDecimal getCostPerKm() {
        return costPerKm;
    }

    public void setCostPerKm(BigDecimal costPerKm) {
        this.costPerKm = costPerKm;
    }

    public BigDecimal getTransportCost() {
        return transportCost;
    }

    public void setTransportCost(BigDecimal transportCost) {
        this.transportCost = transportCost;
    }

    public BigDecimal getMandiCess() {
        return mandiCess;
    }

    public void setMandiCess(BigDecimal mandiCess) {
        this.mandiCess = mandiCess;
    }

    public BigDecimal getHandlingCharge() {
        return handlingCharge;
    }

    public void setHandlingCharge(BigDecimal handlingCharge) {
        this.handlingCharge = handlingCharge;
    }

    public BigDecimal getSpoilageAllowance() {
        return spoilageAllowance;
    }

    public void setSpoilageAllowance(BigDecimal spoilageAllowance) {
        this.spoilageAllowance = spoilageAllowance;
    }

    public BigDecimal getTotalDeductions() {
        return totalDeductions;
    }

    public void setTotalDeductions(BigDecimal totalDeductions) {
        this.totalDeductions = totalDeductions;
    }

    public BigDecimal getNetEarnings() {
        return netEarnings;
    }

    public void setNetEarnings(BigDecimal netEarnings) {
        this.netEarnings = netEarnings;
    }

    public BigDecimal getProfitMarginPercent() {
        return profitMarginPercent;
    }

    public void setProfitMarginPercent(BigDecimal profitMarginPercent) {
        this.profitMarginPercent = profitMarginPercent;
    }

    public BigDecimal getNetRatePerKg() {
        return netRatePerKg;
    }

    public void setNetRatePerKg(BigDecimal netRatePerKg) {
        this.netRatePerKg = netRatePerKg;
    }
}
