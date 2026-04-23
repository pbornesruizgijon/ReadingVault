package com.readingvault.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para representar un libro de la API externa Open Library en ReadingVault.
 */
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class LibroExternoDTO {
    
    private String title;
    private List<String> authorNames;
    private int numberOfPages;
    private String coverId; 

    /**
     * Devuelve el primer autor o "Desconocido". 
     * Útil para mostrar en listas donde no hay espacio para todos los autores.
     */
    public String getNombrePrimerAutor() {
        return (authorNames != null && !authorNames.isEmpty()) ? authorNames.get(0) : "Desconocido";
    }

    /**
     * Genera la URL de la imagen. He cambiado "-M" (Medium) por "-L" (Large) 
     * por si queréis mostrarla en grande en el detalle del libro.
     */
    public String getUrlPortada() {
        if (coverId != null && !coverId.isEmpty()) {
            return "https://covers.openlibrary.org/b/id/" + coverId + "-L.jpg";
        }
        // Retornamos null o una URL de imagen genérica para el frontend
        return "https://via.placeholder.com/400x600?text=Sin+Portada";
    }
}