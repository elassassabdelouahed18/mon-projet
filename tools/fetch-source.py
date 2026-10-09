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
UA = ('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) '
      'Chrome/141.0.0.0 Safari/537.36')


def get(url):
    r = subprocess.run(['curl', '-sSL', '-m', '45', '-A', UA, '-w', '\n@@%{http_code}@@%{url_effective}', url],
                       capture_output=True, text=True)
    body = r.stdout
    code, final = '000', url
    m = re.search(r'\n@@(\d+)@@(.*)$', body, re.S)
    if m:
        code, final = m.group(1), m.group(2).strip()
        body = body[:m.start()]
    return code, final, body


def text(body):
    body = re.sub(r'<(script|style|noscript|svg)\b.*?</\1>', ' ', body, flags=re.S)
    t = html.unescape(re.sub(r'<[^>]+>', ' ', body))
    return re.sub(r'[ \t]+', ' ', re.sub(r'\n\s*\n+', '\n', t)).strip()


if __name__ == '__main__':
    url, name = sys.argv[1], sys.argv[2]
    code, final, body = get(url)
    os.makedirs(OUT, exist_ok=True)
    t = text(body)
    stamp = datetime.date.today().isoformat()
    path = os.path.join(OUT, name + '.txt')
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(f'# requested: {url}\n# final:     {final}\n# http:      {code}\n# read on:   {stamp}\n\n{t}')
    print(f'{code}  {len(t):>7} chars  {name}  <- {final}')
