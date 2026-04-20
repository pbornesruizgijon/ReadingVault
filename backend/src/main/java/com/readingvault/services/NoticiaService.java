package com.readingvault.services;

import com.readingvault.models.Noticia;
import com.readingvault.repositories.NoticiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoticiaService {

    @Autowired
    private NoticiaRepository noticiaRepository;

    public List<Noticia> obtenerNoticiasRecientes() {
        return noticiaRepository.findAll();
    }
}