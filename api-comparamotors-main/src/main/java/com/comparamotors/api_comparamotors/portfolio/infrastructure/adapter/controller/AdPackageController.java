package com.comparamotors.api_comparamotors.portfolio.infrastructure.adapter.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.comparamotors.api_comparamotors.portfolio.application.dto.AdPackageDTO;
import com.comparamotors.api_comparamotors.portfolio.application.port.input.AdPackageService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/ad-packages")
@RequiredArgsConstructor
public class AdPackageController {
    private final AdPackageService adPackageService;

    @GetMapping
    public ResponseEntity<List<AdPackageDTO>> getAllAdPackages() {
        return ResponseEntity.ok(adPackageService.getAllAdPackages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdPackageDTO> getAdPackageById(@PathVariable Long id) {
        return ResponseEntity.ok(adPackageService.getAdPackageById(id));
    }

    @PostMapping
    public ResponseEntity<AdPackageDTO> createAdPackage(@Valid @RequestBody AdPackageDTO adPackageDTO) {
        return ResponseEntity.ok(adPackageService.createAdPackage(adPackageDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdPackageDTO> updateAdPackage(@PathVariable Long id, @RequestBody AdPackageDTO adPackageDTO) {
        return ResponseEntity.ok(adPackageService.updateAdPackage(id, adPackageDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdPackage(@PathVariable Long id) {
        adPackageService.deleteAdPackage(id);
        return ResponseEntity.noContent().build();
    }
}
