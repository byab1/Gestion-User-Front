# Gestion des Utilisateurs - Frontend Vue 3

## 🌟 Description

Cette application frontend est développée avec **Vue 3**, **TailwindCSS** et **PrimeVue**.  
Elle permet de gérer les utilisateurs, avec authentification, rôles, tableau des utilisateurs, filtres dynamiques et notifications.

---

## ⚙️ Installation


### 1. Cloner le dépôt

```sh
git clone <repo-url>
cd frontend
``` 

### 2. Installer les dépendances
```sh
npm install
```

### 3. Configurer l'API
Dans src/config.js :
```sh
export const API_URL = 'http://127.0.0.1:8000/api';
export const BASE_IMG_URL = 'http://127.0.0.1:8000/uploads';
```

### 4. Lancer le projet

```sh
npm run dev
```

Le projet sera accessible sur http://localhost:5173

## Compiler et minimiser pour la production

```sh
npm run build
```

## 🗂 Structure du projet
```sh
frontend/
├─ src/
│  ├─ assets/          # Styles, images, icônes
│  ├─ components/      # Composants réutilisables
│  ├─ layouts/         # Layouts (DashboardLayout, etc.)
│  ├─ pages/           # Pages principales (Dashboard, Users)
│  ├─ router/          # Routes de l'application
│  ├─ services/        # Appels API et services métier
│  ├─ store/           # Pinia stores (auth, users)
│  ├─ utils/           # Fonctions utilitaires
│  ├─ views/           # Vues (LoginView, UsersPage, DashboardView)
│  └─ App.vue
├─ public/             # Fichiers publics
├─ package.json
└─ vite.config.js
```
## 💻 Fonctionnalités

- Authentification par email + mot de passe avec JWT
- Dashboard avec statistiques
- Tableau des utilisateurs avec :
    - Pagination
    - Tri par ID
    - Filtre dynamique par nom et email
- Formulaire d'ajout / modification utilisateur
- Upload de photo de profil
- Notifications toast (succès / erreur)
- Affichage conditionnel des actions selon le rôle (admin / user)
- Déconnexion automatique après expiration du token

## 🛠 Technologies utilisées

- [Vue 3](https://v3.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [PrimeVue](https://primevue.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Vite](https://vite.dev/)

## 🔗 Liens utiles
- [Backend API Symfony](https://api-user-managment.adlabro.com/)
- [Documentation TailwindCSS](https://tailwindcss.com/docs/installation/using-vite/)
