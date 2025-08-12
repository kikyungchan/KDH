package com.example.backend.chat.service;

import com.example.backend.chat.dto.ChatForm;
import com.example.backend.chat.dto.ChatListDto;
import com.example.backend.chat.entity.ChatLog;
import com.example.backend.chat.repository.ChatLogRepository;
import com.example.backend.member.entity.Member;
import com.example.backend.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {
    private final ChatLogRepository chatLogRepository;
    private final MemberRepository memberRepository;

    public void add(String roomId, ChatForm msg) {
        System.out.println("roomId: " + roomId);
        System.out.println("msg: " + msg);

        ChatLog chatLog = new ChatLog();
        chatLog.setRoomId(roomId);
        Member user = memberRepository.findById(Integer.valueOf(msg.getUserid())).get();
        chatLog.setUser(user);
        chatLog.setType(String.valueOf(msg.getType()));
        chatLog.setMessage(msg.getMessage());

        System.out.println("chatLog: " + chatLog);
        chatLogRepository.save(chatLog);

    }

    public Map<String, Object> list(String roomId, String userid, Authentication authentication) {
        int pageNumber = 10;
        Page<ChatListDto> chatListDtoPage =
                chatLogRepository.findAllBy(roomId, userid, PageRequest.of(pageNumber - 1, 10));
        int totalPages = chatListDtoPage.getTotalPages(); // 마지막 페이지
        int rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        int leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);

        System.out.println("chatList" + chatListDtoPage.getContent());

        var pageInfo = Map.of("totalPages", totalPages,
                "rightPageNumber", rightPageNumber,
                "leftPageNumber", leftPageNumber,
                "currentPageNumber", pageNumber);

        return Map.of("pageInfo", pageInfo,
                "chatList", chatListDtoPage.getContent());
    }
}
