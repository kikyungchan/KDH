package com.example.backend.pay.controller;

import com.example.backend.pay.dto.PaymentConfirmDto;
import com.example.backend.pay.dto.TossPaymentResDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("confirm")
    public ResponseEntity<TossPaymentResDto> confirm(@RequestBody PaymentConfirmDto request) throws Exception {

        System.out.println("도착---------------------------");

        String paymentKey = request.getPaymentKey();
        String orderId = request.getOrderId();
        Long amount = request.getAmount();

        logger.info("결제 승인 요청 수신 - orderId: {}, amount: {}, paymentKey: {}", orderId, amount, paymentKey);

        // Map 대신 사용
        String requestBodyToToss = objectMapper.writeValueAsString(request);

        // 시크릭 키 나중에 등록
        String widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
        // Base64 인코딩
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        String authorizations = "Basic " + new String(encodedBytes);


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
            logger.info("토스페이먼츠 응답 HTTP 상태 코드: {}", httpStatusCode); // 추가
            logger.info("토스페이먼츠 응답 DTO 내용: {}", tossResponse); // 추가
        } catch (Exception e) {
            logger.error("토스페이먼츠 응답 파싱 오류 또는 네트워크 문제: {}", e.getMessage(), e);
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new TossPaymentResDto("FAILED", "서버 내부 오류", null));

        }

        return ResponseEntity.status(httpStatusCode).body(tossResponse);

    }

    /*@RequestMapping(value = "/confirm")
    public ResponseEntity<JSONObject> confirmPayment(@RequestBody String jsonBody) throws Exception {

        JSONParser parser = new JSONParser();
        String orderId;
        String amount;
        String paymentKey;
        try {
            // 클라이언트에서 받은 JSON 요청 바디입니다.
            JSONObject requestData = (JSONObject) parser.parse(jsonBody);
            paymentKey = (String) requestData.get("paymentKey");
            orderId = (String) requestData.get("orderId");
            amount = (String) requestData.get("amount");
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        ;
        JSONObject obj = new JSONObject();
        obj.put("orderId", orderId);
        obj.put("amount", amount);
        obj.put("paymentKey", paymentKey);

        // 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
        // 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
        String widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
        Base64.Encoder encoder = Base64.getEncoder();
        byte[] encodedBytes = encoder.encode((widgetSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        String authorizations = "Basic " + new String(encodedBytes);

        // 결제를 승인하면 결제수단에서 금액이 차감돼요.
        URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestProperty("Authorization", authorizations);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);

        OutputStream outputStream = connection.getOutputStream();
        outputStream.write(obj.toString().getBytes("UTF-8"));

        int code = connection.getResponseCode();
        boolean isSuccess = code == 200;

        InputStream responseStream = isSuccess ? connection.getInputStream() : connection.getErrorStream();

        // 결제 성공 및 실패 비즈니스 로직을 구현하세요.
        Reader reader = new InputStreamReader(responseStream, StandardCharsets.UTF_8);
        JSONObject jsonObject = (JSONObject) parser.parse(reader);
        responseStream.close();

        return ResponseEntity.status(code).body(jsonObject);
    }*/

}