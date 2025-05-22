package com.comparamotors.api_comparamotors.advertisement.infrastructure.adapter.repository;

import jakarta.persistence.*;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.comparamotors.api_comparamotors.advertisement.application.port.output.AdvertisementRepository;
import com.comparamotors.api_comparamotors.advertisement.domain.model.Advertisement;

@Repository
@RequiredArgsConstructor
public class JpaAdvertisementRepository implements AdvertisementRepository{
    
    private final EntityManager entityManager;

    @Override
    public Advertisement save(Advertisement advertisement) {
        if (advertisement.getId() == null) {
            entityManager.persist(advertisement);
            return advertisement;
        }
        return entityManager.merge(advertisement);
    }

    @Override
    public Optional<Advertisement> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Advertisement.class, id));
    }

    @Override
    public List<Advertisement> findAll() {
        return entityManager.createQuery("SELECT a FROM Advertisement a ORDER BY a.publishedAt DESC", Advertisement.class)
            .getResultList();
    }

    @Override
    public void deleteById(Long id) {
        Advertisement advertisement = entityManager.find(Advertisement.class, id);
        if (advertisement != null) {
            entityManager.remove(advertisement);
        }
    }
}