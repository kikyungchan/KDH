package com.example.backend.chat.controller;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("registerStompEndpoints" + registry);
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*") // cors 허용 범위
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    @Override
                    protected Principal determineUser(ServerHttpRequest request,
                                                      WebSocketHandler wsHandler,
                                                      Map<String, Object> attributes) {
                        // 예시: ?username=userA 쿼리로 전달받았다 가정
                        String user = ((ServletServerHttpRequest) request)
                                .getServletRequest()
                                .getParameter("username");
                        return () -> (user != null ? user : "guest");
                    }
                })
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        System.out.println("configureMessageBroker " + registry);
        registry.enableSimpleBroker("/queue");              // client subscribe prefix
        registry.setApplicationDestinationPrefixes("/app"); // client send prefix
        registry.setUserDestinationPrefix("/user");         // 1:1 메시지 prefix
    }

}
