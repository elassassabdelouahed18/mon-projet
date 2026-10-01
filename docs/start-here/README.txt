Start Here: The BeFree System (6 x 9 in, 32 pages).
book.html is the source. Screens in fig/ are captured from the live apps:
    serve befree-apps at http://localhost:8124/, then
    PW=/path/to/playwright node shots.cjs     (fixed date: Sep 24, 2026, sample data)
    PW=/path/to/playwright node render.cjs    (writes the PDF, reports any page that overflows)
    python3 finish.py                         (sets title, author, subject and keywords)
The cover art is cover-src.png, taken unchanged from the previous edition.
