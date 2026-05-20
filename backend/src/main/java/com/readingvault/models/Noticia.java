package com.readingvault.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Noticia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNoticia;

    @ManyToOne
    @JoinColumn(name = "id_usuario") // El admin que la publica
    private Usuario autor;

    @ManyToOne
    @JoinColumn(name = "id_libro", nullable = true) // Si es null, es una noticia normal sin libro
    private Libro libro; 

    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String contenido;
    
    private String fecha;
}