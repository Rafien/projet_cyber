install front :  
  
cd front\frontend  
npm i  
npm start  
  
  
install server :  
  
create db  
set db in .env file  
cd my-project  
npm i  
node server.js  
  
  
Failles :   
  
Admin accessible par tout le monde :   
    Faille :  
        La route /admin/users est accessible par tout utilisateur  
    Fix :  
        Mettre une securité redirigant les user sans role et acceptant uniquement les admins  
  
Profil de chaque utilisateur accessible via id  
    Faille :  
        L'id de l'utilisateur est passé en query, on peut donc acceder a n'importe quel profile juste en essayant des id  
    Fix :   
        Changer la route pour profile/me qui recupere l'id de l'uilisateur en cookie/localStorage  
  
Id stocké en Brut en localStorage  
    Faille :   
        l'Id de l'utilisateur est stocké en localStorage sans aucune forme de sécurité  
    Fix :   
        passer par un JWT  

Enlevé car j'arrive pas a le rendre non-protégé sans enlever le check de mots de passe encodé  
SQL injection on login  
    Faille:  
        Injection possible pour recup le compte admin  
    Fix :  
        Changer la requete pour :  
        'SELECT id, password FROM users WHERE username = $1', [username]'   
        Ajouter une verification de mots de passe : const isMatch = await bcrypt.compare(password, user.password)
