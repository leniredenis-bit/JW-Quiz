#!/usr/bin/env python3
"""
Update DATA/perguntas.json from a CSV file exported by the editor.

Usage:
  python scripts/update_questions_from_csv.py --csv PATH_TO_CSV --json DATA/perguntas.json [--backup] [--add-criancas]

The script matches rows by `id` field. It will update any of these JSON keys when the CSV has the corresponding column:
  - pergunta
  - opcoes (expects a separator like `|` or `;` or `,`) -> will become a JSON array
  - resposta_correta
  - tags (comma/semicolon/pipe separated) -> will become array
  - dificuldade (int)
  - referencia
  - texto_biblico

If a CSV row has an `id` that does not exist in the JSON, the script will optionally ADD the entry if --add-new is passed.

It makes a backup of the JSON file before writing.
"""
import argparse
import csv
import json
import shutil
import sys
from pathlib import Path
from datetime import datetime


def parse_list_field(s: str):
    if s is None:
        return None
    s = s.strip()
    if not s:
        return []
    # try common separators
    for sep in ['|', ';', ';;', ',']:
        if sep in s:
            parts = [p.strip() for p in s.split(sep) if p.strip()]
            return parts
    return [s]


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--csv', required=True, help='Path to CSV file')
    p.add_argument('--json', default='DATA/perguntas.json', help='Path to perguntas.json')
    p.add_argument('--backup', action='store_true', help='Create a backup of the JSON before writing')
    p.add_argument('--add-new', action='store_true', help='If CSV row id not found, add as new entry')
    p.add_argument('--add-criancas', action='store_true', help='Add tag "crianças" to all questions with dificuldade==1')
    args = p.parse_args()

    csv_path = Path(args.csv)
    json_path = Path(args.json)

    if not csv_path.exists():
        print('CSV not found:', csv_path)
        sys.exit(2)
    if not json_path.exists():
        print('JSON not found:', json_path)
        sys.exit(2)

    # Backup
    if args.backup:
        bak = json_path.with_suffix(json_path.suffix + f'.bak.{datetime.now().strftime("%Y%m%d%H%M%S")}')
        shutil.copy2(json_path, bak)
        print('Backup created at', bak)

    with csv_path.open(newline='', encoding='utf-8') as fh:
        reader = csv.DictReader(fh)

        def normalize_row(r: dict):
            # normalize common alternative column names from the exported CSV
            nr = {}
            # id
            nr['id'] = r.get('id') or r.get('ID') or r.get('Cód. Pergunta') or r.get('Cód. Perg') or r.get('Cód. pergunta')
            # pergunta
            nr['pergunta'] = r.get('pergunta') or r.get('Pergunta')
            # opções: either a single 'opcoes' column or multiple 'Opção A'..'Opção D'
            if 'opcoes' in r and r.get('opcoes'):
                nr['opcoes'] = r.get('opcoes')
            else:
                opts = []
                for key in ['Opção A', 'Opção B', 'Opção C', 'Opção D', 'Opção 1', 'Opção 2', 'Opção 3', 'Opção 4']:
                    v = r.get(key)
                    if v and v.strip() != '':
                        opts.append(v.strip())
                if opts:
                    # store as a single string here; later parsed by existing logic
                    nr['opcoes'] = '|'.join(opts)
            # resposta correta
            nr['resposta_correta'] = r.get('resposta_correta') or r.get('Correta') or r.get('Correta:')
            # referencia and texto biblico
            nr['referencia'] = r.get('referencia') or r.get('Referência Bíblica') or r.get('Referencia')
            nr['texto_biblico'] = r.get('texto_biblico') or r.get('Texto Bíblico Transcrito (TNM)') or r.get('Texto Bíblico')
            # tags and dificuldade
            nr['tags'] = r.get('tags') or r.get('Tags')
            nr['dificuldade'] = r.get('dificuldade') or r.get('Dificuldade')
            # preserve original row for debugging prints if needed
            nr['_orig'] = r
            return nr

        rows = [normalize_row(r) for r in reader]

    with json_path.open(encoding='utf-8') as fh:
        data = json.load(fh)

    # index existing by id (string)
    index = {str(item.get('id')): item for item in data if isinstance(item, dict) and 'id' in item}

    updated = 0
    added = 0

    for r in rows:
        # r is already normalized
        rid = r.get('id')
        if not rid:
            # print original row for easier debugging
            print('Skipping CSV row without id:', r.get('_orig') if isinstance(r, dict) else r)
            continue
        rid = str(rid).strip()
        target = index.get(rid)

        fields_to_update = {}
        # map CSV columns to JSON keys if present
        for col in ['pergunta','resposta_correta','referencia','texto_biblico']:
            v = r.get(col)
            if v and isinstance(v, str) and v.strip() != '':
                fields_to_update[col] = v.strip()

        if r.get('opcoes') and isinstance(r.get('opcoes'), str) and r.get('opcoes').strip() != '':
            fields_to_update['opcoes'] = parse_list_field(r['opcoes'])

        if r.get('tags') and isinstance(r.get('tags'), str) and r.get('tags').strip() != '':
            fields_to_update['tags'] = parse_list_field(r['tags'])

        if r.get('dificuldade') and isinstance(r.get('dificuldade'), str) and r.get('dificuldade').strip() != '':
            try:
                fields_to_update['dificuldade'] = int(r['dificuldade'])
            except Exception:
                fields_to_update['dificuldade'] = r['dificuldade']

        if target is None:
            if args.add_new:
                # create minimal new object
                new_obj = {'id': rid}
                new_obj.update(fields_to_update)
                data.append(new_obj)
                index[rid] = new_obj
                added += 1
                print('Added new question id=', rid)
            else:
                print('CSV id not found in JSON (skip):', rid)
            continue

        # apply updates
        changed = False
        for k,v in fields_to_update.items():
            if target.get(k) != v:
                target[k] = v
                changed = True

        if changed:
            updated += 1
            print('Updated id=', rid)

    # optional: add tag 'crianças' to dificuldade==1
    if args.add_criancas:
        added_cr = 0
        for item in data:
            if isinstance(item, dict) and item.get('dificuldade') == 1:
                tags = item.get('tags') or []
                if 'crianças' not in tags and 'crianças' not in [t.lower() for t in tags]:
                    tags.append('crianças')
                    item['tags'] = tags
                    added_cr += 1
        print('Added "crianças" to', added_cr, 'items with dificuldade==1')

    # write back
    with json_path.open('w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)

    print('Done. Updated=%d Added=%d' % (updated, added))


if __name__ == '__main__':
    main()
