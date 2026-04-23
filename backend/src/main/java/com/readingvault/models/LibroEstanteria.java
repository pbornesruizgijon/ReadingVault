package com.readingvault.models;


import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.Data;

@Data
@Entity
public class LibroEstanteria {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_estanteria")
    private Estanteria estanteria;

    @ManyToOne
    @JoinColumn(name = "id_libro")
    private Libro libro;

    private LocalDate fechaAgregado;

    // se ejecuta automáticamente antes de guardar en la DB
    @PrePersist
    protected void onCreate() {
        this.fechaAgregado = LocalDate.now();
    }
}
