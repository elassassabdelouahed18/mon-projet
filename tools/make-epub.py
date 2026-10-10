#!/usr/bin/env python3
"""G1 - the phone edition.

Builds a reflowable EPUB 3 from the same book.html the PDF is rendered from,
so the two editions can never drift. Every chart, callout box and cross
reference comes across; the print stylesheet does not. epub.css restates the
same design in relative units, which is what lets a phone set the type.

    python3 tools/make-epub.py

Writes docs/book/The-Anti-Paycheck-Trap.epub.
"""
import io, os, re, sys, uuid, zipfile, datetime
import xml.etree.ElementTree as ET
import tinyhtml5

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'docs', 'book', 'src')
OUT = os.path.join(HERE, '..', 'docs', 'book', 'The-Anti-Paycheck-Trap.epub')
XH = 'http://www.w3.org/1999/xhtml'
SVG = 'http://www.w3.org/2000/svg'
XLINK = 'http://www.w3.org/1999/xlink'
ET.register_namespace('', XH)
ET.register_namespace('svg', SVG)
ET.register_namespace('xlink', XLINK)

TITLE = 'The Anti-Paycheck Trap'
AUTHOR = 'Abdel Elassass'
# A stable identifier, so a reader that already has the book updates it in
# place instead of shelving a second copy.
BOOK_ID = 'urn:uuid:' + str(uuid.uuid5(uuid.NAMESPACE_URL, 'https://befreeacademy.site/the-anti-paycheck-trap'))


def q(tag):
    return f'{{{XH}}}{tag}'


def text_of(el):
    return ''.join(el.itertext()).strip()


def strip_xmlns_attrs(el):
    """tinyhtml5 keeps the literal xmlns="..." of inline SVG as an attribute;
    the tree already carries the namespace, and a second copy is invalid."""
    for e in el.iter():
        for k in list(e.attrib):
            if k.startswith('{http://www.w3.org/2000/xmlns/}') or k == 'xmlns':
                del e.attrib[k]


def build():
    root = tinyhtml5.parse(io.open(os.path.join(SRC, 'book.html'), 'rb'))
    strip_xmlns_attrs(root)
    body = root.find(q('body'))
    sections = [c for c in body if c.tag == q('section')]
    if len(sections) < 40:
        sys.exit(f'expected the book in sections, found {len(sections)}')

    # ── one file per section, and a map from every id to the file it lands in
    files, where = [], {}
    for i, sec in enumerate(sections):
        name = f'text/s{i:02d}.xhtml'
        files.append((name, sec))
        for el in sec.iter():
            if 'id' in el.attrib:
                where[el.attrib['id']] = name
        if 'id' in sec.attrib:
            where[sec.attrib['id']] = name

    # ── the cover becomes a real image page
    cover = sections[0]
    for child in list(cover):
        cover.remove(child)
    cover.attrib = {'class': 'coverpage'}
    img = ET.SubElement(cover, q('img'))
    img.attrib = {'src': '../img/cover.jpg', 'alt': TITLE + '. The 5-Part System to Break the '
                  'Paycheck-to-Paycheck Cycle.', 'class': 'coverimg'}

    # ── titles wrap to the screen, so the author's line breaks come out
    # (ed_heads.py already put a space before each one, so nothing runs together)
    for _, sec in files:
        for head in sec.iter(q('h1')):
            for br in list(head.findall(q('br'))):
                i = list(head).index(br)
                tail = br.tail or ''
                if i == 0:
                    head.text = (head.text or '') + tail
                else:
                    prev = list(head)[i - 1]
                    prev.tail = (prev.tail or '') + tail
                head.remove(br)

    # ── cross references point at a file now, not at a page
    missing = set()
    for name, sec in files:
        for a in sec.iter(q('a')):
            href = a.attrib.get('href', '')
            if href.startswith('#'):
                target = where.get(href[1:])
                if target is None:
                    missing.add(href)
                    continue
                a.attrib['href'] = href if target == name else os.path.basename(target) + href
    if missing:
        sys.exit(f'[epub] cross references with no target: {sorted(missing)[:6]}')

    # ── headings become the navigation
    nav = []
    for name, sec in files:
        h1 = sec.find('.//' + q('h1'))
        if h1 is None:
            continue
        label = None
        style = h1.attrib.get('style', '')
        m = re.search(r"bookmark-label:'((?:[^'\\]|\\.)*)'", style)
        if m:
            label = m.group(1).replace("\\'", "'")
        if not label:
            label = text_of(h1)
        hid = h1.attrib.get('id') or sec.attrib.get('id')
        if not hid:
            hid = 'h' + name[7:9]
            h1.attrib['id'] = hid
        nav.append((os.path.basename(name) + '#' + hid, label))

    # ── write it out
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    if os.path.exists(OUT):
        os.remove(OUT)
    z = zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED)
    z.writestr(zipfile.ZipInfo('mimetype'), 'application/epub+zip', zipfile.ZIP_STORED)
    z.writestr('META-INF/container.xml',
               '<?xml version="1.0" encoding="UTF-8"?>\n'
               '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">'
               '<rootfiles><rootfile full-path="EPUB/package.opf" '
               'media-type="application/oebps-package+xml"/></rootfiles></container>')

    manifest, spine = [], []
    for name, sec in files:
        doc = ET.Element(q('html'), {'lang': 'en-US', '{http://www.w3.org/XML/1998/namespace}lang': 'en-US'})
        head = ET.SubElement(doc, q('head'))
        t = ET.SubElement(head, q('title')); t.text = TITLE
        ET.SubElement(head, q('meta'), {'charset': 'utf-8'})
        ET.SubElement(head, q('link'), {'rel': 'stylesheet', 'type': 'text/css', 'href': '../css/epub.css'})
        bd = ET.SubElement(doc, q('body'))
        bd.append(sec)
        xml = ET.tostring(doc, encoding='unicode')
        xml = xml.replace('src="shots/', 'src="../img/').replace('src="cover3e.jpg', 'src="../img/cover.jpg')
        z.writestr('EPUB/' + name, '<?xml version="1.0" encoding="UTF-8"?>\n'
                   '<!DOCTYPE html>\n' + xml)
        ident = 's' + name[7:9]
        manifest.append(f'<item id="{ident}" href="{name}" media-type="application/xhtml+xml"/>')
        spine.append(f'<itemref idref="{ident}"/>')

    css = io.open(os.path.join(HERE, 'epub.css'), encoding='utf-8').read()
    z.writestr('EPUB/css/epub.css', css)
    manifest.append('<item id="css" href="css/epub.css" media-type="text/css"/>')

    for f in sorted(os.listdir(os.path.join(SRC, 'fonts'))):
        if not f.endswith('.woff2') or f.startswith('dm-serif'):
            continue
        z.write(os.path.join(SRC, 'fonts', f), 'EPUB/fonts/' + f)
        manifest.append(f'<item id="f-{f[:-6]}" href="fonts/{f}" media-type="font/woff2"/>')

    z.write(os.path.join(SRC, 'cover3e.jpg'), 'EPUB/img/cover.jpg')
    manifest.append('<item id="cover-image" properties="cover-image" href="img/cover.jpg" media-type="image/jpeg"/>')
    for f in sorted(os.listdir(os.path.join(SRC, 'shots'))):
        if f.endswith('.jpg'):
            z.write(os.path.join(SRC, 'shots', f), 'EPUB/img/' + f)
            manifest.append(f'<item id="i-{f[:-4]}" href="img/{f}" media-type="image/jpeg"/>')

    def esc(s):
        return (s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;'))

    items = ''.join(f'<li><a href="text/{h}">{esc(l)}</a></li>' for h, l in nav)
    navdoc = ('<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n'
              f'<html xmlns="{XH}" xmlns:epub="http://www.idpf.org/2007/ops" lang="en-US" '
              'xml:lang="en-US"><head><title>Contents</title><meta charset="utf-8"/>'
              '<link rel="stylesheet" type="text/css" href="css/epub.css"/></head><body>'
              '<nav epub:type="toc" id="toc"><h1>Contents</h1><ol>' + items +
              '</ol></nav></body></html>')
    z.writestr('EPUB/nav.xhtml', navdoc)
    manifest.append('<item id="nav" href="nav.xhtml" properties="nav" media-type="application/xhtml+xml"/>')

    opf = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" '
           'xml:lang="en-US">'
           '<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">'
           f'<dc:identifier id="pub-id">{BOOK_ID}</dc:identifier>'
           f'<dc:title>{TITLE}</dc:title>'
           f'<dc:creator>{AUTHOR}</dc:creator>'
           '<dc:language>en-US</dc:language>'
           '<dc:publisher>BeFree Academy</dc:publisher>'
           '<dc:description>The 5-Part System to Break the Paycheck-to-Paycheck Cycle.</dc:description>'
           f'<meta property="dcterms:modified">{now}</meta>'
           '<meta property="schema:accessMode">textual</meta>'
           '<meta property="schema:accessMode">visual</meta>'
           '<meta property="schema:accessModeSufficient">textual</meta>'
           '<meta property="schema:accessibilityFeature">structuralNavigation</meta>'
           '<meta property="schema:accessibilityFeature">alternativeText</meta>'
           '<meta property="schema:accessibilityHazard">none</meta>'
           '<meta property="schema:accessibilitySummary">Every chart carries a one-sentence description. '
           'The text reflows and the reader sets the type size.</meta>'
           '</metadata>'
           '<manifest>' + ''.join(manifest) + '</manifest>'
           '<spine>' + ''.join(spine) + '</spine>'
           '</package>')
    z.writestr('EPUB/package.opf', opf)
    z.close()
    print('epub:', len(files), 'documents,', len(nav), 'navigation entries,',
          os.path.getsize(OUT) // 1024, 'KB')


if __name__ == '__main__':
    build()
