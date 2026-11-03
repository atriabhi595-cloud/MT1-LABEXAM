# MT1-LABEXAM - Library Book Management

## Setup
```
npm install
```
## Run (two terminals)
```
node httpServer.js     # http://localhost:3000  (/, /books, /about, /home, POST /add-book)
node expressApp.js     # http://localhost:4000  (GET/POST /books, GET/PUT/DELETE /books/:id)
```
## Git
```
git init
git add .
git commit -m "Initial project setup"
git branch -M main
git remote add origin https://github.com/<your-id>/MT1-LABEXAM.git
git push -u origin main
```
Suggested commits: "Add HTTP server (Part A)", "Add Express CRUD API (Part B)", "Add screenshots".
