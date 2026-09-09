package com.example.demo.marketplace.repository;

import com.example.demo.marketplace.entity.MerchantWhatsAppChannel;
import com.example.demo.marketplace.entity.MarketplaceUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MerchantWhatsAppChannelRepository extends JpaRepository<MerchantWhatsAppChannel, UUID> {
    Optional<MerchantWhatsAppChannel> findByPhoneNumberId(String phoneNumberId);

    List<MerchantWhatsAppChannel> findByUserOrderByCreatedAtDesc(MarketplaceUser user);

    Optional<MerchantWhatsAppChannel> findByUserAndDefaultChannelTrue(MarketplaceUser user);
}
