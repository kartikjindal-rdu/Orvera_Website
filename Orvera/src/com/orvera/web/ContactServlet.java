package com.orvera.web;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ContactServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String message = request.getParameter("message");
        
        PrintWriter out = response.getWriter();
        
        // Basic server-side validation
        if (name == null || name.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Name and Email are required fields.\"}");
        } else {
            // In a real application, you would send an email or store this in a database
            System.out.println("Received Contact Query from Orvera Website:");
            System.out.println("Name: " + name);
            System.out.println("Email: " + email);
            System.out.println("Message: " + message);
            
            response.setStatus(HttpServletResponse.SC_OK);
            out.print("{\"status\":\"success\",\"message\":\"Thank you, " + name + "! Your inquiry has been received. Our team will get back to you shortly.\"}");
        }
        out.flush();
    }
}
