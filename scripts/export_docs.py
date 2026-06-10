"""
Exports OpenAPI spec and Postman collection to /docs directory.

Run from project root:
    python3 scripts/export_docs.py
"""

import json
import sys
import os
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs")
BASE_URL = "http://127.0.0.1:8000"


def fetch_openapi() -> dict:
    with urllib.request.urlopen(f"{BASE_URL}/openapi.json") as r:
        return json.loads(r.read())


def build_postman(spec: dict) -> dict:
    info = spec.get("info", {})
    folders: dict[str, list] = {}

    for path, methods in spec.get("paths", {}).items():
        for method, operation in methods.items():
            if method.upper() not in ("GET", "POST", "PUT", "PATCH", "DELETE"):
                continue

            tags = operation.get("tags", ["general"])
            tag = tags[0]

            # Build URL with path params shown as Postman variables
            postman_url = path.replace("{", ":").replace("}", "")
            url_parts = [p for p in postman_url.split("/") if p]

            request_body = None
            body_schema = (
                operation.get("requestBody", {})
                .get("content", {})
                .get("application/json", {})
                .get("schema", {})
            )
            if body_schema:
                example = _schema_to_example(body_schema, spec)
                request_body = {
                    "mode": "raw",
                    "raw": json.dumps(example, indent=2),
                    "options": {"raw": {"language": "json"}},
                }

            params = [
                {
                    "key": p["name"],
                    "value": "",
                    "description": p.get("description", ""),
                    "disabled": not p.get("required", False),
                }
                for p in operation.get("parameters", [])
                if p.get("in") == "query"
            ]

            headers = [{"key": "Content-Type", "value": "application/json"}]
            security = operation.get("security", spec.get("security", []))
            if security:
                headers.append({"key": "Authorization", "value": "Bearer {{access_token}}"})

            item = {
                "name": operation.get("summary", f"{method.upper()} {path}"),
                "request": {
                    "method": method.upper(),
                    "header": headers,
                    "url": {
                        "raw": f"{{{{base_url}}}}/{'/'.join(url_parts)}",
                        "host": ["{{base_url}}"],
                        "path": url_parts,
                        "query": params,
                    },
                },
                "response": [],
            }

            if request_body:
                item["request"]["body"] = request_body

            folders.setdefault(tag, []).append(item)

    return {
        "info": {
            "name": info.get("title", "API"),
            "description": info.get("description", ""),
            "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
        },
        "item": [
            {"name": tag, "item": items}
            for tag, items in folders.items()
        ],
        "variable": [
            {"key": "base_url", "value": BASE_URL},
            {"key": "access_token", "value": ""},
        ],
    }


def _schema_to_example(schema: dict, spec: dict) -> dict | list | str | int | float | bool:
    if "$ref" in schema:
        ref_path = schema["$ref"].lstrip("#/").split("/")
        ref = spec
        for key in ref_path:
            ref = ref[key]
        return _schema_to_example(ref, spec)

    schema_type = schema.get("type")

    if schema_type == "object" or "properties" in schema:
        result = {}
        for prop, prop_schema in schema.get("properties", {}).items():
            result[prop] = _schema_to_example(prop_schema, spec)
        return result

    if schema_type == "array":
        items = schema.get("items", {})
        return [_schema_to_example(items, spec)]

    examples = {
        "string": schema.get("example", schema.get("default", "")),
        "integer": schema.get("example", schema.get("default", 0)),
        "number": schema.get("example", schema.get("default", 0.0)),
        "boolean": schema.get("example", schema.get("default", True)),
    }
    return examples.get(schema_type, "")


def main():
    os.makedirs(DOCS_DIR, exist_ok=True)

    print("Fetching OpenAPI spec...")
    spec = fetch_openapi()

    openapi_path = os.path.join(DOCS_DIR, "openapi.json")
    with open(openapi_path, "w") as f:
        json.dump(spec, f, indent=2)
    print(f"Saved: {openapi_path}")

    print("Building Postman collection...")
    collection = build_postman(spec)

    postman_path = os.path.join(DOCS_DIR, "postman_collection.json")
    with open(postman_path, "w") as f:
        json.dump(collection, f, indent=2)
    print(f"Saved: {postman_path}")

    endpoints = sum(
        len(methods) for methods in spec.get("paths", {}).values()
    )
    print(f"\nDocumented {endpoints} endpoints across {len(spec.get('paths', {}))} paths.")


if __name__ == "__main__":
    main()
