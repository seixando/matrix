#!/usr/bin/env python3
"""
update-csp-hashes.py
Extrai todos os <script> inline do index.html, calcula os hashes SHA-256
e atualiza o Content-Security-Policy no vercel.json.

Uso:
    python3 scripts/update-csp-hashes.py
"""

import hashlib
import base64
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
HTML_FILE = ROOT / "index.html"
VERCEL_JSON = ROOT / "vercel.json"


def sha256_csp(content: str) -> str:
    digest = hashlib.sha256(content.encode("utf-8")).digest()
    return "'sha256-" + base64.b64encode(digest).decode() + "'"


def extract_inline_scripts(html: str) -> list[str]:
    """Retorna o conteúdo exato de cada <script> sem atributo src."""
    pattern = re.compile(
        r"<script(?![^>]*\bsrc\b)[^>]*>(.*?)</script>",
        re.DOTALL,
    )
    return [m.group(1) for m in pattern.finditer(html)]


def update_csp(csp: str, hashes: list[str]) -> str:
    """Substitui os sha256 existentes na diretiva script-src pelos novos."""
    # Remove hashes antigos
    csp = re.sub(r"'sha256-[A-Za-z0-9+/=]+'", "", csp)
    # Insere novos hashes no final de script-src
    joined = " ".join(hashes)
    csp = re.sub(r"(script-src\s+[^;]+)", r"\1 " + joined, csp)
    # Limpa espaços duplos
    csp = re.sub(r"  +", " ", csp)
    return csp.strip()


def main():
    if not HTML_FILE.exists():
        print(f"ERRO: {HTML_FILE} não encontrado.")
        sys.exit(1)
    if not VERCEL_JSON.exists():
        print(f"ERRO: {VERCEL_JSON} não encontrado.")
        sys.exit(1)

    html = HTML_FILE.read_text(encoding="utf-8")
    scripts = extract_inline_scripts(html)

    if not scripts:
        print("Nenhum script inline encontrado.")
        sys.exit(0)

    print(f"Scripts inline encontrados: {len(scripts)}")
    hashes = []
    for i, content in enumerate(scripts, 1):
        h = sha256_csp(content)
        hashes.append(h)
        preview = content.strip()[:60].replace("\n", " ")
        print(f"  [{i}] {h}  <- \"{preview}...\"")

    vercel = json.loads(VERCEL_JSON.read_text(encoding="utf-8"))

    updated = False
    for rule in vercel.get("headers", []):
        for header in rule.get("headers", []):
            if header.get("key") == "Content-Security-Policy":
                header["value"] = update_csp(header["value"], hashes)
                updated = True

    if not updated:
        print("AVISO: Content-Security-Policy não encontrado no vercel.json.")
        sys.exit(1)

    VERCEL_JSON.write_text(
        json.dumps(vercel, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"\nvercel.json atualizado com {len(hashes)} hash(es).")


if __name__ == "__main__":
    main()
