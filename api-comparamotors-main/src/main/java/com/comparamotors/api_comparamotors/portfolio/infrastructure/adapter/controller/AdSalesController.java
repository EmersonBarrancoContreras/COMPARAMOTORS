package com.comparamotors.api_comparamotors.portfolio.infrastructure.adapter.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.comparamotors.api_comparamotors.portfolio.application.dto.AdSalesDTO;
import com.comparamotors.api_comparamotors.portfolio.application.port.input.AdSalesService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/ad-sales")
@RequiredArgsConstructor
public class AdSalesController {
    private final AdSalesService adSalesService;

    @GetMapping
    public ResponseEntity<List<AdSalesDTO>> getAllAdSales() {
        return ResponseEntity.ok(adSalesService.getAllAdSales());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdSalesDTO> getAdSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(adSalesService.getAdSaleById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AdSalesDTO>> getAdSalesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(adSalesService.getAdSalesByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<AdSalesDTO> createAdSale(@Valid @RequestBody AdSalesDTO adSalesDTO) {
        return ResponseEntity.ok(adSalesService.createAdSale(adSalesDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdSalesDTO> updateAdSale(@PathVariable Long id, @RequestBody AdSalesDTO adSalesDTO) {
        return ResponseEntity.ok(adSalesService.updateAdSale(id, adSalesDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdSale(@PathVariable Long id) {
        adSalesService.deleteAdSale(id);
        return ResponseEntity.noContent().build();
    }
}