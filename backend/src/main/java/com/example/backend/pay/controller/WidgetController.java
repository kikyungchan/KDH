package com.example.backend.pay.controller;

import com.example.backend.pay.dto.PaymentConfirmDto;
import com.example.backend.pay.dto.TossPaymentResDto;
import com.example.backend.pay.service.PaymentsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pay")
public class WidgetController {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final ObjectMapper objectMapper;
    private final PaymentsService paymentsService;

    @Value("${toss.secret.key}")
    private String API_KEY_FILE;

    @PostMapping("confirm")
    public ResponseEntity<TossPaymentResDto> confirm(@RequestBody PaymentConfirmDto request,
                                                     Authentication authentication) throws Exception {

        String paymentKey = request.getPaymentKey();
        String orderId = request.getOrderId();
        Long amount = request.getAmount();

        // paymentKey와 orderId는 결제 조회, 취소에 사용되므로 서버(DB)에 저장해둘것
        logger.info("결제 승인 요청 수신 - orderId: {}, amount: {}, paymentKey: {}", orderId, amount, paymentKey);

        // Map 대신 사용
        String requestBodyToToss = objectMapper.writeValueAsString(request);
        logger.info("requestBodyToToss : {}", requestBodyToToss);

        // 시크릭 키 나중에 등록
        String widgetSecretKey = API_KEY_FILE;
        // Base64 인코딩
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        String authorizations = "Basic " + new String(encodedBytes);
        logger.info("authorizations : {}", authorizations);


        // 결제를 승인하면 결제수단에서 금액 차감
        URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("Authorization", authorizations);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);

        try (OutputStream outputStream = connection.getOutputStream()) {
            outputStream.write(requestBodyToToss.getBytes(StandardCharsets.UTF_8));
            outputStream.flush();
        }

        // 서버에서 코드를 받은
        int httpStatusCode = connection.getResponseCode();
        // 성공/실패 여부 isSuccess 에 저장
        boolean isSuccess = httpStatusCode == 200;

        // 성공/실패 시 값 가져오기
        InputStream responseStream = isSuccess ? connection.getInputStream() : connection.getErrorStream();

        TossPaymentResDto tossResponse;
        try (InputStream streamToRead = responseStream) {
            tossResponse = objectMapper.readValue(streamToRead, TossPaymentResDto.class);
            logger.info("토스페이먼츠 응답 HTTP 상태 코드: {}", httpStatusCode);
            logger.info("토스페이먼츠 응답 DTO 내용: {}", tossResponse);
            paymentsService.add(tossResponse, authentication);
        } catch (Exception e) {
            logger.error("토스페이먼츠 응답 파싱 오류 또는 네트워크 문제: {}", e.getMessage(), e);
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new TossPaymentResDto("FAILED", "서버 내부 오류", null));


        }

        return ResponseEntity.status(httpStatusCode).body(tossResponse);

    }

}