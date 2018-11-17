package pl.coderslab.services;

import pl.coderslab.model.Book;

import java.util.List;

public interface BookService {
    List<Book> getList();
    Book addBook(Book book);
    Book getById(Integer Id);
    boolean deleteBook(Integer id);
    Book editBook(Integer Id, Book book);
}