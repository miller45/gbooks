/// <reference path="../typings/jquery/jquery.d.ts" />

function exec_search_google_books() {

    var isbn = document.forms[0]['isbn'].value;
    isbn=isbn.replace('-','');
    isbn=isbn.replace(' ','');
    SmartSP.GoogleBooks.search_google_books_v2(isbn);
}

module SmartSP {
    export class GoogleBooks {
        public asomeOther: string="will";
        static spinnerUrl:string ='http://i1.wp.com/cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif';
        ///_layouts/images/gears_anv4.gif
        public static search_google_books(isbn):void {
            var script = document.createElement('script');
            if (isbn) {
                //alert( isbn.value );
                var imgl=GoogleBooks.spinnerUrl;
                document.getElementById('thumbnail').innerHTML = `<img src='${imgl}' />`;
                script.src = 'https://www.googleapis.com/books/v1/volumes?callback=SmartSP.GoogleBooks.show_bookcover&q=isbn:' + isbn;
                document.body.appendChild(script);
            } else {
                throw ('isbn parameter missing');
            }
        }

        public static show_bookdetails(booksInfo):void {
            var link = '<span class="nolink">No image available...</span>';
            for (var i in booksInfo.items) {
                var book = booksInfo.items[i]
                var image = book.volumeInfo.imageLinks;
                if (image && image.thumbnail != undefined) {
                    var thumbnail = image.thumbnail.replace('zoom=5', 'zoom=1');
                    if (document.location.protocol == 'https:') {
                        var parser = document.createElement('a');
                        parser.href = thumbnail;
                        parser.protocol = 'https:';
                        parser.hostname = 'encrypted.google.com';
                        thumbnail = parser.href;
                    }
                    link = '<img src="' + thumbnail + '" />';
                    if (book.accessInfo && book.accessInfo.viewability != "NO_PAGES") {
                        var preview = book.volumeInfo.previewLink;
                        link += '<br /><a href="' + preview + '" target="_blank"><img border=0 src="//www.google.com/googlebooks/images/gbs_preview_button1.gif" title="Google Preview" alt="Google Preview" /></a>';
                    }
                }
                link += '<br />' + book.volumeInfo.title;
                if (book.volumeInfo.authors.length > 0) {
                    link += '<br />' + book.volumeInfo.authors.join("; ");
                }
            }
            document.getElementById('thumbnail').innerHTML = link;
        }


        public static search_google_books_v2(isbn):void {
            var qurl="https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
            $.get(qurl).then(function(data)
            {
                GoogleBooks.show_bookdetails(data);
            }).fail(function(err) {
                $('#thumbnail').text(err);
            });
        }

        private static get_google_books_pic(isbn):void {
            var that=this;
            $('#onetIDListForm table.ms-formtable').first().find('tr').first().append('<td rowspan="32"><div class="bibliotheca-book-pic" style="padding:20px"><span>loading cover...</span></div></td>');

            var qurl = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
            $.get(qurl).then(function (data) {
                that.insert_google_books_pic(data);
            }).fail(function (err) {
                $('.bibliotheca-book-pic').empty();
                if (console)console.log(err);
                //$('.bibliotheca-book-pic').text(JSON.stringify(err));
            });
        }

        private static insert_google_books_pic(booksInfo):void {
            var link = '<span class="nolink">No image available...</span>';
            for (var i in booksInfo.items) {
                var book = booksInfo.items[i]
                var image = book.volumeInfo.imageLinks;
                if (image && image.thumbnail != undefined) {
                    var thumbnail = image.thumbnail.replace('zoom=5', 'zoom=1');
                    if (document.location.protocol == 'https:') {
                        var parser = document.createElement('a');
                        parser.href = thumbnail;
                        parser.protocol = 'https:';
                        parser.hostname = 'encrypted.google.com';
                        thumbnail = parser.href;
                    }
                    link = '<img src="' + thumbnail + '" />';
                    if (book.accessInfo && book.accessInfo.viewability != "NO_PAGES") {
                        var preview = book.volumeInfo.previewLink;
                        link += '<br /><a href="' + preview + '" target="_blank"><img border=0 src="//www.google.com/googlebooks/images/gbs_preview_button1.gif" title="Google Preview" alt="Google Preview" /></a>';
                    }
                }
            }
            $('.bibliotheca-book-pic').empty().append(link);
        }

    }

    export class SPBookInfo {
        Title: string;
        Authors: string;
        ISBN_13: string;
        Publisher: string;
        PublishDate:string;
        Edition:string;
        DetailsLink:string;
    }
}