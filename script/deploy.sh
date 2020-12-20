cd dist

cp index.html 404.html

git init

git config user.name "Link"
git config user.email "link19970507@gmail.com"
git config github.token $ACCESS_TOKEN

git remote add origin $GITHUB_REPO

git add .

git commit -m "Github Actions auto builder at $(date +'%Y-%m-%d %H:%M:%S')"
git branch -M main

git pull origin main
git push -u origin main

echo "Successful"
echo "online: https://hq001.github.io/"
