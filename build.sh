
#./node_modules/babel-cli/bin/babel.js ./_main.js -o ./main.js
./node_modules/babel-cli/bin/babel.js lib --out-dir ./dist
cp -R lib/client/index.html dist/client/index.html
cp -R lib/client/styles.css dist/client/styles.css
webpack
