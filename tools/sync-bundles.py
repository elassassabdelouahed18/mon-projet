#!/usr/bin/env python3
"""Copy each app's source files into the <script data-befree-bundle="…"> blocks
of its index.html, byte for byte. Run after editing any bundled .js file:

    python3 tools/sync-bundles.py          # rewrite the blocks
    python3 tools/sync-bundles.py --check  # exit 1 if any block is stale
"""
import os, re, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'befree-apps')
BLOCK = re.compile(r'(<script data-befree-bundle="([^"]+)">)(.*?)(</script>)', re.S)

def main(check):
    stale = []
    for app in ('gap', 'streak'):
        page = os.path.join(ROOT, app, 'index.html')
        html = open(page, encoding='utf-8', newline='').read()
        def fill(m):
            src = os.path.normpath(os.path.join(ROOT, app, m.group(2)))
            code = open(src, encoding='utf-8', newline='').read()
            if '</script' in code.lower():
                sys.exit(f'{src} contains "</script" and cannot be embedded')
            if m.group(3) != code:
                stale.append(f'{app}/index.html <- {m.group(2)}')
            return m.group(1) + code + m.group(4)
        out = BLOCK.sub(fill, html)
        if not check and out != html:
            open(page, 'w', encoding='utf-8', newline='').write(out)
    for s in stale:
        print(('stale: ' if check else 'synced: ') + s)
    return 1 if check and stale else 0

if __name__ == '__main__':
    sys.exit(main('--check' in sys.argv))
