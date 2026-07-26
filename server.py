import http.server
import os

PORT = 8888
DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def guess_type(self, path):
        if path.endswith('.mp4'):
            return 'video/mp4'
        if path.endswith('.jpg') or path.endswith('.jpeg'):
            return 'image/jpeg'
        if path.endswith('.png'):
            return 'image/png'
        return super().guess_type(path)

if __name__ == '__main__':
    os.chdir(DIR)
    srv = http.server.HTTPServer(('0.0.0.0', PORT), Handler)
    print(f'Serving wedding site at http://localhost:{PORT}')
    srv.serve_forever()
