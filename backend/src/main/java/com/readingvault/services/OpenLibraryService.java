package com.readingvault.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.readingvault.dto.LibroExternoDTO;

@Service
public class OpenLibraryService {

    private final String SEARCH_URL = "https://openlibrary.org/search.json";
    private final RestTemplate restTemplate = new RestTemplate(); 

    public List<LibroExternoDTO> buscarLibros(String titulo, String autor, String genero, int pagina) {
        
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(SEARCH_URL);
        
        if (titulo != null && !titulo.isEmpty()) builder.queryParam("title", titulo);
        if (autor != null && !autor.isEmpty()) builder.queryParam("author", autor);
        
        // Filtro por género (en Open Library se llama 'subject')
        if (genero != null && !genero.isEmpty()) builder.queryParam("subject", genero);
        
        builder.queryParam("limit", 10);
        builder.queryParam("page", pagina);
        
        try {
            Map<String, Object> response = restTemplate.getForObject(builder.toUriString(), Map.class);
            if (response == null || !response.containsKey("docs")) return List.of();

            List<Map<String, Object>> docs = (List<Map<String, Object>>) response.get("docs");

            return docs.stream().map(doc -> {
                LibroExternoDTO dto = new LibroExternoDTO();
                
                // Título
                dto.setTitle(String.valueOf(doc.getOrDefault("title", "Sin título")));
                
                // Autores
                if (doc.containsKey("author_name")) {
                    dto.setAuthorNames((List<String>) doc.get("author_name"));
                }

                // Páginas
                Object pages = doc.get("number_of_pages_median");
                dto.setNumberOfPages(pages != null ? ((Number) pages).intValue() : 0);
                
                // Portada ID
                if (doc.get("cover_i") != null) {
                    dto.setCoverId(doc.get("cover_i").toString());
                    // Tip: Puedes generar la URL de la imagen aquí mismo:
                    // dto.setCoverUrl("https://covers.openlibrary.org/b/id/" + dto.getCoverId() + "-L.jpg");
                }
                
                return dto;
            }).collect(Collectors.toList());

        } catch (Exception e) {
            return List.of(); 
        }
    }
}
