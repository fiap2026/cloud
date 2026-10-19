FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir Pillow PyMuPDF
COPY server.py visor.html /app/
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 COLLECTION_ROOT=/collections
USER 65534:65534
EXPOSE 8080
CMD ["python", "server.py"]
