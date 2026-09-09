package com.example.demo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;

    @Value("${supabase.jwt.secret:}")
    private String jwtSecret;

    @Value("${supabase.anon.key:}")
    private String supabaseAnonKey;

    @Value("${app.security.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(
                    "/api/auth/**",
                    "/api/webhook/whatsapp/**",
                    "/api/webhook/paystack/**",
                    "/actuator/health/**",
                    "/actuator/info",
                    "/v3/api-docs/**",
                    "/swagger-ui.html",
                    "/swagger-ui/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint((request, response, authException) -> {
                    System.out.println("Authentication failed: " + authException.getMessage());
                    response.setStatus(401);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}");
                })
            );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return token -> {
            String alg = "unknown";
            try {
                alg = com.nimbusds.jwt.SignedJWT.parse(token).getHeader().getAlgorithm().getName();
                System.out.println(">>> SECURITY DEBUG: Incoming Token Algorithm: " + alg);
            } catch (Exception e) {
                System.out.println(">>> SECURITY DEBUG: Failed to parse token header: " + e.getMessage());
            }

            // 1. Try HS256 (Symmetric)
            if ("HS256".equals(alg)) {
                try {
                    String secret = jwtSecret;
                    if (secret == null || secret.isEmpty() || secret.startsWith("${")) {
                        secret = System.getenv("SUPABASE_JWT_SECRET");
                    }
                    if (secret == null || secret.isEmpty()) {
                        secret = System.getProperty("SUPABASE_JWT_SECRET");
                    }

                    if (secret != null && !secret.isEmpty()) {
                        // Supabase's JWT secret is already the HMAC key (even if it looks Base64-ish).
                        // Using Base64-decoded bytes leads to a bad signature and 401s.
                        SecretKey spec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");

                        NimbusJwtDecoder hsDecoder = NimbusJwtDecoder.withSecretKey(spec)
                            .macAlgorithm(org.springframework.security.oauth2.jose.jws.MacAlgorithm.HS256)
                            .build();
                        
                        hsDecoder.setJwtValidator(new org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator<>(
                            new org.springframework.security.oauth2.jwt.JwtTimestampValidator(),
                            jwt -> org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.success()
                        ));
                        
                        return hsDecoder.decode(token);
                    }
                } catch (Exception e) {
                    System.out.println(">>> SECURITY DEBUG: HS256 verification failed: " + e.getMessage());
                }
            }

            // 2. Try JWKS (Asymmetric - supports ES256, RS256, etc.)
            try {
                if (jwkSetUri == null || jwkSetUri.isBlank() || jwkSetUri.startsWith("${")) {
                    throw new org.springframework.security.oauth2.jwt.BadJwtException("JWT_JWK_SET_URI is not configured");
                }
                
                // Supabase JWKS is public; no API key needed in the URL
                
                System.out.println(">>> SECURITY DEBUG: Attempting JWKS Verification at endpoint with key.");
                
                NimbusJwtDecoder.JwkSetUriJwtDecoderBuilder builder = NimbusJwtDecoder.withJwkSetUri(jwkSetUri);
                
                // Explicitly allow ES256 if detected
                if ("ES256".equals(alg)) {
                    builder.jwsAlgorithm(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.ES256);
                } else if ("RS256".equals(alg)) {
                    builder.jwsAlgorithm(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.RS256);
                }
                
                NimbusJwtDecoder rsDecoder = builder.build();
                
                // Add relaxed validator
                rsDecoder.setJwtValidator(new org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator<>(
                    new org.springframework.security.oauth2.jwt.JwtTimestampValidator(),
                    jwt -> org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.success()
                ));

                return rsDecoder.decode(token);
            } catch (Exception e) {
                System.err.println(">>> SECURITY ERROR: All decoding attempts failed. Error: " + e.getMessage());
                throw new org.springframework.security.oauth2.jwt.BadJwtException("Invalid token: Could not verify with HS256 or JWKS. " + e.getMessage(), e);
            }
        };
    }

    private org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter jwtAuthenticationConverter() {
        org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter converter = new org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter();
        // Since Supabase uses 'sub' for the user UID, we can stick with default if it uses sub, 
        // but we want to ensure any @AuthenticationPrincipal injection works with the subject string.
        return converter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(parseCsv(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        configuration.setExposedHeaders(Arrays.asList("Access-Control-Allow-Origin"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private List<String> parseCsv(String csv) {
        if (csv == null || csv.isBlank()) {
            return List.of("http://localhost:3000");
        }
        return Arrays.stream(csv.split(","))
            .map(String::trim)
            .filter(value -> !value.isBlank())
            .toList();
    }
}
