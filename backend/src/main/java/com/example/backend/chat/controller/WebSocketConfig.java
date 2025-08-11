package com.example.backend.chat.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtDecoder jwtDecoder;

    // MyHandshakeInterceptor를 static 내부 클래스로 정의
    public static class MyHandshakeInterceptor implements HandshakeInterceptor {
        @Override
        public boolean beforeHandshake(ServerHttpRequest request, org.springframework.http.server.ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
            if (request instanceof ServletServerHttpRequest) {
                ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
                String authHeader = servletRequest.getServletRequest().getParameter("Authorization");

                if (authHeader != null && !authHeader.trim().isEmpty()) {
                    String token = authHeader.replace("Bearer ", "");
                    attributes.put("jwt", token);
                    System.out.println("인터셉터: 쿼리 파라미터에서 토큰을 추출하여 attributes에 저장했습니다.");
                } else {
                    System.out.println("인터셉터: 쿼리 파라미터에 'Authorization' 헤더가 없습니다.");
                }
            }
            return true;
        }

        @Override
        public void afterHandshake(ServerHttpRequest request, org.springframework.http.server.ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
        }
    }

    // ---

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

                // SUBSCRIBE 요청이 들어왔을 때만 Principal을 확인합니다.
                if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    Principal userPrincipal = accessor.getUser();

                    if (userPrincipal != null) {
                        System.out.println("▶ SUBSCRIBE 요청자: " + userPrincipal.getName());
                    } else {
                        System.out.println("▶ SUBSCRIBE 요청자: Principal을 찾을 수 없습니다.");
                    }
                }

                return message;
            }
        });
    }

    // ---

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*")
                .addInterceptors(new MyHandshakeInterceptor()) // 인터셉터가 먼저 토큰을 attributes에 넣습니다.
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    @Override
                    protected Principal determineUser(ServerHttpRequest request,
                                                      WebSocketHandler wsHandler,
                                                      Map<String, Object> attributes) {
                        System.out.println("attributes: " + attributes);

                        String jwt = (String) attributes.get("jwt");

                        if (jwt != null) {
                            Jwt decoded = jwtDecoder.decode(jwt);
                            // JWT에서 loginid 추출
                            String userId = decoded.getClaimAsString("loginId");
                            return () -> userId;
                        }

                        // 토큰이 없거나 유효하지 않으면 익명 사용자로 처리
                        return () -> "anonymous";
                    }
                })
                .withSockJS();
    }

    // ---

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/queue", "/topic");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
    }

}
