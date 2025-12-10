# CyberPort – Portfolio Cybersécurité (Symfony + Docker)

Un projet Symfony 7 dockerisé pour héberger votre portfolio de cybersécurité, avec une page d’accueil type mini-terminal.

## Démarrer

Prérequis: Docker Desktop (Windows)

1. Lancez Docker Desktop
2. Dans PowerShell à la racine du projet:

```powershell
docker compose up -d
```

3. Ouvrez http://localhost:8080

Arrêter:
```powershell
docker compose down
```

## Dépannage rapide

- Erreur 500 au premier lancement (cache/permissions sous Windows):
```powershell
docker compose exec -u root php sh -lc "chown -R www-data:www-data var vendor && rm -rf var/cache/dev && mkdir -p var/cache/dev && chown -R www-data:www-data var/cache"
```
- Logs:
```powershell
docker compose logs -f nginx
# ou
docker compose logs -f php
```

## Structure utile

- `docker-compose.yml` – Services `php` (PHP-FPM) et `nginx` (port 8080)
- `docker/` – Dockerfile PHP + conf Nginx
- `src/Controller/HomeController.php` – Page d’accueil `/`
- `templates/home/index.html.twig` – Vue avec mini-terminal
- `public/assets/terminal.css|js` – Styles et logique du terminal

## Personnaliser le terminal
Commandes disponibles: `help`, `about`, `skills`, `projects`, `contact`, `clear`.
Modifiez `public/assets/terminal.js` pour enrichir les réponses, ajouter des sous-commandes ou redirections vers des pages classiques.

## Idées de sections/évolutions
- Projets & labs: write-ups CTF, blue team (SIEM, détection), pentest éthique, homelab
- Timeline/expérience: incidents résolus, outils développés, certifications
- Démos interactives: mini terminal connecté à des endpoints Symfony (whoami, nmap mock, hash crack demo…)
- Blog (Markdown): articles sécurité, TTPs, détections Sigma
- Badges et métriques: certifs, score HTB/THM, GitHub
- Sécurité app:
  - En-têtes HTTP (CSP, HSTS), rate limiting Nginx
  - Audit `symfony security:check`, dépendances
  - Pages 404/500 personnalisées
- Tooling/dev:
  - Tests fonctionnels (Panther) et unitaires (PHPUnit)
  - CI (GitHub Actions) pour `composer validate`, tests et build

## Licence
Vous êtes libre d’utiliser/adapter ce squelette pour votre portfolio.

## Déploiement sur Railway

Ce projet est prêt pour un déploiement simple via Nixpacks (sans Nginx), en utilisant le serveur web intégré de PHP.

- Prérequis: dépôt Git (GitHub/GitLab), compte Railway
- Ce repo contient `nixpacks.toml` et `public/router.php` pour gérer le routage Symfony en production.

Étapes:
1. Poussez le code sur GitHub.
2. Dans Railway: Create Project → New Service → Deploy from Repo → sélectionnez ce dépôt.
3. Si Railway demande le « Root Directory », choisissez la racine du projet (celle qui contient `composer.json`).
4. Railway utilise Nixpacks et détecte PHP/Composer automatiquement. Le build exécutera `composer install --no-dev` et le démarrage: `php -S 0.0.0.0:$PORT public/router.php`.
5. Configurez les variables d’environnement dans Railway (Settings → Variables):
  - `APP_SECRET`: générez une valeur aléatoire (ex: `php -r "echo bin2hex(random_bytes(16));"`).
  - `TRUSTED_PROXIES`: `127.0.0.1,REMOTE_ADDR` (permet de faire confiance au proxy Railway).
  - `TRUSTED_HOSTS`: votre domaine Railway ou `.` pour accepter tout hôte.
  - Optionnel: `APP_ENV=prod` et `APP_DEBUG=0` (déjà définis via `nixpacks.toml`, vous pouvez aussi les gérer côté Railway).
6. Déployez et ouvrez l’URL Railway. Suivez les logs pour valider le démarrage.

Notes:
- Pas de base de données dans ce squelette. Si vous ajoutez une DB, reliez un plugin Postgres/MySQL sur Railway et définissez `DATABASE_URL`.
- En local vous avez Nginx + PHP-FPM via Docker, mais en production Railway utilise le serveur PHP intégré pour simplifier.

### Monorepo: `projects/ctf-lab`
Si vous souhaitez déployer les services Node du sous-dossier `projects/ctf-lab` (backend/proxy), créez des services séparés dans Railway en indiquant le dossier racine correspondant à chacun (`projects/ctf-lab/backend` et `projects/ctf-lab/proxy`). Le `frontend` est statique et peut être servi tel quel depuis Symfony (`public/projects/ctf-lab`).
