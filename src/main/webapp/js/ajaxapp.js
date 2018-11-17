$(document).ready(function () {

    let operationType = "post";
    let bookIdToSend = "";
    let formTitle = $(".contact100-form-title");
    formTitle.text("Dodaj nową książkę");

    //WYSYŁANIE NOWEJ KSIĄŻKI DO BAZY LUB EDYCJA ISTNIEJĄCEJ

    let bookForm = $(".contact100-form");
    let dataToSend;

    bookForm.on("submit", function (e) {
        e.preventDefault();

        dataToSend = {
            "isbn": bookForm.find("[name=isbn]").val(),
            "title": bookForm.find("[name=title]").val(),
            "author": bookForm.find("[name=author]").val(),
            "publisher": bookForm.find("[name=publisher]").val(),
            "type": bookForm.find("[name=type]").val()
        };

        if (bookIdToSend != "")
            dataToSend.id = bookIdToSend;

        $.ajax({
            url: "http://localhost:8080/books/" + bookIdToSend,
            data: JSON.stringify(dataToSend),
            contentType: "application/json",
            type: operationType,
            dataType: "json"
        })
            .done(function (book) {
                if (bookIdToSend != "")
                    updateRow(bookIdToSend);
                else
                    createRow(book);
                operationType = "post";
                bookIdToSend = "";
                formTitle.text("Dodaj nową książkę");
            })
            .fail(function () {
                alert("Wystąpił problem podczas dodawania książki.");
            });
    });


    //ROZSUWANIE FORMULARZA

    $(".contact100-form-title").on("click", function () {
        $(".wrap-input100").slideToggle(500);
        $(".container-contact100-form-btn").slideToggle(1000);
    });


    //GENEROWANIE WIERSZY Z NOWYMI KSIĄŻKAMI

    let table = $("#booksTable tbody");

    $.ajax({
        url: "http://localhost:8080/books/",
        type: "get",
        dataType: "json"
    })
        .done(function (result) {
            $(".wrap-input100").slideUp(0);
            $(".container-contact100-form-btn").slideUp(0);
            result.forEach(book => createRow(book));
        });

    function createRow(book) {
        let bookId = book.id;
        let newTr = $("<tr data-id='" + bookId + "'>");
        let newTd = $("<td class='bookTd'>");
        let newDiv = $("<div class='mainDivInRow'>");
        let newSpan = $("<span data-id=" + bookId + " class='bookTitle'>");
        let bookDetailsDiv = $("<div>");

        newSpan.text(book.title);
        newSpan.on("click", function () {
            let currentDiv = $(this).siblings("div").eq(0);

            if (currentDiv.text().length == 0)
                getBookInfo(bookId, currentDiv);
            else
                currentDiv.slideToggle(500);
        });

        table.append(newTr);
        newTr.append(newTd);
        newTd.append(newDiv);
        newDiv.append(newSpan);
        newDiv.append(bookDetailsDiv);
        bookDetailsDiv.slideUp(0);
    }


    //WYŚWIETLANIE SZCZEGÓŁÓW O JEDNEJ KSIĄŻCE I OPCJI USUNIĘCIA I EDYCJI

    function getBookInfo(bookId, currentDiv) {
        $.ajax({
            url: "http://localhost:8080/books/" + bookId,
            type: "get",
            dataType: "json"
        })
            .done(function (result) {
                currentDiv.append("<div class='miniDiv isbnPlace'>").append("<div class='miniDiv authorPlace'>")
                    .append("<div class='miniDiv publisherPlace'>").append("<div class='miniDiv typePlace'>");
                let miniDiv = currentDiv.find($(".miniDiv"));
                miniDiv.eq(0).html("<b>Number ISBN</b><br>" + result.isbn);
                miniDiv.eq(1).html("<b>Autor</b><br>" + result.author);
                miniDiv.eq(2).html("<b>Wydawca</b><br>" + result.publisher);
                miniDiv.eq(3).html("<b>Kategoria</b><br>" + result.type);

                currentDiv.append("<div class='optionsDiv' data-id='" + bookId + "'>");
                let deleteOption = currentDiv.find($(".optionsDiv"));
                deleteOption.html("<button class='optionsButton'>USUŃ</button>");

                currentDiv.append("<div class='editDiv' data-id='" + bookId + "'>");
                let editOption = currentDiv.find($(".editDiv"));
                editOption.html("<button class='editButton'>EDYTUJ</button>");

                deleteOption.on("click", function () {
                    deleteBook(bookId, currentDiv);
                });

                editOption.on("click", function () {
                    editBook(bookId, result);
                });

                currentDiv.slideDown(500);
            });
    }


    //USUWANIE JEDNEJ KSIĄŻKI

    function deleteBook(bookId, currentDiv) {
        $.ajax({
            url: "http://localhost:8080/books/" + bookId,
            type: "delete",
            dataType: "json"
        })
            .done(function (result) {
				if (result == true) {
					let trToDelete = currentDiv.parents("tr");
					trToDelete.find("td").eq(0).css("background-color", "red");
					trToDelete.find($(".mainDivInRow")).eq(0).slideUp(1000);
					setTimeout(function () {
						trToDelete.remove();
					}, 1000);
				} else
					alert("Niepowodzenie przy usuwaniu.");
            })
            .fail(function () {
                alert("Niepowodzenie przy usuwaniu.");
            })
    }


    //EDYCJA JEDNEJ KSIĄŻKI POPRZEZ GŁÓWNY FORMULARZ

    function editBook(bookId, result) {
        operationType = "put";
        bookIdToSend = bookId;
        formTitle.text("Edytuj książkę ");
        $(".wrap-input100").slideDown(500);
        $(".container-contact100-form-btn").slideDown(1000);
        bookForm.find($("[name='isbn']")).val(result.isbn);
        bookForm.find($("[name='title']")).val(result.title);
        bookForm.find($("[name='author']")).val(result.author);
        bookForm.find($("[name='publisher']")).val(result.publisher);
        bookForm.find($("[name='type']")).val(result.type);
    }


    //WYŚWIETLENIE NOWYCH ATRYBUTÓW KSIĄŻKI WE WŁAŚCIWYM WIERSZU

    function updateRow(bookId) {
        let rowToUpdate = table.find($("tr[data-id=" + bookId + "]")).eq(0);

        rowToUpdate.find("span").eq(0).text(dataToSend.title);
        rowToUpdate.find(".isbnPlace").eq(0).html("<b>Number ISBN</b><br>" + dataToSend.isbn);
        rowToUpdate.find(".authorPlace").eq(0).html("<b>Autor</b><br>" + dataToSend.author);
        rowToUpdate.find(".publisherPlace").eq(0).html("<b>Wydawca</b><br>" + dataToSend.publisher);
        rowToUpdate.find(".typePlace").eq(0).html("<b>Kategoria</b><br>" + dataToSend.type);
    }
});
