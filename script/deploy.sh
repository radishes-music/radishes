git clone https://$2 temp
cp -r temp/.git $3/.git

cd $3

cp index.html 404.html

git config user.name "Link"
git config user.email "link19970507@gmail.com"

git add .

git commit -m "Github Actions auto builder at $(date +'%Y-%m-%d %H:%M:%S')"
git branch -M main

git push --quiet "https://$1@$2" main:main

rm -rf temp

echo "Successful"
