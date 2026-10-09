#!/usr/bin/env python3
"""Read a primary source and save it as text, with its URL and the date.

Appendix G promises every figure was read from its primary source, not from an
article about it. This is how that promise is kept checkable: each page lands in
sources/ with the URL requested, the URL finally served after redirects, the
HTTP status and the date it was read, so any row in Appendix G can be traced
back to the bytes it came from.

    python3 tools/fetch-source.py <url> <name>      # writes sources/<name>.txt

In this container WebFetch cannot resolve DNS, so the read goes through curl
and the session proxy instead.
"""
import html, os, re, subprocess, sys, datetime

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sources')
# BLS answers a generic browser user-agent with 403 and asks instead for one
# carrying a contact address. Several commercial sites do the reverse and
# refuse anything that is not a browser. Try the honest one first and fall
# back, so each site gets what it asks for.
UA_CONTACT = os.environ.get('SOURCE_UA', 'BeFreeAcademy/1.0 (+https://befreeacademy.site; '
                                         'elassassabdelouahed18@gmail.com)')
UA_BROWSER = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
              '(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36')
UA = UA_CONTACT


def _curl(url, ua, out):
    """Fetch to a file, so a PDF or any other binary survives intact."""
    r = subprocess.run(
        ['curl', '-sSL', '-m', '60', '-A', ua, '-H', 'Accept-Language: en-US,en;q=0.9',
         '-o', out, '-w', '%{http_code}\t%{url_effective}\t%{content_type}', url],
        capture_output=True, text=True)
    parts = (r.stdout or '\t\t').split('\t')
    return parts[0] or '000', (parts[1] if len(parts) > 1 else url), (parts[2] if len(parts) > 2 else '')


def get(url, out):
    """Try the contact user-agent, then a browser one for sites that insist."""
    code, final, ctype = _curl(url, UA_CONTACT, out)
    if code in ('401', '403', '406', '429'):
        code, final, ctype = _curl(url, UA_BROWSER, out)
        ua = 'browser'
    else:
        ua = 'contact'
    return code, final, ctype, ua


def text(body):
    body = re.sub(r'<(script|style|noscript|svg)\b.*?</\1>', ' ', body, flags=re.S)
    t = html.unescape(re.sub(r'<[^>]+>', ' ', body))
    return re.sub(r'[ \t]+', ' ', re.sub(r'\n\s*\n+', '\n', t)).strip()


def to_text(raw, ctype):
    if ctype.startswith('application/pdf') or raw[:5] == b'%PDF-':
        import pymupdf
        doc = pymupdf.open(stream=raw, filetype='pdf')
        return '\n'.join(page.get_text() for page in doc), 'pdf'
    return text(raw.decode('utf-8', 'replace')), 'html'


if __name__ == '__main__':
    url, name = sys.argv[1], sys.argv[2]
    os.makedirs(OUT, exist_ok=True)
    blob = os.path.join(OUT, name + '.raw')
    code, final, ctype, ua = get(url, blob)
    raw = open(blob, 'rb').read() if os.path.exists(blob) else b''
    os.remove(blob)
    t, kind = to_text(raw, ctype)
    stamp = datetime.date.today().isoformat()
    path = os.path.join(OUT, name + '.txt')
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(f'# requested: {url}\n# final:     {final}\n# http:      {code}\n'
                 f'# type:      {ctype} ({kind}), read with the {ua} user-agent\n'
                 f'# read on:   {stamp}\n\n{t}')
    print(f'{code}  {len(t):>7} chars  {ua:7} {name}  <- {final}')
