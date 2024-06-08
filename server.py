import http.server
import socketserver
import json
from urllib.parse import urlparse, parse_qs
from armod_decryptor import process_config
from netmod_decryptor import decrypt_file as decrypt_netmod_file
from sockshttp_decryptor import decrypt_file as decrypt_sockshttp_file
from opentunnel_decryptor import tnl_decryptor

PORT = 8000
DIRECTORY = "static"

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        response = {}

        if self.path == "/decrypt":
            data = json.loads(post_data)
            encrypted_content = data.get('encryptedContent')
            if not encrypted_content:
                response = {'result': 'No encrypted content provided'}
                self.send_response(400)
            else:
                try:
                    result = process_config(encrypted_content)
                    response = {'result': result}
                    self.send_response(200)
                except Exception as e:
                    response = {'result': f'Error: {str(e)}'}
                    self.send_response(500)

        elif self.path == "/decrypt-file":
            data = json.loads(post_data)
            file_content = data.get('fileContent')
            if not file_content:
                response = {'result': 'No file content provided'}
                self.send_response(400)
            else:
                try:
                    result = decrypt_netmod_file(file_content)
                    response = {'result': result}
                    self.send_response(200)
                except Exception as e:
                    response = {'result': f'Error: {str(e)}'}
                    self.send_response(500)

        elif self.path == "/decrypt-sockshttp-file":
            data = json.loads(post_data)
            file_content = data.get('fileContent')
            if not file_content:
                response = {'result': 'No file content provided'}
                self.send_response(400)
            else:
                try:
                    result = decrypt_sockshttp_file(file_content)
                    response = {'result': result}
                    self.send_response(200)
                except Exception as e:
                    response = {'result': f'Error: {str(e)}'}
                    self.send_response(500)

        elif self.path == "/file_opentunnel":
            data = json.loads(post_data)
            file_content = data.get('fileContent')
            if not file_content:
                response = {'result': 'No file content provided'}
                self.send_response(400)
            else:
                try:
                    result = tnl_decryptor(file_content)
                    response = {'result': result}
                    self.send_response(200)
                except Exception as e:
                    response = {'result': f'Error: {str(e)}'}
                    self.send_response(500)

        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())

Handler = CustomHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
    
