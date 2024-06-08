import http.server
import socketserver
import json
import os
from urllib.parse import urlparse, parse_qs
from armod_decryptor import process_config
from netmod_decryptor import decrypt_file
from sockshttp_decryptor import decrypt_file as file_sockshttp
from opentunnel_decryptor import decrypt_file as tnl_decryptor

PORT = 8000
DIRECTORY = "static"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path == '/decrypt':
            self.handle_decrypt(process_config)
        elif self.path == '/decrypt-file':
            self.handle_file_decrypt(decrypt_file)
        elif self.path == '/file_sockshttp':
            self.handle_file_decrypt(file_sockshttp)
        elif self.path == '/file_opentunnel':
            self.handle_file_decrypt(tnl_decryptor)
        else:
            self.send_error(404, "File not found")

    def handle_decrypt(self, decrypt_function):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        encrypted_content = data.get('encryptedContent')
        if not encrypted_content:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"result": "No encrypted content provided"}')
            return
        try:
            result = decrypt_function(encrypted_content)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'result': result}).encode())
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({'result': f'Error: {str(e)}'}).encode())

    def handle_file_decrypt(self, decrypt_function):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        file_content = data.get('fileContent')
        if not file_content:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'{"result": "No file content provided"}')
            return
        try:
            result = decrypt_function(file_content)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'result': result}).encode())
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({'result': f'Error: {str(e)}'}).encode())

os.chdir(DIRECTORY)
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
