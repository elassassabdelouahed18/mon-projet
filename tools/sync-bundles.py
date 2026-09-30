#!/usr/bin/env python3
"""Copy each app's source files into the <script data-befree-bundle="…"> blocks
of its index.html, byte for byte, then pin every inline script in the page's
Content-Security-Policy by its sha256 hash, so no other inline script can run.
Run after editing any bundled .js file or inline script:

    python3 tools/sync-bundles.py          # rewrite the blocks
    python3 tools/sync-bundles.py --check  # exit 1 if any block is stale
"""
import base64, hashlib, os, re, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'befree-apps')
BLOCK = re.compile(r'(<script data-befree-bundle="([^"]+)">)(.*?)(</script>)', re.S)
INLINE = re.compile(r'<script(?![^>]*\ssrc=)[^>]*>(.*?)</script>', re.S)
CSP_SCRIPT = re.compile(r"(<meta http-equiv=\"Content-Security-Policy\" content=\"[^\"]*?script-src )[^;\"]*")


def pin_scripts(html):
    """script-src 'self' plus one hash per inline script. The browser hashes
    the text after the HTML parser turns CRLF into LF, so hash that."""
    hashes = []
    for m in INLINE.finditer(html):
        text = m.group(1).replace('\r\n', '\n').replace('\r', '\n')
        h = "'sha256-" + base64.b64encode(hashlib.sha256(text.encode('utf-8')).digest()).decode() + "'"
        if h not in hashes:
            hashes.append(h)
    out, n = CSP_SCRIPT.subn(lambda m: m.group(1) + ' '.join(["'self'"] + hashes), html)
    if n != 1:
        sys.exit('expected exactly one CSP meta tag with script-src')
    return out

def main(check):
    stale = []
    for app in ('gap', 'streak'):
        page = os.path.join(ROOT, app, 'index.html')
        html = open(page, encoding='utf-8', newline='').read()
        before = len(stale)
        def fill(m):
            src = os.path.normpath(os.path.join(ROOT, app, m.group(2)))
            code = open(src, encoding='utf-8', newline='').read()
            if '</script' in code.lower():
                sys.exit(f'{src} contains "</script" and cannot be embedded')
            if m.group(3) != code:
                stale.append(f'{app}/index.html <- {m.group(2)}')
            return m.group(1) + code + m.group(4)
        out = pin_scripts(BLOCK.sub(fill, html))
        if out != html and len(stale) == before:
            stale.append(f'{app}/index.html <- script hashes')
        if not check and out != html:
            open(page, 'w', encoding='utf-8', newline='').write(out)
    for s in stale:
        print(('stale: ' if check else 'synced: ') + s)
    return 1 if check and stale else 0

if __name__ == '__main__':
    sys.exit(main('--check' in sys.argv))
