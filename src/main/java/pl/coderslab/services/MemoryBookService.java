package pl.coderslab.services;

import org.springframework.stereotype.Service;
import pl.coderslab.model.Book;

import java.util.ArrayList;
import java.util.List;

@Service
public class MemoryBookService implements BookService {
    private List<Book> list;

    public MemoryBookService() {
        list = new ArrayList<>();

        list.add(new Book("9788324631766", "Thinking in Java", "Bruce Eckel",
                "Helion", "programming"));
        list.add(new Book("9788324627738", "Rusz glowa, Java.",
                "Sierra Kathy, Bates Bert", "Helion", "programming"));
        list.add(new Book("9780130819338", "Java 2. Podstawy",
                "Cay Horstmann, Gary Cornell", "Helion", "programming"));
    }

    public List<Book> getList() {
        return list;
    }

    public Book addBook(Book book) {
        int size = this.list.size();
        list.add(book);
        if (size < this.list.size())
            return book;
        else
            return null;
    }

    public Book getById(Integer id) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getId() == id)
                return list.get(i);
        }
        return null;
    }

    public boolean deleteBook(Integer id) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getId() == id) {
                list.remove(i);
                return true;
            }
        }
        return false;
    }

    public Book editBook(Integer Id, Book book) {
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i).getId() == Id) {
                list.get(i).setIsbn(book.getIsbn());
                list.get(i).setTitle(book.getTitle());
                list.get(i).setAuthor(book.getAuthor());
                list.get(i).setPublisher(book.getPublisher());
                list.get(i).setType(book.getType());
                return list.get(i);
            }
        }
        return null;
    }
}