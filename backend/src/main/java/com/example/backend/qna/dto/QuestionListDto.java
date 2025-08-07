package com.example.backend.qna.dto;

import com.example.backend.product.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionListDto {
    private Integer id;
    private String title;
    //    private Product Product;
    private String status;
    private String name;
    private int category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getTimesAgo() {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDateTime createdAt = this.getCreatedAt();

        Duration duration = Duration.between(createdAt, now);

        long seconds = duration.toSeconds();

        if (seconds < 60) {
            return "방금 전";
        } else if (seconds < 60 * 60) { // 1 시간
            long minutes = seconds / 60;
            return minutes + "분 전";
        } else if (seconds < 60 * 60 * 24) { // 1 일
            long hours = seconds / 3600;
            return hours + "시간 전";
        } else if (seconds < 60 * 60 * 24 * 7) { // 1주일
            long days = seconds / (3600 * 24);
            return days + "일 전";
        } else if (seconds < 60 * 60 * 24 * 7 * 4) { // 4주
            long weeks = seconds / (3600 * 24 * 7);
            return weeks + "주 전";
        } else {
            // Period를 사용하여 정확한 월/년 계산
            java.time.Period period = java.time.Period.between(createdAt.toLocalDate(), now.toLocalDate());
            int years = period.getYears();
            int months = period.getMonths(); // 0-11 사이의 월 차이

            if (years > 0) {
                return years + "년 전";
            } else if (months > 0) {
                return months + "개월 전";
            } else {
                // Period가 0년 0개월을 반환했지만, Duration은 4주 이상인 경우 (예: 29일)
                // 이전에 '주'에서 걸러지지 않은 경우를 대비 (매우 드물게 발생 가능)
                long days = duration.toDays();
                return days + "일 전"; // 최소한 일 단위로 표시
            }
        }
    }

    public String getTimesAgo2() {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDateTime createdAt = this.getCreatedAt();

        Duration duration = Duration.between(createdAt, now);

        long seconds = duration.toSeconds();

        if (seconds < 60) {
            return "방금 전";
        } else if (seconds < 60 * 60) { // 1 시간
            long minutes = seconds / 60;
            return minutes + "분 전";
        } else if (seconds < 60 * 60 * 24) { // 1 일
            long hours = seconds / 3600;
            return hours + "시간 전";
        } else if (seconds < 60 * 60 * 24 * 7) { // 1주일
            long days = seconds / (3600 * 24);
            return days + "일 전";
        } else if (seconds < 60 * 60 * 24 * 7 * 4) { // 4주
            long weeks = seconds / (3600 * 24 * 7);
            return weeks + "주 전";
        } else {
            // Period를 사용하여 정확한 월/년 계산
            java.time.Period period = java.time.Period.between(createdAt.toLocalDate(), now.toLocalDate());
            int years = period.getYears();
            int months = period.getMonths(); // 0-11 사이의 월 차이

            if (years > 0) {
                return years + "년 전";
            } else if (months > 0) {
                return months + "개월 전";
            } else {
                // Period가 0년 0개월을 반환했지만, Duration은 4주 이상인 경우 (예: 29일)
                // 이전에 '주'에서 걸러지지 않은 경우를 대비 (매우 드물게 발생 가능)
                long days = duration.toDays();
                return days + "일 전"; // 최소한 일 단위로 표시
            }
        }
    }

}
