#!/usr/bin/env python3
"""
Build DATA/perguntas.json from the provided CSV with Portuguese headers.

Usage:
  python scripts/build_perguntas_from_csv.py --csv DATA/perguntas_biblicas_final_Version2.csv --out DATA/perguntas.json

Assumptions / mapping:
  - CSV header "Cód. Pergunta" -> id (string)
  - "Pergunta" -> pergunta
  - "Opção A".."Opção D" -> opcoes (array in that order)
  - "Correta" -> resposta_correta (text of correct option)
  - "Referência Bíblica" -> referencia
  - "Texto Bíblico Transcrito (TNM)" -> texto_biblico
  - dificuldade: default to 2 for all new entries (unless the CSV contains a 'dificuldade' column)
  - tags: default to [] unless CSV has 'tags' column

The script overwrites the output file.
"""
import argparse
import csv
import json
from pathlib import Path


def build(csv_path: Path, out_path: Path):
    with csv_path.open(newline='', encoding='utf-8') as fh:
        reader = csv.DictReader(fh)
        rows = [r for r in reader]

    out = []
    for r in rows:
        # get id from possible header variants
        rid = None
        for key in ['Cód. Pergunta', 'Cód. pergunta', 'Cod. Pergunta', 'Cod. pergunta', 'ID', 'id']:
            if key in r and r[key].strip() != '':
                rid = r[key].strip()
                break
        if not rid:
            # skip rows without id
            print('Skipping row without id:', r)
            continue

        pergunta = r.get('Pergunta') or r.get('pergunta') or ''
        # collect options in A-D order
        opcoes = []
        for letter in ['A','B','C','D']:
            # possible headers: 'Opção A', 'Opção A '
            candidates = [f'Opção {letter}', f'Opção {letter}', f'Opção {letter}', f'Opção {letter}']
            # fallback to simpler headers
            val = r.get(f'Opção {letter}') or r.get(f'Opção {letter} ' )
            if val is None:
                # try common English-ish headers
                val = r.get(f'Opcao {letter}') or r.get(letter)
            if val is None:
                val = ''
            opcoes.append(val)

        resposta = r.get('Correta') or r.get('correta') or ''
        referencia = r.get('Referência Bíblica') or r.get('Referência') or r.get('Referencia') or ''
        texto = r.get('Texto Bíblico Transcrito (TNM)') or r.get('Texto Bíblico') or r.get('Texto Bíblico Transcrito') or ''

        # tags and dificuldade if present
        tags = []
        tags_field = r.get('Tags') or r.get('tags') or ''
        if tags_field.strip() != '':
            # try separators
            raw = tags_field
            for sep in ['|',';',';;',',']:
                if sep in raw:
                    tags = [p.strip() for p in raw.split(sep) if p.strip()]
                    break
            else:
                tags = [raw.strip()]

        dificuldade = 2
        diff_field = r.get('Dificuldade') or r.get('dificuldade') or ''
        if diff_field.strip() != '':
            raw = diff_field.strip().lower()
            if raw in ['básico', 'basico', '1']:
                dificuldade = 1
            elif raw in ['intermediário', 'intermediario', '2']:
                dificuldade = 2
            elif raw in ['avançado', 'avancado', 'expert', '3']:
                dificuldade = 3
            else:
                try:
                    dificuldade = int(raw)
                except Exception:
                    try:
                        dificuldade = int(float(raw))
                    except Exception:
                        dificuldade = 2

        obj = {
            'id': str(rid),
            'pergunta': pergunta.strip(),
            'opcoes': [o.strip() for o in opcoes],
            'resposta_correta': resposta.strip(),
            'tags': tags,
            'dificuldade': dificuldade,
            'referencia': referencia.strip(),
            'texto_biblico': texto.strip()
        }
        out.append(obj)

    # write file
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open('w', encoding='utf-8') as fh:
        json.dump(out, fh, ensure_ascii=False, indent=2)
    print('Wrote', len(out), 'questions to', out_path)


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--csv', required=True)
    p.add_argument('--out', required=True)
    args = p.parse_args()
    build(Path(args.csv), Path(args.out))
