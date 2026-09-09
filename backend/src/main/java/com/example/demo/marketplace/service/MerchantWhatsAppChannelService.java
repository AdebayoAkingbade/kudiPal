package com.example.demo.marketplace.service;

import com.example.demo.marketplace.dto.RegisterWhatsAppChannelRequest;
import com.example.demo.marketplace.dto.WhatsAppChannelResponse;
import com.example.demo.marketplace.entity.MerchantWhatsAppChannel;
import com.example.demo.marketplace.entity.MarketplaceUser;
import com.example.demo.marketplace.repository.MerchantWhatsAppChannelRepository;
import com.example.demo.marketplace.repository.MarketplaceUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MerchantWhatsAppChannelService {

    private final MarketplacePhoneNumberService phoneNumberService;
    private final MarketplaceUserRepository userRepository;
    private final MerchantWhatsAppChannelRepository channelRepository;

    public MerchantWhatsAppChannelService(MarketplacePhoneNumberService phoneNumberService,
                                          MarketplaceUserRepository userRepository,
                                          MerchantWhatsAppChannelRepository channelRepository) {
        this.phoneNumberService = phoneNumberService;
        this.userRepository = userRepository;
        this.channelRepository = channelRepository;
    }

    @Transactional
    public WhatsAppChannelResponse registerChannel(RegisterWhatsAppChannelRequest request) {
        String normalizedSellerPhone = phoneNumberService.normalize(request.sellerPhone());
        MarketplaceUser user = userRepository.findByPhone(normalizedSellerPhone).orElseGet(MarketplaceUser::new);
        user.setPhone(normalizedSellerPhone);
        user.setBusinessName(request.businessName());
        user.setLocation(request.location());
        user.setActive(true);
        MarketplaceUser savedUser = userRepository.save(user);

        MerchantWhatsAppChannel channel = channelRepository.findByPhoneNumberId(request.phoneNumberId())
            .orElseGet(MerchantWhatsAppChannel::new);
        channel.setUser(savedUser);
        channel.setPhoneNumberId(request.phoneNumberId());
        channel.setDisplayPhoneNumber(phoneNumberService.normalize(request.displayPhoneNumber()));
        channel.setWabaId(request.wabaId());
        channel.setBusinessPortfolioId(request.businessPortfolioId());
        channel.setAccessTokenSecretRef(request.accessTokenSecretRef());
        channel.setVerifyToken(request.verifyToken());
        channel.setStatus("ACTIVE");
        channel.setWebhookSubscribed(true);
        channel.setDefaultChannel(request.defaultChannel());

        if (request.defaultChannel()) {
            channelRepository.findByUserAndDefaultChannelTrue(savedUser)
                .filter(existing -> !existing.getPhoneNumberId().equals(request.phoneNumberId()))
                .ifPresent(existing -> {
                    existing.setDefaultChannel(false);
                    channelRepository.save(existing);
                });
        }

        return WhatsAppChannelResponse.from(channelRepository.save(channel));
    }

    @Transactional(readOnly = true)
    public Optional<MerchantWhatsAppChannel> findByPhoneNumberId(String phoneNumberId) {
        if (phoneNumberId == null || phoneNumberId.isBlank()) {
            return Optional.empty();
        }
        return channelRepository.findByPhoneNumberId(phoneNumberId);
    }

    @Transactional(readOnly = true)
    public List<WhatsAppChannelResponse> listChannelsForSeller(String sellerPhone) {
        String normalizedSellerPhone = phoneNumberService.normalize(sellerPhone);
        return userRepository.findByPhone(normalizedSellerPhone)
            .map(channelRepository::findByUserOrderByCreatedAtDesc)
            .orElse(List.of())
            .stream()
            .map(WhatsAppChannelResponse::from)
            .toList();
    }
}
