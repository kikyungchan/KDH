package com.example.backend.chat.service;

import com.example.backend.chat.dto.ChatForm;
import com.example.backend.chat.dto.ChatListDto;
import com.example.backend.chat.entity.ChatLog;
import com.example.backend.chat.entity.ChatRoom;
import com.example.backend.chat.repository.ChatLogRepository;
import com.example.backend.chat.repository.ChatRoomRepository;
import com.example.backend.member.entity.Member;
import com.example.backend.member.entity.MemberRole;
import com.example.backend.member.repository.MemberRepository;
import com.example.backend.member.repository.MemberRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {
    private final ChatLogRepository chatLogRepository;
    private final MemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MemberRoleRepository memberRoleRepository;

    public void add(String roomId, ChatForm msg) {
        System.out.println("roomId: " + roomId);
        System.out.println("msg: " + msg);

        ChatLog chatLog = new ChatLog();
        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId);
        chatLog.setRoomId(chatRoom);
        System.out.println("chatRoom: " + chatRoom);
        Member user = memberRepository.findById(Integer.valueOf(msg.getUserid())).get();
        chatLog.setUser(user);
        chatLog.setType(String.valueOf(msg.getType()));
        chatLog.setMessage(msg.getMessage());

        System.out.println("chatLog: " + chatLog);
        chatLogRepository.save(chatLog);

    }

    public Map<String, Object> list(String roomId, String userid, Integer pageNumber, Authentication authentication) {

        ChatRoom room = chatRoomRepository.findByRoomId(roomId);

        if (room == null) {
            ChatRoom chatRoom = new ChatRoom();
            chatRoom.setRoomId(roomId);
            Member user = memberRepository.findById(Integer.valueOf(authentication.getName())).get();
            chatRoom.setUser(user);
            chatRoom.setType("OPEN");
            chatRoomRepository.save(chatRoom);
        } else {
            validateChatRoomStatus(room, authentication);
        }

        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId);

        Page<ChatListDto> chatListDtoPage =
                chatLogRepository.findAllBy(chatRoom, PageRequest.of(pageNumber - 1, 30));
        int totalPages = chatListDtoPage.getTotalPages(); // 마지막 페이지
        int rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        int leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);

        var pageInfo = Map.of("totalPages", totalPages,
                "rightPageNumber", rightPageNumber,
                "leftPageNumber", leftPageNumber,
                "currentPageNumber", pageNumber);

        return Map.of("pageInfo", pageInfo,
                "chatList", chatListDtoPage.getContent());

    }

    public void chatRoomclose(String roomId) {
        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId);
        chatRoom.setType("closed");
        /*System.out.println("chatRoom: " + chatRoom);*/
        chatRoomRepository.save(chatRoom);

    }

    public Boolean chatRoomCheck(String roomId) {
        ChatRoom chatRoom = chatRoomRepository.findByRoomId(roomId);
        if (chatRoom.getType().equals("OPEN")) {
            return true;
        } else {
            return false;
        }
    }

    private void validateChatRoomStatus(ChatRoom room, Authentication authentication) {
        String roomType = room.getType();
        Member user = memberRepository.findById(Integer.valueOf(authentication.getName())).get();
        List<MemberRole> roles = memberRoleRepository.findByMember(user);
        if (!roles.isEmpty()) {
            return;
        }
        if ("CLOSED".equals(roomType) || "DISABLE".equals(roomType)) {
            throw new RuntimeException("대화가 종료된 방입니다");
        }
        if (!"OPEN".equals(roomType) || room.getUser() != user) {
            throw new RuntimeException("접근할 수 없는 채팅방입니다");
        }

        /*if (user.getName() == authentication.getName()) {
            throw new RuntimeException("접근할 수 없는 채팅방입니다");
        }*/
    }


}
