package com.readingvault.services;

import com.readingvault.models.Review;
import com.readingvault.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> obtenerReviewsPorLibro(Long idLibro) {
        return reviewRepository.findByLibroIdLibro(idLibro);
    }

    public Review crearReview(Review review) {
        return reviewRepository.save(review);
    }
}