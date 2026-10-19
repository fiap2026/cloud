import io,json,os,warnings
from pathlib import Path
from urllib.parse import urlsplit,parse_qs
from http.server import HTTPServer,BaseHTTPRequestHandler
from PIL import Image,ImageOps
import pymupdf

ROOT=Path(os.environ.get('COLLECTION_ROOT','/collections')).resolve()
WEB=Path(__file__).with_name('visor.html')
Image.MAX_IMAGE_PIXELS=50_000_000
warnings.simplefilter('error',Image.DecompressionBombWarning)
IMAGES={'.jpg','.jpeg','.png','.webp','.tif','.tiff','.bmp','.gif'}

def safe_path(raw):
    p=Path(raw)
    if p.is_absolute() or any(x in {'.','..'} or x.startswith(('.', '@','#')) for x in p.parts):
        raise PermissionError('Ruta no permitida')
    target=ROOT
    for part in p.parts:
        target=target/part
        if target.is_symlink():raise PermissionError('Enlaces no permitidos')
    target=target.resolve(strict=True)
    if not target.is_relative_to(ROOT):raise PermissionError('Fuera de la colección')
    return target

def kind(p):
    if p.is_dir():return 'folder'
    if p.suffix.lower() in IMAGES:return 'image'
    if p.suffix.lower()=='.pdf':return 'pdf'
    return 'unsupported'

class Handler(BaseHTTPRequestHandler):
    def send(self,status,data,mime='application/json; charset=utf-8'):
        if not isinstance(data,bytes):data=json.dumps(data,ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type',mime)
        self.send_header('Content-Length',str(len(data)))
        self.send_header('X-Content-Type-Options','nosniff')
        self.send_header('Cache-Control','no-store')
        self.send_header('Referrer-Policy','no-referrer')
        if self.headers.get('Origin')=='https://fiap2026.github.io':
            self.send_header('Access-Control-Allow-Origin','https://fiap2026.github.io')
            self.send_header('Vary','Origin')
        self.end_headers();self.wfile.write(data)
    def do_GET(self):
        try:
            url=urlsplit(self.path);q=parse_qs(url.query)
            if url.path=='/':return self.send(200,WEB.read_bytes(),'text/html; charset=utf-8')
            if url.path=='/health':
                if not ROOT.is_dir() or not os.access(ROOT,os.R_OK|os.X_OK):return self.send(503,{'ok':False,'error':'Colección no accesible'})
                with os.scandir(ROOT) as entries:next(entries,None)
                return self.send(200,{'ok':True,'service':'FIAP collections test','mode':'read-only'})
            if url.path not in {'/api/list','/api/preview'}:return self.send(404,{'error':'No encontrado'})
            raw=q.get('path',[''])[0];p=safe_path(raw)
            if url.path=='/api/list':
                offset=max(0,int(q.get('offset',['0'])[0]));limit=100
                if not p.is_dir():return self.send(400,{'error':'No es una carpeta'})
                entries=[]
                for child in p.iterdir():
                    if child.name.startswith(('.', '@','#')) or child.is_symlink():continue
                    try:
                        if child.is_dir() or child.is_file():entries.append({'name':child.name,'path':child.relative_to(ROOT).as_posix(),'kind':kind(child)})
                    except OSError:continue
                entries.sort(key=lambda x:(x['kind']!='folder',x['name'].casefold()))
                return self.send(200,{'path':raw,'items':entries[offset:offset+limit],'total':len(entries),'offset':offset,'limit':limit})
            typ=kind(p)
            if typ not in {'image','pdf'}:return self.send(415,{'error':'Vista previa disponible para imágenes y PDF. Otros formatos pendientes.'})
            if p.stat().st_size>200*1024*1024:return self.send(413,{'error':'Archivo superior a 200 MB; requiere vista previa preparada.'})
            page=0;pages=1
            if typ=='image':
                with Image.open(p) as source:
                    im=ImageOps.exif_transpose(source)
                    im.thumbnail((1600,1600))
                    if im.mode in ('RGBA','LA') or 'transparency' in im.info:
                        rgba=im.convert('RGBA');background=Image.new('RGBA',rgba.size,'white');background.alpha_composite(rgba);im=background.convert('RGB')
                    else:im=im.convert('RGB')
                    out=io.BytesIO();im.save(out,'JPEG',quality=85)
            else:
                with pymupdf.open(p) as doc:
                    if doc.needs_pass:return self.send(422,{'error':'PDF protegido con contraseña'})
                    pages=len(doc);page=int(q.get('page',['0'])[0])
                    if page<0 or page>=pages:return self.send(400,{'error':'Página no válida'})
                    sheet=doc[page];size=max(sheet.rect.width,sheet.rect.height)
                    if size<=0:raise ValueError('Página vacía')
                    pix=sheet.get_pixmap(matrix=pymupdf.Matrix(1600/size,1600/size),colorspace=pymupdf.csRGB,alpha=False)
                    im=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
                    out=io.BytesIO();im.save(out,'JPEG',quality=85)
            return self.send(200,{'image':'data:image/jpeg;base64,'+__import__('base64').b64encode(out.getvalue()).decode(),'page':page,'pages':pages})
        except FileNotFoundError:self.send(404,{'error':'Archivo o carpeta no encontrados'})
        except PermissionError:self.send(403,{'error':'Acceso no permitido. Revisar permisos de lectura del servicio.'})
        except (ValueError,Image.DecompressionBombError,Image.DecompressionBombWarning):self.send(422,{'error':'Archivo o parámetros fuera de los límites de esta prueba'})
        except (BrokenPipeError,ConnectionResetError):pass
        except Exception:self.send(500,{'error':'No se pudo generar la vista previa o leer la carpeta'})

if __name__=='__main__':HTTPServer(('0.0.0.0',8080),Handler).serve_forever()
