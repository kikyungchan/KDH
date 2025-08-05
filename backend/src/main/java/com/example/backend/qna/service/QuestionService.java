package com.example.backend.qna.service;

import com.example.backend.member.entity.Member;
import com.example.backend.product.entity.Product;
import com.example.backend.product.entity.ProductImage;
import com.example.backend.product.repository.ProductImageRepository;
import com.example.backend.product.repository.ProductRepository;
import com.example.backend.qna.dto.AnswerAddForm;
import com.example.backend.qna.dto.QuestionAddForm;
import com.example.backend.qna.dto.QuestionDto;
import com.example.backend.qna.dto.QuestionListDto;
import com.example.backend.qna.entity.Answer;
import com.example.backend.qna.entity.Question;
import com.example.backend.qna.repository.AnswerRepository;
import com.example.backend.qna.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.member.repository.MemberRepository;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class QuestionService {

    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final ProductImageRepository productImageRepository;

    public Map<String, ?> addquestion(Integer id, Authentication authentication) {
        Product product = productRepository.findById(id).get();
        List<String> imagePaths = product.getImages().stream().map(ProductImage::getStoredPath).toList();

        var qnainfo = Map.of("id", product.getId(),
                "image", imagePaths,
                "price", product.getPrice(),
                "productName", product.getProductName()
        );
        return qnainfo;
    }


    public void add(QuestionAddForm dto, Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }


        Question question = new Question();
        question.setTitle(dto.getTitle());
        question.setContent(dto.getContent());
        question.setCategory(dto.getCategory());
//        System.out.println("product : " + productRepository.findById(Long.valueOf(String.valueOf(dto.getProductId()))).get());
        Product product = productRepository.findById(dto.getProductId()).get();
        question.setProduct(product);

        Member user = memberRepository.findById(Integer.valueOf(authentication.getName())).get();
        question.setUser(user);

        question.setStatus("open");
        questionRepository.save(question);


    }

    public boolean validateForAdd(QuestionAddForm dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isBlank()) {
            return false;
        }

        if (dto.getContent() == null || dto.getContent().trim().isBlank()) {
            return false;
        }

        return true;
    }

    public boolean validateForAddAns(AnswerAddForm dto) {
        if (dto.getAnswer() == null || dto.getAnswer().trim().isBlank()) {
            return false;
        }

        if (dto.getQuestionId() == null || dto.getQuestionId().describeConstable().isEmpty()) {
            return false;
        }

        return true;
    }

    public Map<String, Object> list(String keyword, Integer pageNumber) {

        Page<QuestionListDto> questionListDtoPage
                = questionRepository.findAllBy(keyword, PageRequest.of(pageNumber - 1, 10));

        int totalPages = questionListDtoPage.getTotalPages(); // 마지막 페이지
        int rightPageNumber = ((pageNumber - 1) / 10 + 1) * 10;
        int leftPageNumber = rightPageNumber - 9;
        rightPageNumber = Math.min(rightPageNumber, totalPages);
        leftPageNumber = Math.max(leftPageNumber, 1);

        System.out.println("QnaList" + questionListDtoPage.getContent());

        var pageInfo = Map.of("totalPages", totalPages,
                "rightPageNumber", rightPageNumber,
                "leftPageNumber", leftPageNumber,
                "currentPageNumber", pageNumber);

        return Map.of("pageInfo", pageInfo,
                "questionList", questionListDtoPage.getContent());
    }

    public void hasPermission(Authentication authentication) {
        System.out.println("로그인 여부 확인");
        // 로그인 여부 확인해주는 메서드
        if (authentication == null) {
            throw new RuntimeException("권한이 없습니다.");
        }
    }

    public QuestionDto viewQuestion(int id, Authentication authentication) {
        QuestionDto questionById = questionRepository.findQuestionById(id);
        Integer productId = questionById.getProductId();
        List<String> image = productImageRepository.findByProductid(productId);
        // 하나만 필요할 것 같아서 하나만 추가
        questionById.setImagePath(image.getFirst());
        if (questionById.getStatus().equals("answered")) {
            Answer ans = answerRepository.findByQuestionId(questionById.getId());
            questionById.setAnswer(ans.getContent());
        }
        return questionById;
    }

    public void deleteById(int id) {

        Question db = questionRepository.findById(id).get();
        System.out.println("db : " + db);

        // todo : answer 데이터도 지워야 함, 나중에 테스트 후 기능 제대로 완설할 것
        Answer ans = answerRepository.findByQuestionId(db.getId());
        System.out.println("ans = " + ans);
        // delete
//        questionRepository.deleteById(id);
//        answerRepository.deleteByQuestion(db);

    }

    public void addAns(AnswerAddForm dto, Authentication authentication) {


        Answer ans = new Answer();
        ans.setContent(dto.getAnswer());
        Member user = memberRepository.findById(Integer.valueOf(authentication.getName())).get();
        ans.setSeller(user);
        Question question = questionRepository.findById(dto.getQuestionId()).get();
        ans.setQuestion(question);
        question.setStatus("answered");

        // todo : sout 지우고 관리자 권환 확인해서 실행하기
        System.out.println("question = " + question);
        System.out.println("ans = " + ans);

        questionRepository.save(question);
        answerRepository.save(ans);

    }
}
