package pl.coderslab.controller;

import org.springframework.web.bind.annotation.*;
import pl.coderslab.model.Book;
import pl.coderslab.services.BookService;

import java.util.List;

@RestController
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/books")
    public List<Book> getList() {
        return bookService.getList();             //return List<Book>
    }

    @GetMapping("/books/{id}")
    public Book getBook(@PathVariable Integer id) {
        return bookService.getById(id);           //return one Book
    }

    @PostMapping("/books")
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);         //return added Book
    }

    @DeleteMapping("/books/{Id}")
    public boolean deleteBook(@PathVariable Integer Id) {
        return bookService.deleteBook(Id);        //return boolean, true if deleted
    }

    @PutMapping("/books/{Id}")
    public Book editBook(@PathVariable Integer Id,
                         @RequestBody Book book) {
        return bookService.editBook(Id, book);      //return edited Book
    }
}
