package com.example.backend.chat.controller;

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
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

                System.out.println("is start");

                // 클라이언트가 STOMP CONNECT 프레임을 보낼 때 한 번 실행
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    System.out.println("is start2");
                    // client.activate({ connectHeaders:{username} }) 값 추출
                    String username = accessor.getFirstNativeHeader("username");
                    System.out.println("username33 : " + username);
                    //  null/빈값 체크
                    if (username == null || username.isEmpty()) {
                        System.out.println("username is null");
                        username = "guest";
                    }
                    final String user = username;
                    // Principal 로 세션에 설정해 주면 @MessageMapping 안에서 받을 수 있다                    Principal user = () -> username;
                    accessor.setUser(() -> user);
                    System.out.println("user33 : " + accessor.getUser().getName());
                }
                System.out.println("message : " + message);
                return message;
            }
        });
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("registerStompEndpoints" + registry);
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*") // cors 허용 범위
                // HTTP 세션의 Principal 정보를 WebSocket 세션에도 복사
//                .addInterceptors(new HttpSessionHandshakeInterceptor())
//                .addInterceptors(new HandshakeInterceptor())
                // Spring Security 인증된 사용자(Principal) 사용
                .setHandshakeHandler(new DefaultHandshakeHandler() {
                    @Override
                    protected Principal determineUser(ServerHttpRequest request,
                                                      WebSocketHandler wsHandler,
                                                      Map<String, Object> attributes) {
                        // 예시: ?username=userA 쿼리로 전달받았다 가정
                        System.out.println("attributes: " + attributes);
                        System.out.println("attributes.username : " + attributes.get("username"));
                        System.out.println("request : " + request);
//                        String user2 = (String) attributes.get("username");
                        String user = ((ServletServerHttpRequest) request)
                                .getServletRequest()
                                .getParameter("username");
//                        todo : user값이 null임
                        System.out.println("username from attrs: " + user);
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
