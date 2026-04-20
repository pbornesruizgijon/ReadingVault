package com.readingvault.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.readingvault.models.MeGusta;
import com.readingvault.repositories.MeGustaRepository;

@Service
public class MeGustaService {
    @Autowired
    private MeGustaRepository meGustaRepository;

    public MeGusta darLike(MeGusta like) {
        return meGustaRepository.save(like);
    }
}