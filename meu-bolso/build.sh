#!/bin/bash
# Monta index.html a partir do template + parser.js
cd "$(dirname "$0")"
python3 - <<'PY'
t=open('app.template.html',encoding='utf8').read()
p=open('parser.js',encoding='utf8').read()
open('index.html','w',encoding='utf8').write(t.replace('/*PARSER*/',p))
PY
