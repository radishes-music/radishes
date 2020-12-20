git clone https://$GITHUB_REPO temp
cp -r temp/.git dist/.git

cd dist

cp index.html 404.html

git config user.name "Link"
git config user.email "link19970507@gmail.com"

git add .

git commit -m "Github Actions auto builder at $(date +'%Y-%m-%d %H:%M:%S')"
git branch -M main

git push --quiet "https://$ACCESS_TOKEN@$GITHUB_REPO" main:main

rm -rf temp

echo "Successful"
echo "online: https://hq001.github.io/"
