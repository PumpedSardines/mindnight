VERSION_FRONTEND=$(cat ./frontend/VERSION)
VERSION_BACKEND=$(cat ./backend/VERSION)

docker build --platform=linux/amd64 -t theresistance-frontend ./frontend
docker tag theresistance-frontend "pumpedsardines/theresistance-frontend:$VERSION_FRONTEND"
docker tag theresistance-frontend "pumpedsardines/theresistance-frontend:latest"
docker push "pumpedsardines/theresistance-frontend:$VERSION_FRONTEND"
docker push "pumpedsardines/theresistance-frontend:latest"

docker build --platform=linux/amd64 -t theresistance-backend ./backend
docker tag theresistance-backend "pumpedsardines/theresistance-backend:$VERSION_BACKEND"
docker tag theresistance-backend "pumpedsardines/theresistance-backend:latest"
docker push "pumpedsardines/theresistance-backend:$VERSION_BACKEND"
docker push "pumpedsardines/theresistance-backend:latest"
