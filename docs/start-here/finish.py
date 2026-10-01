import pypdf,pypdfium2,os,sys

P=os.path.join(os.path.dirname(__file__),'Start-Here-The-BeFree-System.pdf')
meta={'/Title':'Start Here: The BeFree System','/Author':'Abdel Elassass','/Subject':'Quick start guide to the BeFree system','/Keywords':'BeFree, quick start, personal finance, budgeting, BeFree Gap, BeFree Streak, paycheck to paycheck'}
w=pypdf.PdfWriter(clone_from=pypdf.PdfReader(P));w.add_metadata(meta)
with open(P,'wb') as f:w.write(f)
d=pypdfium2.PdfDocument(P);print('pages',len(d),'size',os.path.getsize(P)//1024,'KB')
