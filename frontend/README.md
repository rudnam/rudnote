When building for prod, specify api url:

```bash
docker build -t rudnam/rudnote-frontend --build-arg VITE_API_URL=/api ./frontend
docker push rudnam/rudnote-frontend
```
