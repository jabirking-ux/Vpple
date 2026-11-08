from fontTools.ttLib import TTFont

font = TTFont('dist/ttf/SPProDisplay-Regular.ttf')
ref = TTFont('ref_SF-Pro-Display-Regular.otf')

print('Font name records:')
for r in font['name'].names:
    if r.nameID in [1, 2, 4, 6]:
        print(f'  ID {r.nameID}: {r.toUnicode()}')

print('Units per Em:', font['head'].unitsPerEm)
print('Ascender / Descender:', font['OS/2'].sTypoAscender, font['OS/2'].sTypoDescender)

f_cmap = font.getBestCmap()
r_cmap = ref.getBestCmap()
f_hmtx = font['hmtx']
r_hmtx = ref['hmtx']

sample_chars = ['A', 'W', 'g', '1', '2', '8', '0', ',', '.', '{', '}', '@']
for ch in sample_chars:
    cp = ord(ch)
    fw = f_hmtx[f_cmap[cp]][0]
    rw = r_hmtx[r_cmap[cp]][0]
    diff = fw - rw
    print(f'Char {ch}: SP={fw}, SF={rw}, diff={diff}')
