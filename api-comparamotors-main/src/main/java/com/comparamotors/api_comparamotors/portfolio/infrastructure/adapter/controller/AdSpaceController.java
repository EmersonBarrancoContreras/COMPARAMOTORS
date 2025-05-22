package com.comparamotors.api_comparamotors.portfolio.infrastructure.adapter.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.comparamotors.api_comparamotors.portfolio.application.dto.AdSpaceDTO;
import com.comparamotors.api_comparamotors.portfolio.application.port.input.AdSpaceService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/ad-spaces")
@RequiredArgsConstructor
public class AdSpaceController {
    private final AdSpaceService adSpaceService;

    @GetMapping
    public ResponseEntity<List<AdSpaceDTO>> getAllAdSpaces() {
        return ResponseEntity.ok(adSpaceService.getAllAdSpaces());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdSpaceDTO> getAdSpaceById(@PathVariable Long id) {
        return ResponseEntity.ok(adSpaceService.getAdSpaceById(id));
    }

    @PostMapping
    public ResponseEntity<AdSpaceDTO> createAdSpace(@Valid @RequestBody AdSpaceDTO adSpaceDTO) {
        return ResponseEntity.ok(adSpaceService.createAdSpace(adSpaceDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdSpaceDTO> updateAdSpace(@PathVariable Long id, @RequestBody AdSpaceDTO adSpaceDTO) {
        return ResponseEntity.ok(adSpaceService.updateAdSpace(id, adSpaceDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdSpace(@PathVariable Long id) {
        adSpaceService.deleteAdSpace(id);
        return ResponseEntity.noContent().build();
    }
}