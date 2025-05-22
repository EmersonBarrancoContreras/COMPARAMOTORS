package com.comparamotors.api_comparamotors.portfolio.application.port.input;

import java.util.List;

import com.comparamotors.api_comparamotors.portfolio.application.dto.AdSalesDTO;

public interface AdSalesService {
    List<AdSalesDTO> getAllAdSales();
    AdSalesDTO getAdSaleById(Long id);
    AdSalesDTO createAdSale(AdSalesDTO adSalesDTO);
    AdSalesDTO updateAdSale(Long id, AdSalesDTO adSalesDTO);
    void deleteAdSale(Long id);
    List<AdSalesDTO> getAdSalesByUserId(Long userId);
}