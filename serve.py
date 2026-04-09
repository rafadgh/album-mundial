#!/usr/bin/env python3
import os, sys
os.chdir('/Users/rafadiez/Documents/CLAUDE/PANINI')
port = int(os.environ.get('PORT', 8080))
from http.server import HTTPServer, SimpleHTTPRequestHandler
httpd = HTTPServer(('', port), SimpleHTTPRequestHandler)
print(f'Serving on port {port}', flush=True)
httpd.serve_forever()
