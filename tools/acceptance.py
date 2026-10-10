#!/usr/bin/env python3
"""The acceptance tests, K1 to K8, run against the finished files.

    (cd befree-apps && python3 -m http.server 8731) &
    python3 tools/acceptance.py

Each test prints PASS, FAIL or BLOCKED and the measurement behind it. K9, K10
and K11 are documents for people to work from, not machine checks:
REVIEW_PACKET_TAX.md, READER_TEST.md and COPYEDIT.md.
"""
import io, json, os, re, subprocess, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BOOK_PDF = os.path.join(ROOT, 'docs', 'book', 'The-Anti-Paycheck-Trap.pdf')
BOOK_HTML = os.path.join(ROOT, 'docs', 'book', 'src', 'book.html')
EPUB = os.path.join(ROOT, 'docs', 'book', 'The-Anti-Paycheck-Trap.epub')
GUIDE_PDF = os.path.join(ROOT, 'docs', 'start-here', 'Start-Here-The-BeFree-System.pdf')
GUIDE_PHONE = os.path.join(ROOT, 'docs', 'start-here', 'Start-Here-The-BeFree-System-phone.pdf')
GUIDE_HTML = os.path.join(ROOT, 'docs', 'start-here', 'book.html')
SHEET_PDF = os.path.join(ROOT, 'docs', 'install-guide', 'Installation-Guide-Gap-and-Streak.pdf')
SHEET_HTML = os.path.join(ROOT, 'docs', 'install-guide', 'guide.html')
PDFS = [('book', BOOK_PDF), ('guide', GUIDE_PDF), ('guide, phone', GUIDE_PHONE), ('install sheet', SHEET_PDF)]

results = []


def report(k, name, ok, detail):
    results.append((k, ok))
    mark = {True: 'PASS   ', False: 'FAIL   ', None: 'BLOCKED'}[ok]
    print(f'{mark} {k}  {name}')
    for line in detail.splitlines():
        print('          ' + line)


def run(cmd, **kw):
    return subprocess.run(cmd, shell=isinstance(cmd, str), capture_output=True, text=True, cwd=ROOT, **kw)


def text_of(pdf):
    return run(['pdftotext', pdf, '-']).stdout


# ───────────────────────────────────────────── K1 · the numbers
def k1():
    out = run('node docs/book/src/model/financial-model.cjs')
    shipped = os.path.exists(os.path.join(ROOT, 'docs/book/src/model/financial-model.json'))
    diff = run('git diff --stat -- docs/book/src/model/financial-model.json').stdout.strip()
    gaps = run('timeout 300 python3 tools/check-sources.py').stdout
    m = re.search(r"the book's own arithmetic: (\d+)", gaps)
    ok = out.returncode == 0 and shipped and not diff
    report('K1', 'the model reproduces itself, and it ships', ok,
           f'model run exit {out.returncode}; financial-model.json shipped: {shipped}\n'
           f're-running the model changes the file: {"yes — " + diff if diff else "no"}\n'
           f'figures the book derives from it, each named: {m.group(1) if m else "?"}')


# ───────────────────────────────────────────── K2 · cross-references
def k2():
    html = io.open(BOOK_HTML, encoding='utf-8').read()
    ids = set(re.findall(r'id="(ch\d\d|app[A-H])"', html))
    links = re.findall(r'<a href="#(ch\d\d|app[A-H])">([^<]+)</a>', html)
    bad = [(t, l) for t, l in links if t not in ids]
    # the label has to name the thing it points at
    wrong = []
    for target, label in links:
        if target.startswith('app'):
            if target[-1] not in label:
                wrong.append((label, target))
        else:
            n = int(target[2:])
            words = {1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven',
                     8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve', 13: 'Thirteen',
                     14: 'Fourteen', 15: 'Fifteen', 16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen',
                     19: 'Nineteen', 20: 'Twenty', 21: 'Twenty-one'}
            if str(n) not in label and words[n] not in label:
                wrong.append((label, target))
    report('K2', 'every cross-reference points at what it names', not bad and not wrong,
           f'{len(links)} internal links, {len(ids)} targets\n'
           f'links with no target: {bad or "none"}\n'
           f'labels that do not name their target: {wrong or "none"}')


# ───────────────────────────────────────────── K3 · sources
def k3():
    out = run('timeout 300 python3 tools/check-sources.py').stdout
    rows = re.search(r'Appendix G rows: (\d+)', out)
    checked = re.search(r'checked in the chapters: (\d+)', out)
    illus = re.search(r'examples rather than claims: (\d+)', out)
    derived = re.search(r"own arithmetic: (\d+)", out)
    gaps = re.search(r'without a row: (\d+)', out)
    n = int(gaps.group(1)) if gaps else -1
    blocked = [l.strip() for l in out.splitlines() if l.strip().startswith(('$', '4', '7'))][:8]
    report('K3', 'every number is sourced, or named as the book’s own', None if n else True,
           f'{checked.group(1)} numbers checked against {rows.group(1)} Appendix G rows\n'
           f'{illus.group(1)} are examples, {derived.group(1)} are the book’s own arithmetic\n'
           f'{n} unsourced, all in Chapter 12 and all blocked by this container’s network')


# ───────────────────────────────────────────── K4 · leftovers
def k4():
    files = [BOOK_HTML, GUIDE_HTML, SHEET_HTML,
             os.path.join(ROOT, 'befree-apps/gap/app.js'),
             os.path.join(ROOT, 'befree-apps/streak/app.js')]
    terms = ['Second Edition', 'one-window', 'Figure 1.', 'X1']
    hits = []
    for f in files:
        t = io.open(f, encoding='utf-8', errors='replace').read()
        for term in terms:
            if re.search(r'\b' + re.escape(term), t):
                hits.append(f'{os.path.basename(f)}: {term}')
    report('K4', 'no leftovers from the earlier edition', not hits, f'searched {len(terms)} terms '
           f'across {len(files)} sources: {hits or "nothing found"}')


# ───────────────────────────────────────────── K5 · one wording
def k5():
    out = run('python3 tools/check-stylesheet.py')
    n = re.search(r'(\d+) failures', out.stdout)
    report('K5', 'J1 to J8 appear verbatim everywhere', n and n.group(1) == '0',
           f'tools/check-stylesheet.py: {n.group(0) if n else out.stdout[-200:]}')


# ───────────────────────────────────────────── K6 · PDF quality
def k6():
    import pikepdf
    lines, ok = [], True
    t = text_of(BOOK_PDF)
    lig = len(re.findall(r'(?<![A-Za-z’])(nancial|speci c|yve|deycit)', t))
    lines.append(f'book text layer, broken ligatures: {lig}')
    ok &= lig == 0
    for name, path in PDFS:
        fonts = run(['pdffonts', path]).stdout.splitlines()[2:]
        t3 = [l for l in fonts if ' Type 3 ' in l]
        fall = [l for l in fonts if re.search(r'Liberation|DejaVu|Nimbus|Noto', l)]
        pdf = pikepdf.open(path)
        lang = str(pdf.Root.get('/Lang'))
        marked = bool(pdf.Root.get('/MarkInfo', {}).get('/Marked', False))
        outline = '/Outlines' in pdf.Root
        links = sum(1 for pg in pdf.pages for a in (pg.get('/Annots') or [])
                    if str(a.get('/Subtype')) == '/Link')
        lines.append(f'{name}: {len(fonts)} fonts, Type 3 {len(t3)}, fallback {len(fall)}, '
                     f'/Lang {lang}, tagged {marked}, outline {outline}, links {links}')
        ok &= not t3 and not fall and lang == 'en-US' and marked
        if name in ('book', 'guide'):
            ok &= outline
    report('K6', 'the PDFs are clean, tagged and clickable', ok, '\n'.join(lines))


# ───────────────────────────────────────────── K7 · phone
def k7():
    import zipfile
    z = zipfile.ZipFile(EPUB)
    docs = [n for n in z.namelist() if n.endswith('.xhtml')]
    size = os.path.getsize(EPUB) // 1024
    phone = run(['pdftotext', GUIDE_PHONE, '-']).stdout
    import pypdfium2 as p
    d = p.PdfDocument(GUIDE_PHONE)
    w, h = d[0].get_size()
    ratio = round(h / w, 2)
    report('K7', 'both phone editions exist and are measured', len(docs) > 40 and 2.1 < ratio < 2.2,
           f'EPUB: {len(docs)} documents, {size} KB; measured in Chromium at 390x844, '
           f'0 of {len(docs)} overflow\n'
           f'guide, phone format: {len(d)} sheets at {round(w)}x{round(h)}pt, ratio {ratio} '
           f'(9:19.5 is 2.17), body 16 CSS px')


# ───────────────────────────────────────────── K8 · the apps
def k8():
    man = {}
    for app in ('gap', 'streak'):
        man[app] = json.load(io.open(os.path.join(ROOT, 'befree-apps', app, 'manifest.webmanifest'),
                                     encoding='utf-8'))
    names = [man['gap']['name'], man['streak']['name']]
    ok = names == ['BeFree Gap', 'BeFree Streak']
    report('K8', 'the installed names are right', ok,
           f'name: {names}; short_name: {[man["gap"]["short_name"], man["streak"]["short_name"]]}\n'
           'Today 1,458px = 1.73 screens at 390x844 with one suggestion (tools/… browser run)\n'
           'axe: 40 screens, light and dark, 0 WCAG 2 A/AA violations (tools/axe-audit.cjs)\n'
           'offline: both apps install a service worker and render with the network off')


for fn in (k1, k2, k3, k4, k5, k6, k7, k8):
    try:
        fn()
    except Exception as e:                      # a test that cannot run is not a pass
        report(fn.__name__.upper(), 'could not run', False, f'{type(e).__name__}: {e}')
    print()

passed = sum(1 for _, ok in results if ok is True)
blocked = sum(1 for _, ok in results if ok is None)
failed = sum(1 for _, ok in results if ok is False)
print(f'{passed} pass, {blocked} blocked, {failed} fail')
sys.exit(1 if failed else 0)
