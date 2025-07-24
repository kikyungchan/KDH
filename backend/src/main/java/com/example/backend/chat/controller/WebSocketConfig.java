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
import java.util.List;
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
                System.out.println("STOMP Command: " + accessor.getCommand());
                System.out.println("▶ Native Headers1: " + accessor.toNativeHeaderMap());
                System.out.println("▶ user name (preSend): " + accessor.getUser().getName());
                // todo : user 값은 넘어오는데 user name 이 guset 로 넘어옴

                // 클라이언트가 STOMP CONNECT 프레임을 보낼 때 한 번 실행
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // 1) native headers 전체
                    Map<String, List<String>> nativeHeaders = accessor.toNativeHeaderMap();
                    System.out.println("▶ Native Headers: " + nativeHeaders);
                    System.out.println("▶ username" + nativeHeaders.get("username"));

                    List<String> users = nativeHeaders.get("username");
                    System.out.println("▶ users " + users);
                    System.out.println("▶ users.get(0) " + users.get(0));
                    System.out.println("true false : " + (users != null && !users.isEmpty()));
                    String username = (users != null && !users.isEmpty())
                            ? users.get(0)
                            : "guest";
                    System.out.println("username33 : " + username);
                    //  null/빈값 체크
                    if (username == null || username.isEmpty()) {
                        System.out.println("username is null");
                        username = "guest";
                    }
                    final String user = username;
                    accessor.setUser(() -> user);
                    System.out.println("▶ 설정된 Principal: " + accessor.getUser().getName());
                }

                if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    // nativeHeaders에는 username 없음
                    // 대신 세션에 세팅된 Principal 에서 참조
                    Principal user = accessor.getUser();
                    System.out.println("▶ SUBSCRIBE user: " + user.getName());

                    String username = (user != null ? user.getName() : "anonymous");
                    System.out.println("▶ SUBSCRIBE 요청자: " + username);
                }
                System.out.println("message : " + message);
                System.out.println("▶ Native Headers2: " + accessor.toNativeHeaderMap());
                return message;
            }
        });
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("registerStompEndpoints" + registry);
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns("*") // cors 허용 범위

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
                        /*String user = ((ServletServerHttpRequest) request)
                                .getServletRequest()
                                .getParameter("username");
//                        todo : SUBSCRIBE 요청 처리 시 여기서 username 이 guest22로 변경됨,
                        System.out.println("username from attrs: " + user);
                        return () -> (user != null ? user : "guest2");*/

                        if (request instanceof ServletServerHttpRequest) {
                            Principal httpPrincipal = request.getPrincipal();
                            System.out.println("▶ HTTP 요청 Principal: " + httpPrincipal);
                        } else {
                            System.out.println("▶ HTTP 요청이 ServletServerHttpRequest 가 아닙니다.");
                        }

                        // 기본적으로 생성된 Principal 값 확인
                        Principal defaultP = super.determineUser(request, wsHandler, attributes);
                        System.out.println("▶ Default Principal: " + defaultP);

                        if (request.getPrincipal() != null) {
                            Principal httpPrincipal = request.getPrincipal();
                            return httpPrincipal;
                        } else {
                            String user = (String) attributes.get("username");
                            if (user == null || user.isEmpty()) user = "guest22";
                            final String principalName = user;
                            Principal httpPrincipal = request.getPrincipal();
                            System.out.println("▶ Handshake Principal: " + principalName);
                            System.out.println("▶ HTTP 요청 Principal: " + httpPrincipal);
                            return () -> principalName;
                        }
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
