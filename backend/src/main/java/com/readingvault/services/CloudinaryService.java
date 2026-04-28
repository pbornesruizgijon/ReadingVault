package com.readingvault.services;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService() {
        // Configuración manual o mediante @Value
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dng49vizq",
            "api_key", "983843216921623",
            "api_secret", "yAQAPPYd_uoEv-B8zjn1tT-BlqQ"
        ));
    }

    public String subirFoto(MultipartFile archivo) throws IOException {
        // Subimos el archivo a la nube
        Map uploadResult = cloudinary.uploader().upload(archivo.getBytes(), 
            ObjectUtils.asMap("folder", "fotos-perfil-readingvault"));
        
        // Devolvemos la URL segura (https)
        return uploadResult.get("secure_url").toString();
    }

    public String extraerPublicId(String url) {
    if (url == null || !url.contains("cloudinary")) return null;
    
   
    try {
        String parts[] = url.split("/");
        String folderAndName = parts[parts.length - 2] + "/" + parts[parts.length - 1];
        // Quitar la extensión 
        return folderAndName.substring(0, folderAndName.lastIndexOf("."));
    } catch (Exception e) {
        return null;
    }
}

public void eliminarFoto(String publicId) throws IOException {
    if (publicId == null) return;
    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
}
}